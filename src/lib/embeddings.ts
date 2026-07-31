/**
 * Dense semantic vectors for the corpus, learned from the corpus itself.
 *
 * BM25 can only match words that are actually there. Someone typing "nobody
 * knows who gets the final say" shares no useful token with a concept written
 * about "decision rights" and "accountable owner", so lexical retrieval scores
 * it at zero no matter how well the fields are weighted. The hand-maintained
 * expansion table in `text.ts` patches the gap one synonym at a time, which
 * only ever covers the phrasings somebody thought to write down.
 *
 * This module closes the rest of it the way retrieval did before hosted models:
 * latent semantic analysis. Build the term-document matrix, take its truncated
 * SVD, and both documents and queries become vectors in a few dozen dimensions
 * where words that keep company across the corpus end up pointing the same way.
 * "Rotate", "credential" and "leaked" collapse onto one direction because the
 * secrets entry uses all three; a query with only one of them still lands near
 * that direction.
 *
 * Why not a real embedding model: the site has no backend and no API key, and
 * the CSP is `connect-src 'self'`, so there is nowhere to send a query to be
 * embedded and nothing to download a model from. A transformer would also be
 * tens of megabytes for a corpus of 119 documents. LSA fits in a few hundred
 * lines, runs in milliseconds, stays entirely in the browser, and — unlike a
 * pretrained model — its notion of similarity is derived from this vocabulary
 * rather than from the open web.
 *
 * The maths, briefly. `A` is terms x documents, entries log-damped tf-idf,
 * columns L2-normalised. `A = U S V'`. Documents are far fewer than terms, so
 * rather than decomposing `A` we decompose the small document gram matrix
 * `G = A'A = V S^2 V'`, which is symmetric positive semi-definite and only
 * 119x119. Jacobi rotations give `V` and `S` exactly, and `U = A V S^-1`
 * recovers the term vectors. Both documents and queries are then projected
 * onto `U` — `A'U = V S` for documents, `q'U` for a query — so the two live in
 * the same basis and cosine between them means something.
 */

/** Latent dimensions to keep. Past ~50 the tail is corpus noise, not meaning. */
const MAX_DIMS = 48

/** Eigenvalues below this fraction of the largest are numerical dust. */
const SPECTRUM_FLOOR = 1e-6

/** Cyclic Jacobi converges well inside this for a matrix of our size. */
const MAX_SWEEPS = 60

export interface SemanticSpace {
  /** Number of latent dimensions actually retained. */
  readonly dims: number
  /** Number of documents in the space. */
  readonly size: number
  /**
   * Project a bag of terms into the latent space, L2-normalised. Returns null
   * when none of the terms appear in the corpus at all — a query made entirely
   * of unknown words has no position, which is different from having a
   * position that happens to be far from everything.
   */
  fold(terms: Iterable<string>): Float64Array | null
  /** Cosine similarity between a folded vector and document `i`, in [-1, 1]. */
  similarity(vector: Float64Array, i: number): number
  /**
   * The terms lying closest to `term` in the latent space. Not used by ranking
   * — this is how you inspect what the space actually learned, which is the
   * only way to tell a useful dimension from a coincidence.
   */
  neighbours(term: string, k?: number): { term: string; score: number }[]
}

/** Inverse document frequency, matched to the BM25 index so the two agree. */
function idf(df: number, n: number): number {
  return Math.log(1 + (n - df + 0.5) / (df + 0.5))
}

/**
 * Symmetric eigendecomposition by cyclic Jacobi rotation.
 *
 * Chosen over the usual randomised range-finder because it is deterministic:
 * identical input gives bit-identical output, so rankings do not drift between
 * loads and the tests can assert on them. At n = 119 it costs a few
 * milliseconds, which buys nothing back by being approximate.
 *
 * `a` is mutated. Returns eigenvalues alongside eigenvectors held as columns
 * of a row-major n x n matrix.
 */
function jacobiEigen(a: Float64Array, n: number): { values: Float64Array; vectors: Float64Array } {
  const v = new Float64Array(n * n)
  for (let i = 0; i < n; i++) v[i * n + i] = 1

  for (let sweep = 0; sweep < MAX_SWEEPS; sweep++) {
    let off = 0
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) off += a[p * n + q] * a[p * n + q]
    }
    if (off < 1e-14) break

    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = a[p * n + q]
        if (Math.abs(apq) < 1e-15) continue

        // Rotation angle that zeroes the (p, q) entry.
        const theta = (a[q * n + q] - a[p * n + p]) / (2 * apq)
        const sign = theta >= 0 ? 1 : -1
        const t = sign / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
        const c = 1 / Math.sqrt(t * t + 1)
        const s = t * c

        // A stays symmetric throughout, so rotate one triangle and mirror it
        // rather than applying J twice. The diagonal has a closed form.
        a[p * n + p] -= t * apq
        a[q * n + q] += t * apq
        a[p * n + q] = 0
        a[q * n + p] = 0
        for (let k = 0; k < n; k++) {
          if (k === p || k === q) continue
          const akp = a[k * n + p]
          const akq = a[k * n + q]
          const np = c * akp - s * akq
          const nq = s * akp + c * akq
          a[k * n + p] = np
          a[p * n + k] = np
          a[k * n + q] = nq
          a[q * n + k] = nq
        }
        for (let k = 0; k < n; k++) {
          const vkp = v[k * n + p]
          const vkq = v[k * n + q]
          v[k * n + p] = c * vkp - s * vkq
          v[k * n + q] = s * vkp + c * vkq
        }
      }
    }
  }

  const values = new Float64Array(n)
  for (let i = 0; i < n; i++) values[i] = a[i * n + i]
  return { values, vectors: v }
}

function l2Normalise(vec: Float64Array): Float64Array {
  let sum = 0
  for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i]
  const norm = Math.sqrt(sum)
  if (norm > 0) for (let i = 0; i < vec.length; i++) vec[i] /= norm
  return vec
}

/**
 * Build the latent space from per-document term weights — the same weighted
 * frequencies the BM25 index already holds, so the two views of a document
 * cannot drift apart.
 */
export function buildSemanticSpace(
  documents: readonly ReadonlyMap<string, number>[],
  maxDims: number = MAX_DIMS,
): SemanticSpace {
  const n = documents.length

  // Postings: term -> the documents it occurs in, with tf-idf weight.
  const postings = new Map<string, { doc: number; weight: number }[]>()
  for (let i = 0; i < n; i++) {
    for (const [term, tf] of documents[i]) {
      let list = postings.get(term)
      if (!list) postings.set(term, (list = []))
      // Log damping so a term repeated across a long field does not swamp the
      // dimension it sits on.
      list.push({ doc: i, weight: 1 + Math.log(tf) })
    }
  }

  const vocabulary = [...postings.keys()]
  for (const term of vocabulary) {
    const list = postings.get(term)!
    const weight = idf(list.length, n)
    for (const p of list) p.weight *= weight
  }

  // Normalise document columns so long entries do not dominate the spectrum.
  const columnNorms = new Float64Array(n)
  for (const list of postings.values()) {
    for (const p of list) columnNorms[p.doc] += p.weight * p.weight
  }
  for (let i = 0; i < n; i++) columnNorms[i] = Math.sqrt(columnNorms[i]) || 1
  for (const list of postings.values()) {
    for (const p of list) p.weight /= columnNorms[p.doc]
  }

  // G = A'A, accumulated one term at a time over its own posting list. The
  // matrix is dense but tiny; the accumulation is sparse and cheap.
  const gram = new Float64Array(n * n)
  for (const list of postings.values()) {
    for (let x = 0; x < list.length; x++) {
      const a = list[x]
      gram[a.doc * n + a.doc] += a.weight * a.weight
      for (let y = x + 1; y < list.length; y++) {
        const b = list[y]
        const product = a.weight * b.weight
        gram[a.doc * n + b.doc] += product
        gram[b.doc * n + a.doc] += product
      }
    }
  }

  const { values, vectors } = jacobiEigen(gram, n)

  // Keep the leading dimensions, largest eigenvalue first.
  const order = [...values.keys()].sort((a, b) => values[b] - values[a])
  const largest = values[order[0]] ?? 0
  const kept = order
    .filter((j) => values[j] > largest * SPECTRUM_FLOOR)
    .slice(0, Math.min(maxDims, n))
  const dims = kept.length

  const sigma = new Float64Array(dims)
  for (let j = 0; j < dims; j++) sigma[j] = Math.sqrt(Math.max(values[kept[j]], 0))

  // Document coordinates: A'U = V S, i.e. column j of V scaled by its
  // singular value. Stored normalised because ranking only ever wants cosine.
  const docVectors: Float64Array[] = []
  for (let i = 0; i < n; i++) {
    const vec = new Float64Array(dims)
    for (let j = 0; j < dims; j++) vec[j] = vectors[i * n + kept[j]] * sigma[j]
    docVectors.push(l2Normalise(vec))
  }

  // Term vectors: U = A V S^-1. One pass per term over its posting list.
  const termVectors = new Map<string, Float64Array>()
  for (const [term, list] of postings) {
    const vec = new Float64Array(dims)
    for (const p of list) {
      for (let j = 0; j < dims; j++) vec[j] += p.weight * vectors[p.doc * n + kept[j]]
    }
    for (let j = 0; j < dims; j++) vec[j] /= sigma[j] || 1
    termVectors.set(term, vec)
  }

  // Query folding uses idf again to weight terms, so keep it to hand.
  const termIdf = new Map<string, number>()
  for (const [term, list] of postings) termIdf.set(term, idf(list.length, n))

  return {
    dims,
    size: n,

    fold(terms) {
      const counts = new Map<string, number>()
      for (const term of terms) {
        if (!termVectors.has(term)) continue
        counts.set(term, (counts.get(term) ?? 0) + 1)
      }
      if (!counts.size) return null

      const vec = new Float64Array(dims)
      for (const [term, count] of counts) {
        const termVector = termVectors.get(term)!
        const weight = (1 + Math.log(count)) * (termIdf.get(term) ?? 0)
        for (let j = 0; j < dims; j++) vec[j] += weight * termVector[j]
      }
      // An all-zero projection means the terms cancelled out in latent space,
      // which is not a position either.
      let sum = 0
      for (let j = 0; j < dims; j++) sum += vec[j] * vec[j]
      if (sum <= 0) return null
      return l2Normalise(vec)
    },

    similarity(vector, i) {
      const doc = docVectors[i]
      if (!doc) return 0
      let dot = 0
      for (let j = 0; j < dims; j++) dot += vector[j] * doc[j]
      return dot
    },

    neighbours(term, k = 8) {
      const target = termVectors.get(term)
      if (!target) return []
      const targetNorm = Math.sqrt(target.reduce((s, x) => s + x * x, 0))
      if (!targetNorm) return []

      const out: { term: string; score: number }[] = []
      for (const [other, vec] of termVectors) {
        if (other === term) continue
        let dot = 0
        let norm = 0
        for (let j = 0; j < dims; j++) {
          dot += target[j] * vec[j]
          norm += vec[j] * vec[j]
        }
        norm = Math.sqrt(norm)
        if (!norm) continue
        out.push({ term: other, score: dot / (targetNorm * norm) })
      }
      return out.sort((a, b) => b.score - a.score).slice(0, k)
    },
  }
}

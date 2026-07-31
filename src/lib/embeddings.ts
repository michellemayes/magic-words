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
 * tens of megabytes for a corpus of 619 documents. LSA fits in a few hundred
 * lines, runs in milliseconds, stays entirely in the browser, and — unlike a
 * pretrained model — its notion of similarity is derived from this vocabulary
 * rather than from the open web.
 *
 * The maths, briefly. `A` is terms x documents, entries log-damped tf-idf,
 * columns L2-normalised. `A = U S V'`. Documents are far fewer than terms, so
 * rather than decomposing `A` we decompose the small document gram matrix
 * `G = A'A = V S^2 V'`, which is symmetric positive semi-definite and only
 * as wide as the corpus. Below a few hundred documents Jacobi rotations give
 * `V` and `S` exactly; above that the whole spectrum costs seconds to compute
 * and all but the leading dimensions are discarded anyway, so subspace
 * iteration takes the leading ones directly. `U = A V S^-1`
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

/**
 * Document count above which the exact decomposition stops being affordable.
 *
 * Jacobi computes the whole spectrum, which costs a cubic pass per sweep. At
 * 119 documents that is a few milliseconds; at 619 it is nine seconds of
 * blocked main thread, and we throw away all but the leading `maxDims`
 * directions anyway. Below this bound the exact path is kept, so a small
 * corpus decomposes bit-identically to how it always has.
 */
const EXACT_MAX_DOCS = 200

/** Extra block columns beyond the dimensions kept, for subspace accuracy. */
const OVERSAMPLE = 10

/** Power iterations applied before extraction. Two is the usual sufficiency. */
const POWER_ITERATIONS = 2

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
 * loads and the tests can assert on them. At a few hundred documents it costs a few
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

/**
 * Deterministic block of starting vectors.
 *
 * A randomised range finder needs a random block, and a random block would
 * make rankings drift between page loads. A fixed linear congruential sequence
 * gives the same statistical spread with none of the drift, so identical input
 * still yields bit-identical output.
 */
function deterministicBlock(rows: number, cols: number): Float64Array {
  const block = new Float64Array(rows * cols)
  let state = 0x2f6e2b1
  for (let i = 0; i < block.length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    block[i] = state / 0x100000000 - 0.5
  }
  return block
}

/** Orthonormalise the columns of a rows x cols matrix in place, by modified Gram-Schmidt. */
function orthonormalise(m: Float64Array, rows: number, cols: number): void {
  for (let j = 0; j < cols; j++) {
    for (let k = 0; k < j; k++) {
      let dot = 0
      for (let i = 0; i < rows; i++) dot += m[i * cols + j] * m[i * cols + k]
      for (let i = 0; i < rows; i++) m[i * cols + j] -= dot * m[i * cols + k]
    }
    let norm = 0
    for (let i = 0; i < rows; i++) norm += m[i * cols + j] * m[i * cols + j]
    norm = Math.sqrt(norm)
    if (norm > 1e-12) {
      for (let i = 0; i < rows; i++) m[i * cols + j] /= norm
    } else {
      // Column collapsed into the span of its predecessors; it carries no
      // direction of its own, so leave it at zero rather than amplifying dust.
      for (let i = 0; i < rows; i++) m[i * cols + j] = 0
    }
  }
}

/** Dense symmetric `g` (n x n) times `block` (n x cols), into a fresh n x cols matrix. */
function gramTimesBlock(g: Float64Array, n: number, block: Float64Array, cols: number): Float64Array {
  const out = new Float64Array(n * cols)
  for (let i = 0; i < n; i++) {
    const rowOffset = i * n
    const outOffset = i * cols
    for (let k = 0; k < n; k++) {
      const weight = g[rowOffset + k]
      if (weight === 0) continue
      const blockOffset = k * cols
      for (let j = 0; j < cols; j++) out[outOffset + j] += weight * block[blockOffset + j]
    }
  }
  return out
}

/**
 * The leading `k` eigenpairs of a symmetric positive semi-definite matrix,
 * by subspace iteration against a deterministic starting block.
 *
 * Returns the same shape `jacobiEigen` does — eigenvectors as columns of a
 * row-major n x n matrix — with the columns past `k` left at zero and their
 * eigenvalues at zero, so the spectrum filter downstream discards them without
 * needing to know which path produced the result.
 */
function leadingEigenpairs(
  a: Float64Array,
  n: number,
  k: number,
): { values: Float64Array; vectors: Float64Array } {
  const block = Math.min(n, k + OVERSAMPLE)

  let q = deterministicBlock(n, block)
  orthonormalise(q, n, block)
  for (let iteration = 0; iteration <= POWER_ITERATIONS; iteration++) {
    q = gramTimesBlock(a, n, q, block)
    orthonormalise(q, n, block)
  }

  // Project onto the subspace: T = Q' A Q, small enough to decompose exactly.
  const aq = gramTimesBlock(a, n, q, block)
  const t = new Float64Array(block * block)
  for (let p = 0; p < block; p++) {
    for (let r = p; r < block; r++) {
      let sum = 0
      for (let i = 0; i < n; i++) sum += q[i * block + p] * aq[i * block + r]
      t[p * block + r] = sum
      t[r * block + p] = sum
    }
  }

  const small = jacobiEigen(t, block)

  // Lift the subspace eigenvectors back: V = Q * eigenvectors(T).
  const values = new Float64Array(n)
  const vectors = new Float64Array(n * n)
  for (let j = 0; j < block; j++) {
    values[j] = small.values[j]
    for (let i = 0; i < n; i++) {
      let sum = 0
      for (let p = 0; p < block; p++) sum += q[i * block + p] * small.vectors[p * block + j]
      vectors[i * n + j] = sum
    }
  }
  return { values, vectors }
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

  const wanted = Math.min(maxDims, n)
  const { values, vectors } =
    n <= EXACT_MAX_DOCS ? jacobiEigen(gram, n) : leadingEigenpairs(gram, n, wanted)

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

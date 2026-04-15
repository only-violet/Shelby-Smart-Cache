const reads = {}

export function trackRead(id) {
  reads[id] = (reads[id]  0) + 1
}

export function getStats(id) {
  return reads[id]  0
}

export function getAllStats() {
  return reads
}

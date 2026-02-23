export function constantTimeEquals(left: string, right: string): boolean {
  const size = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;

  for (let index = 0; index < size; index += 1) {
    const leftCode = left.charCodeAt(index) || 0;
    const rightCode = right.charCodeAt(index) || 0;
    diff |= leftCode ^ rightCode;
  }

  return diff === 0;
}

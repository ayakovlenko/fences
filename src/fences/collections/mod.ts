type RoA<T> = readonly T[];

export function difference<T>(xs: RoA<T>, ys: RoA<T>): T[] {
  const xsSet = new Set(xs);
  const ysSet = new Set(ys);
  const filtered: T[] = [];
  for (const x of xsSet) {
    if (ysSet.has(x)) continue;
    filtered.push(x);
  }
  return filtered;
}

export function summation(data: number[]): number {
  return data.reduce((prev, curr) => prev + curr, 0);
}

export function calculateMean(data: number[]): number {
  const n = data.length;
  return data.reduce((prev, curr) => prev + curr, 0) / n;
}

export function calculateStandardDeviation(data: number[]): number {
  if (data.length > 0) {
    const n = data.length;
    const mean = calculateMean(data);
    const sd = Math.sqrt(summation(data.map((x) => (x - mean) ** 2)) / n);
    return Number(sd.toFixed(2));
  }
  return 0;
}

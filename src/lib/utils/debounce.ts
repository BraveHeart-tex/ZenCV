/**
 * Creates a debounced version of the provided function, delaying its execution
 * until after the specified wait time has elapsed since the last call.
 *
 * @template T - The type of the function to debounce.
 * @param {T} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {(...args: Parameters<T>) => void} A debounced version of the provided function.
 */

// biome-ignore lint/suspicious/noExplicitAny: any is fine here
export function debounce<T extends (...args: any[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

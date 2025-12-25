/**
 * Converts a hex color string to its RGB equivalent.
 * @param {string} hex - The hex color code (e.g., "#ff5733").
 * @returns {Object} The RGB values of the color { r, g, b }.
 * @throws {Error} If the hex string is not valid.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const match = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) throw new Error('Invalid hex color');
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

/**
 * Calculates the luminance of a given RGB color.
 * @param {Object} rgb - The RGB values of the color { r, g, b }.
 * @returns {number} The luminance value, ranging from 0 (dark) to 1 (light).
 */
export function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

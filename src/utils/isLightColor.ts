export function isLightColor(rgb: string) {
  const parts = rgb.match(/\d+/g);
  if (!parts || parts.length !== 3) {
    return false;
  }
  const r = parseInt(parts[0]) || 0;
  const g = parseInt(parts[1]) || 0;
  const b = parseInt(parts[2]) || 0;
  // 輝度
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7;
}

export function getPrimaryImage(artwork) {
  if (!artwork) return "/placeholder.jpg";
  if (artwork.images && artwork.images.length > 0) return artwork.images[0];
  return artwork.image || "/placeholder.jpg";
}

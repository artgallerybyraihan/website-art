export const WHATSAPP_NUMBER = "6289529592251";

export function getWhatsAppLink(artworkTitle, { medium, size, artist } = {}) {
  const lines = [
    `Halo, saya tertarik dengan karya *"${artworkTitle}"*`,
    artist ? `oleh ${artist}` : "",
    medium ? `Medium: ${medium}` : "",
    size ? `Ukuran: ${size}` : "",
    "",
    "Boleh saya tahu detail harga dan ketersediaannya?",
    "",
    "Terima kasih 🙏",
    "— via artgallerybyraihan.com",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
}

export function getWhatsAppLinkGeneral() {
  const msg =
    "Halo, saya ingin mengetahui lebih lanjut tentang koleksi karya seni di Art Gallery by Raihan. Terima kasih 🙏";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

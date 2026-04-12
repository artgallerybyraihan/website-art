import ProductsClient from "@/components/ProductsClient";
import { getArtworksData } from "@/lib/data";

export default function ProductsPage() {
  const artworks = getArtworksData();
  
  return <ProductsClient artworks={artworks} />;
}

import HomeClient from "@/components/HomeClient";
import { getFeaturedArtworks } from "@/lib/data";

export default function Home() {
  const featuredArtworks = getFeaturedArtworks();
  
  return <HomeClient featuredArtworks={featuredArtworks} />;
}

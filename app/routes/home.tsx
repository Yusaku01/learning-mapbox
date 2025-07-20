import type { Route } from "./+types/home";
import { MapContainer } from "../components/MapContainer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mapbox学習プロジェクト" },
    {
      name: "description",
      content: "Mapbox GL JSを使った地理空間データ可視化",
    },
  ];
}

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <MapContainer
        width="100%"
        height="100%"
        styleUrl="mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif"
      />
    </div>
  );
}

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { Checkpoint } from "./api";

type Props = {
  checkpoints: Checkpoint[];
  userPos: [number, number] | null;
};

export default function MapView({ checkpoints, userPos }: Props) {
  return (
    <MapContainer center={userPos || [55.75, 37.62]} zoom={15} style={{ height: "80vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userPos && (
        <Marker position={userPos} icon={L.icon({ iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png", iconSize: [32, 32] })}>
          <Popup>Вы здесь</Popup>
        </Marker>
      )}
      {checkpoints.map((cp) => (
        <Marker key={cp.id} position={[cp.lat, cp.lng]}>
          <Popup>{cp.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

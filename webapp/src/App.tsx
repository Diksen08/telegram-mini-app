import { useEffect, useState } from "react";
import MapView from "./MapView";
import QrScanner from "./QrScanner";
import { fetchRoute, checkQRCode, Checkpoint } from "./api";

declare global {
  interface Window {
    Telegram: any;
  }
}

export default function App() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [scanning, setScanning] = useState(false);
  const tg = window.Telegram?.WebApp;

  useEffect(() => {
    tg?.ready();
    navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
      },
      () => tg?.showAlert("Разрешите доступ к геолокации"),
      { enableHighAccuracy: true }
    );
    fetchRoute(1).then(setCheckpoints).catch(() => tg?.showAlert("Ошибка загрузки маршрута"));
  }, []);

  function handleScan(result: string) {
    setScanning(false);
    const userId = tg?.initDataUnsafe?.user?.id;
    if (!userId) {
      tg?.showAlert("Ошибка: не определён user_id");
      return;
    }
    checkQRCode(userId.toString(), result)
      .then((msg) => tg?.showAlert("✅ " + msg))
      .catch((err) => tg?.showAlert("❌ " + err.message));
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Геоквест</h2>
      <MapView checkpoints={checkpoints} userPos={userPos} />
      <button onClick={() => setScanning(true)} style={{ margin: 12, padding: 10 }}>
        📷 Сканировать QR
      </button>
      {scanning && <QrScanner onScan={handleScan} />}
    </div>
  );
}

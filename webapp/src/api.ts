export type Checkpoint = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  qr_code: string;
};

export async function fetchRoute(cityId: number): Promise<Checkpoint[]> {
  const res = await fetch("http://localhost:8000/route/" + cityId);
  return await res.json();
}

export async function checkQRCode(userId: string, qr: string): Promise<string> {
  const res = await fetch("http://localhost:8000/checkin/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, qr_code: qr }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Ошибка проверки QR");
  return data.message || "Успешно!";
}

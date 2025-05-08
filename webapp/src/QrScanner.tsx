import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type Props = {
  onScan: (result: string) => void;
};

export default function QrScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const constraints = { video: { facingMode: "environment" } };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.play();
        requestAnimationFrame(scan);
      }
    });

    return () => {
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const scan = () => {
    if (!canvasRef.current || !videoRef.current || !scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);

      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScanning(false);
          onScan(code.data);
        }
      }
    }

    requestAnimationFrame(scan);
  };

  return (
    <div style={{ position: "relative" }}>
      <video ref={videoRef} style={{ width: "100%", borderRadius: "12px" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

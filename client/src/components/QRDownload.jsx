import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { saveAs } from "file-saver";

export default function QRDownload({ value, filename = "ticket" }) {
  const ref = useRef();

  const download = () => {
    const canvas = ref.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob((blob) => saveAs(blob, `${filename}.png`));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ref}
        className="p-3 rounded-2xl"
        style={{ background: "white" }}
      >
        <QRCodeCanvas
          value={value}
          size={160}
          bgColor="#ffffff"
          fgColor="#080808"
          level="H"
        />
      </div>
      <button
        onClick={download}
        className="btn-gold px-6 py-2.5 rounded-xl text-sm"
      >
        ⬇️ Download QR Ticket
      </button>
    </div>
  );
}

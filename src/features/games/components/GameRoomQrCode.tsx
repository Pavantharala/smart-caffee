import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, QrCode as QrIcon, Smartphone, Share2, Users } from 'lucide-react';

interface GameRoomQrCodeProps {
  code: string;
  gameTitle?: string;
  size?: number;
  onSimulateFriendJoin?: () => void;
  showSimulateButton?: boolean;
}

export const GameRoomQrCode: React.FC<GameRoomQrCodeProps> = ({
  code,
  gameTitle = '2-Player Café Game',
  size = 180,
  onSimulateFriendJoin,
  showSimulateButton = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState(false);

  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/?joinGame=${code}`;

  useEffect(() => {
    if (!code) return;

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        inviteUrl,
        {
          width: size,
          margin: 2,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        },
        (error) => {
          if (error) {
            console.error('QR Canvas Error:', error);
            setQrError(true);
          }
        }
      );
    }

    QRCode.toDataURL(
      inviteUrl,
      {
        width: size,
        margin: 2,
        color: {
          dark: '#1c1917',
          light: '#ffffff',
        },
      },
      (error, url) => {
        if (!error && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [code, inviteUrl, size]);

  const copyCodeToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const copyLinkToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 text-center flex flex-col items-center max-w-sm mx-auto shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
          <QrIcon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-bold text-white tracking-wide">Table Room QR</h4>
          <p className="text-xs text-stone-400">Scan to join {gameTitle}</p>
        </div>
      </div>

      <div className="relative p-3 bg-white rounded-2xl shadow-inner mb-4 inline-block">
        <canvas ref={canvasRef} className="rounded-lg block" />
        {qrError && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 rounded-xl text-xs text-stone-700 p-2 text-center">
            {inviteUrl}
          </div>
        )}
      </div>

      <div className="w-full bg-stone-800/80 rounded-xl p-3 mb-4 border border-stone-700/60 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            4-Digit Room Code
          </span>
          <span className="text-2xl font-black font-mono tracking-widest text-amber-400">
            {code}
          </span>
        </div>
        <button
          onClick={copyCodeToClipboard}
          className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          {copiedCode ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 w-full">
        <button
          onClick={copyLinkToClipboard}
          className="flex-1 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border border-stone-700 transition"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Invite Link</span>
            </>
          )}
        </button>

        {showSimulateButton && onSimulateFriendJoin && (
          <button
            onClick={onSimulateFriendJoin}
            title="Simulate a friend scanning from Table #4"
            className="py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-amber-500/30 transition whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Simulate Table Join</span>
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
        <Smartphone className="w-3 h-3 text-amber-400" />
        <span>Friends on the café Wi-Fi can scan directly with camera</span>
      </div>
    </div>
  );
};

import React from 'react';
import { QrCode, CheckCircle2 } from 'lucide-react';
import { useCafe } from '../../../context/CafeContext';

interface TableContextModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableContextModal: React.FC<TableContextModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentRestaurant,
    scannedTableNumber,
    setScannedTableNumber,
    tables,
  } = useCafe();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-md w-full p-6 border border-stone-800 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg">Table Context ({currentRestaurant.name})</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-400 mb-4">
          Customers scan their Café Table QR code to place orders directly from their table, or
          order takeaway parcel items.
        </p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => {
              setScannedTableNumber(null);
              onClose();
            }}
            className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
              scannedTableNumber === null
                ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
            }`}
          >
            <div>
              <p className="font-semibold text-sm">Direct Website URL</p>
              <p className="text-xs text-stone-400">Order Parcel takeaway or browse before seating</p>
            </div>
            {scannedTableNumber === null && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
          </button>

          <div className="pt-2">
            <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">
              Or Tap a Table to Simulate QR Scan:
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
              {tables.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setScannedTableNumber(t.number);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                    scannedTableNumber === t.number
                      ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                      : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-600'
                  }`}
                >
                  <span className="text-xs font-bold">Table #{t.number}</span>
                  <span className="text-[10px] text-stone-400 capitalize">{t.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};

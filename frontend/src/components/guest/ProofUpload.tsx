import React, { useRef } from 'react';

interface ProofUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  isUploading?: boolean;
}

export const ProofUpload: React.FC<ProofUploadProps> = ({
  selectedFile,
  onFileSelect,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Mohon pilih file gambar (JPG, PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
        </span>
        <label className="text-sm font-bold text-slate-800">
          Unggah Bukti Transfer QRIS <span className="text-rose-500">*</span>
        </label>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview bukti transfer"
              className="w-14 h-14 object-cover rounded-lg border border-slate-200"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-500 font-medium">
                {(selectedFile.size / 1024).toFixed(0)} KB • Siap dikirim
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isUploading}
            onClick={() => onFileSelect(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-5 border-2 border-dashed border-slate-300 hover:border-primary rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-primary transition-all bg-slate-50/50 hover:bg-primary/5 active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[30px] mb-1">add_photo_alternate</span>
          <span className="text-xs font-bold">Pilih Foto Bukti Transfer</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Maksimal 5MB (JPG/PNG)</span>
        </button>
      )}
    </div>
  );
};

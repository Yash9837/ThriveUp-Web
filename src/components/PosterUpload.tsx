"use client";

import { useState } from "react";

export function PosterUpload({ onFile }: { onFile: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onFile(file);
          if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
          } else {
            setPreview(null);
          }
        }}
        className="block w-full text-sm text-zinc-400
          file:mr-4 file:py-2.5 file:px-5
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-[#FF5900] file:text-white
          hover:file:bg-[#FF4400]
          cursor-pointer file:transition-colors"
      />
      {preview && (
        <div className="mt-6 w-48 h-64 rounded-xl border-2 border-dashed border-white/20 overflow-hidden relative shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}



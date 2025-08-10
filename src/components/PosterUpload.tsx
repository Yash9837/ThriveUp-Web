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
        className="block w-full text-sm"
      />
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="mt-2 h-40 rounded border object-cover" />
      )}
    </div>
  );
}



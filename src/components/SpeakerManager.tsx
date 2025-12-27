"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import type { Speaker } from "@/types/models";

interface SpeakerManagerProps {
  speakers: Speaker[];
  onSpeakersChange: (speakers: Speaker[]) => void;
}

export function SpeakerManager({ speakers, onSpeakersChange }: SpeakerManagerProps) {
  const [newSpeaker, setNewSpeaker] = useState<Speaker>({ name: "", imageURL: "" });

  const addSpeaker = () => {
    if (newSpeaker.name.trim() && newSpeaker.imageURL.trim()) {
      onSpeakersChange([...speakers, { ...newSpeaker }]);
      setNewSpeaker({ name: "", imageURL: "" });
    }
  };

  const removeSpeaker = (index: number) => {
    const updatedSpeakers = speakers.filter((_, i) => i !== index);
    onSpeakersChange(updatedSpeakers);
  };

  const updateSpeaker = (index: number, field: keyof Speaker, value: string) => {
    const updatedSpeakers = speakers.map((speaker, i) =>
      i === index ? { ...speaker, [field]: value } : speaker
    );
    onSpeakersChange(updatedSpeakers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium text-zinc-200">Speakers</h3>
        <span className="text-sm text-zinc-500">({speakers.length})</span>
      </div>

      {/* Existing Speakers */}
      {speakers.map((speaker, index) => (
        <div key={index} className="flex items-center gap-3 p-3 border border-white/10 rounded-lg bg-zinc-900/50">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <input
              type="text"
              value={speaker.name}
              onChange={(e) => updateSpeaker(index, "name", e.target.value)}
              placeholder="Speaker Name"
              className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
            />
            <input
              type="url"
              value={speaker.imageURL}
              onChange={(e) => updateSpeaker(index, "imageURL", e.target.value)}
              placeholder="Profile Image URL"
              className="px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => removeSpeaker(index)}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {/* Add New Speaker */}
      <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newSpeaker.name}
            onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
            placeholder="Speaker Name"
            className="flex-1 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
          />
          <input
            type="url"
            value={newSpeaker.imageURL}
            onChange={(e) => setNewSpeaker({ ...newSpeaker, imageURL: e.target.value })}
            placeholder="Profile Image URL"
            className="flex-1 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-brand/50 transition-colors"
          />
          <button
            type="button"
            onClick={addSpeaker}
            disabled={!newSpeaker.name.trim() || !newSpeaker.imageURL.trim()}
            className="px-4 py-2 bg-[#FF5900] text-white rounded-lg hover:bg-[#FF4400] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {speakers.length === 0 && (
        <p className="text-sm text-zinc-500 text-center py-4">
          No speakers added yet. Add speakers to provide more information about your event.
        </p>
      )}
    </div>
  );
}

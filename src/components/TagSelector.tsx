"use client";

import { useState, useMemo } from "react";
import { X, Check } from "lucide-react";
import { EVENT_TAGS } from "@/constants/events";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagSelector({ selectedTags, onTagsChange, maxTags = 10 }: TagSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const availableTags = useMemo(() => {
    return EVENT_TAGS.filter(
      (tag) =>
        !selectedTags.includes(tag) &&
        tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedTags, searchTerm]);

  const addTag = (tag: string) => {
    if (selectedTags.length < maxTags && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Tags ({selectedTags.length}/{maxTags})
      </label>

      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF5900] text-white text-sm rounded-full bg-opacity-80"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Tag Selection Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full px-3 py-2 border border-white/10 rounded-lg bg-zinc-900 text-white text-left focus:ring-[#FF5900] focus:border-[#FF5900] flex items-center justify-between hover:bg-zinc-800 transition-colors"
        >
          <span className={selectedTags.length === 0 ? "text-zinc-500" : ""}>
            {selectedTags.length === 0 ? "Select tags..." : `${selectedTags.length} tags selected`}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-auto">
            {/* Search Input */}
            <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-[#FF5900] focus:border-[#FF5900] text-sm text-white placeholder-zinc-500"
                autoFocus
              />
            </div>

            {/* Tag Options */}
            <div className="py-1">
              {availableTags.length === 0 ? (
                <div className="px-3 py-2 text-sm text-zinc-500">
                  {searchTerm ? "No tags found" : "All tags selected"}
                </div>
              ) : (
                availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-700 text-zinc-200 hover:text-white flex items-center gap-2 text-sm transition-colors"
                  >
                    <Check size={16} className="text-[#FF5900]" />
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-zinc-500 mt-1">
        Select up to {maxTags} tags that best describe your event. Tags help users discover your event.
      </p>
    </div>
  );
}

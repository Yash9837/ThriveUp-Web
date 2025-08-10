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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags ({selectedTags.length}/{maxTags})
      </label>

      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF5900] text-white text-sm rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:bg-[#FF4400] rounded-full p-0.5 transition-colors"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:ring-[#FF5900] focus:border-[#FF5900] flex items-center justify-between"
        >
          <span className={selectedTags.length === 0 ? "text-gray-500" : ""}>
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
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {/* Search Input */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FF5900] focus:border-[#FF5900] text-sm"
                autoFocus
              />
            </div>

            {/* Tag Options */}
            <div className="py-1">
              {availableTags.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {searchTerm ? "No tags found" : "All tags selected"}
                </div>
              ) : (
                availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
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
      <p className="text-xs text-gray-500 mt-1">
        Select up to {maxTags} tags that best describe your event. Tags help users discover your event.
      </p>
    </div>
  );
}

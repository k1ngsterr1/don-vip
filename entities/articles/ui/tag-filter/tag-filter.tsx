"use client";

import { Tag } from "@/shared/api/articles";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/shared/utils/cn";

interface TagFilterProps {
  tags: Tag[];
  selectedTag?: string;
  onTagSelect: (tagSlug?: string) => void;
  className?: string;
}

export const TagFilter = ({
  tags,
  selectedTag,
  onTagSelect,
  className = "",
}: TagFilterProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const handleTagClick = (tagSlug: string) => {
    if (selectedTag === tagSlug) {
      onTagSelect(); // Deselect if already selected
    } else {
      onTagSelect(tagSlug);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {/* All Articles Button */}
      <button
        onClick={() => onTagSelect()}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          "border hover:scale-105 active:scale-95",
          !selectedTag
            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
            : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
        )}
      >
        {locale === "ru" ? "Все статьи" : "All Articles"}
      </button>

      {/* Tag Buttons */}
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => handleTagClick(tag.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "border hover:scale-105 active:scale-95",
            selectedTag === tag.slug
              ? "text-white border-2 shadow-lg"
              : "bg-white text-gray-700 border-gray-300 hover:border-opacity-60"
          )}
          style={
            selectedTag === tag.slug
              ? {
                  backgroundColor: tag.color || "#3B82F6",
                  borderColor: tag.color || "#3B82F6",
                }
              : undefined
          }
          onMouseEnter={(e) => {
            if (selectedTag !== tag.slug) {
              const element = e.target as HTMLElement;
              element.style.borderColor = tag.color || "#3B82F6";
              element.style.color = tag.color || "#3B82F6";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedTag !== tag.slug) {
              const element = e.target as HTMLElement;
              element.style.borderColor = "";
              element.style.color = "";
            }
          }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

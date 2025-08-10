import { useState } from "react";

interface Tag {
    id: string;
    label: string;
    color?: string;
}

interface UseTagsProps {
    onChange?: (tags: Tag[]) => void;
    defaultTags?: Tag[];
    maxTags?: number;
    defaultColors?: string[];
}

export function useTags({
    onChange,
    defaultTags = [],
    maxTags = 10,
    defaultColors = [
        "bg-primary/70 text-white",
        "bg-primary/70 text-white",
        "bg-primary/70 text-white",
        "bg-primary/70 text-white",
        "bg-primary/70 text-white",
    ],
}: UseTagsProps = {}) {
    const [tags, setTags] = useState<Tag[]>(defaultTags);

    function addTag(tag: Tag) {
        if (tags.length >= maxTags) return;

        const newTags = [
            ...tags,
            {
                ...tag,
                color:
                    tag.color ||
                    defaultColors[tags.length % defaultColors.length],
            },
        ];
        setTags(newTags);
        onChange?.(newTags);
        return newTags;
    }

    function removeTag(tagId: string) {
        const newTags = tags.filter((t) => t.id !== tagId);
        setTags(newTags);
        onChange?.(newTags);
        return newTags;
    }

    function removeLastTag() {
        if (tags.length === 0) return;
        return removeTag(tags[tags.length - 1].id);
    }

    return {
        tags,
        setTags,
        addTag,
        removeTag,
        removeLastTag,
        hasReachedMax: tags.length >= maxTags,
    };
}
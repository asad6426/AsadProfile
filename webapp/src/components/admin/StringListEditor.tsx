"use client";

import { useEffect, useState } from "react";

export default function StringListEditor({
  title,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(items.join("\n"));

  useEffect(() => {
    setText(items.join("\n"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          );
        }}
        placeholder={placeholder || "One item per line"}
        className="field-input min-h-24"
      />
    </div>
  );
}

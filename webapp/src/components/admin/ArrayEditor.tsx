"use client";

export type FieldType = "text" | "textarea" | "number" | "list";

export interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
}

function randomId() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function ArrayEditor<T extends { id: string }>({
  title,
  items,
  onChange,
  fields,
  emptyItem,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig[];
  emptyItem: () => Omit<T, "id">;
}) {
  function updateField(index: number, key: string, value: unknown) {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function addItem() {
    onChange([...items, { id: randomId(), ...emptyItem() } as T]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <button
          type="button"
          onClick={addItem}
          className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
        >
          + Add
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nothing added yet.</p>
        )}

        {items.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="text-xs font-medium text-muted-foreground hover:text-primary disabled:opacity-30"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="text-xs font-medium text-muted-foreground hover:text-primary disabled:opacity-30"
              >
                Down
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => {
                const rawValue = (item as Record<string, unknown>)[field.key];
                const isFullWidth = field.type === "textarea" || field.type === "list";

                return (
                  <label key={field.key} className={isFullWidth ? "sm:col-span-2" : ""}>
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">
                      {field.label}
                    </span>
                    {field.type === "textarea" ? (
                      <textarea
                        value={(rawValue as string) || ""}
                        onChange={(e) => updateField(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="field-input min-h-20"
                      />
                    ) : field.type === "list" ? (
                      <textarea
                        value={((rawValue as string[]) || []).join("\n")}
                        onChange={(e) => updateField(index, field.key, e.target.value.split("\n"))}
                        placeholder={field.placeholder || "One item per line"}
                        className="field-input min-h-20"
                      />
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={(rawValue as number) ?? 0}
                        onChange={(e) => updateField(index, field.key, Number(e.target.value))}
                        className="field-input"
                      />
                    ) : (
                      <input
                        type="text"
                        value={(rawValue as string) || ""}
                        onChange={(e) => updateField(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="field-input"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Sort from "./Sort";

const SORT_METHODS = [
  { id: "quick", label: "Quick" },
  { id: "selection", label: "Selection" },
  { id: "gnome", label: "Gnome" },
  { id: "bubble", label: "Bubble" },
];
export default function SortList({ value, onChange }) {
  return (
    <div>
      <h2 className="block-title">Sort Method</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {SORT_METHODS.map((m) => (
          <Sort
            key={m.id}
            id={m.id}
            label={m.label}
            checked={value === m.id}
            onChange={() => onChange(m.id)}
          />
        ))}
      </div>
    </div>
  );
}

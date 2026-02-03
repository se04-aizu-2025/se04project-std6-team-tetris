export default function Sort({ id, label, checked, onChange }) {
  return (
    <label className={`sort-pill ${checked ? "active" : ""}`}>
      <input
        type="radio"
        name="sort-method"
        value={id}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

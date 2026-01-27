import React from "react";

const Sort = ({ options, value, onChange }) => {
  return (
    <div className="sort-radio">
      {options.map((opt) => (
        <label key={opt.id} className="sort-radio-item">
          <input
            type="radio"
            name="sorting-method"
            value={opt.id}
            checked={value === opt.id}
            onChange={(e) => onChange(e.target.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
};

export default Sort;

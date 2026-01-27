import React from "react";

const Sort = ({ options, value, onChange }) => {
    
  return (
    <div>
        {options.map((opt) => (

            <label key={opt.id}>
                <input
                  type="radio"
                  name="sorting-method"
                  value={opt.id}
                  checked={value === opt.id}
                  onChange={() => onChange(opt.id)}
                />
                {opt.label}
            </label>

        ))}
    </div>
  );
};

export default Sort;

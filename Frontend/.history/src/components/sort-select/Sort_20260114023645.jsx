import React from 'react'

const Sort = ({options}) => {
    
  return (
    <div>
        {options.map((opt) => (

            <label key={opt.id}>
                <input type="radio" name ="sorting-method" />
                {opt.label}
            </label>

        ))}
    </div>
  );
}

export default Sort

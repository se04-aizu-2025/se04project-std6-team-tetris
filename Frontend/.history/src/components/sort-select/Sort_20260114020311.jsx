import React from 'react'

const Sort = ({options}) => {
    
  return (
    <div>
        {options.map((opt) => (
            <label>
                <input type="checkbox" />
            </label>
            {opt.label}
        ))}
    </div>
  )
}

export default Sort

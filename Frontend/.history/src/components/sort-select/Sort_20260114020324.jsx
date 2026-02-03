import React from 'react'

const Sort = ({options}) => {
    
  return (
    <div>
        {options.map((opt) => (
            <label>
                <input type="checkbox" />
                {opt.label}
            </label>
        ))}
    </div>
  )
}

export default Sort

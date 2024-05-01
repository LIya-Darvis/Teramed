import React, { useState } from 'react';

function ComboBoxList({ options, onSelect }) {

    const [selectedOption, setSelectedOption] = useState(null);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <div>
            <select value={selectedOption} onChange={handleChange}>
                <option value="">Выберите услугу</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ComboBoxList
import React, { useState, useEffect } from 'react';
import './styles.css';

function DropdownList({ data, defaultSelectedId, onSelect }) {
    const [selectedId, setSelectedId] = useState(defaultSelectedId);
  
    const handleChange = (event) => {
      const selectedId = event.target.value;
      setSelectedId(selectedId);
      onSelect(selectedId);
    };
  
    useEffect(() => {
      setSelectedId(defaultSelectedId);
    }, [defaultSelectedId]);
  
    return (
      <select className='modal_dropdown_select' value={selectedId} onChange={handleChange}>
        <option className='modal_dropdown_option' value="">Выберите ...</option>
        {data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    );
  }

export default DropdownList



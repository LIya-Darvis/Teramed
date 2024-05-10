import React from 'react';
import './styles.css';

function DropdownList({ elements, onSelect }) {
    const handleSelectChange = (event) => {
        const selectedElement = event.target.value;
        const selectedElem = elements.find(elem => elem.name === selectedElement);
        if (selectedElem) {
            onSelect(selectedElem.id);
        } else {
            console.log('Элемент не выбран');
        }
    };

    return (
        <select className='modal_dropdown_select' onChange={handleSelectChange}>
            <option className='modal_dropdown_option' value="">Выберите...</option>
            {elements.map((element, index) => (
                <option key={index} value={element.name}>{element.name}</option>
            ))}
        </select>
    );
}

export default DropdownList



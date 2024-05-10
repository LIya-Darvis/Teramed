import React from 'react';
import './styles.css';

function ModalCheckBox({ title, value, onChange }) {
    return (
        <div className='modal_checkbox_frame'>
            <p>{title}</p>
            <input className='modal_checkbox' type="checkbox" checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
        </div>

    )
}

export default ModalCheckBox
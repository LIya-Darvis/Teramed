import React, { useState, useEffect } from 'react';
import './styles.css';

function ModalCheckBox({ title, value, onChange }) {
    return (
        <div className='modal_checkbox_frame'>
            <p>{title}</p>
            <input className='modal_checkbox' type="checkbox" checked={value}
                onChange={onChange}
            />
        </div>
    )
}
export default ModalCheckBox
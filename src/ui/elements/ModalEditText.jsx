import React from 'react';
import './styles.css';

function ModalEditText({placeholder, value, onChange}) {
  return (
    <input className='modal_edit_text' type='text' placeholder={placeholder}
        value={value} onChange={onChange} />
  )
}

export default ModalEditText
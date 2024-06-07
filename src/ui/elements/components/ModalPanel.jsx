import React from 'react'
import '../styles.css';

function ModalPanel({children}) {
  return (
    <div className='modal_background'>
        <div className='modal_frame'>
            {children}
        </div>
    </div>
  )
}

export default ModalPanel
import React from 'react'
import './styles.css';

function LdmCard(props) {
    return (
        <div className='ldm_card_frame' onClick={props.onClick}>
            <div className='ldm_main_info_col'>
                <h3>{props.name}</h3>
                <p>{props.description}</p>
                <p>Цена: {props.price}</p>
            </div>
            <div className='ldm_desc_col'>
                
            </div>
        </div>

    )
}

export default LdmCard
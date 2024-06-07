import { useState } from 'react';
import '../styles.css';

function MenuButton(props) {
    return (
        <div>
            <div className='menu_btn_background' onClick={props.onClick}>
                <p>{props.title}</p>
            </div>
        </div>
    )
}

export {MenuButton}
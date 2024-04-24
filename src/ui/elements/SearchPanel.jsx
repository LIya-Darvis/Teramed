import React from 'react'
import './styles.css'

export default function SearchPanel(props) {
    return (
        <div>
            <input type="text" className='seach_input' 
            placeholder='Найти...' onChange={props.onChange} />
        </div>
    )
}



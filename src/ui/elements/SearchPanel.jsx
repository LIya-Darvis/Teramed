import React from 'react'
import './styles.css'

export default function SearchPanel({ onChange }) {
    return (
        <div>
            <input 
                type="text" 
                className='search_input' 
                placeholder='Найти...' 
                onChange={onChange} 
            />
        </div>
    );
}



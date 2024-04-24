import React from 'react'
import './styles.css'

function EditButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../assets/icons/edit.svg" alt="edit"/> */}
      <p>Изменить</p>
    </div>
  )
}

function DeleteButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>Удалить</p>
    </div>
  )
}

function LogOutButton(props) {
  return (
    <div className='logout_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>Выйти</p>
    </div>
  )
}

export { EditButton, DeleteButton, LogOutButton }

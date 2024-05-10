import React from 'react'
import './styles.css'

export function EditButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../assets/icons/edit.svg" alt="edit"/> */}
      <p>Изменить</p>
    </div>
  )
}

export function DeleteButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>Удалить</p>
    </div>
  )
}

export function MedCardButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>Мед карта</p>
    </div>
  )
}

export function LogOutButton(props) {
  return (
    <div className='logout_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>Выйти</p>
    </div>
  )
}

export function AddButton(props) {
  return (
    <div className='add_button' onClick={props.onClick}>
      {/* <img src="../../assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
    </div>
  )
}

export function CloseButton(props) {
  return (
    <div className='close_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
    </div>
  )
}

export function ConfirmButton(props) {
  return (
    <div className='confirm_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
    </div>
  )
}


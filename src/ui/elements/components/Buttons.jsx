import React from 'react'
import '../styles.css'
import closeIcon from '../../../assets/icons/close-svgrepo-com.svg';

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

export function SickHistoryViewButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
    </div>
  )
}

export function AnalysViewButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
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
      {/* <img src={closeIcon} style={{
                width: '20px', height: '20px',
                borderRadius: '50px', padding: '6px'
            }}/> */}
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

export function DopInfoButton(props) {
  return (
    <div className='table_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
    </div>
  )
}

export function TopPanelButton(props) {
  return (
    <div className='top_panel_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
    </div>
  )
}

export function TopPanelDopButton(props) {
  return (
    <div className='top_panel_dop_button' onClick={props.onClick}>
      {/* <img src="../../../src/assets/icons/delete.svg" alt="delete"/> */}
      <p>{props.title}</p>
    </div>
  )
}


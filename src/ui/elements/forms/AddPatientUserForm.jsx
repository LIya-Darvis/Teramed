import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { addUserAndPatient } from "../../../api/supabaseApi";
import useRealtimeData from "../../../dataProviders/useRealtimeData";
import './styles.css'; // Импорт стилей формы

const AddPatientUserForm = ({ onClose }) => {
    const { register, handleSubmit } = useForm();


    const onSubmit = async (data) => {
        try {
            await addUserAndPatient(data, data, "");
            onClose(); // Закрытие формы
        } catch (error) {
            console.error('Error adding user and patient:', error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                <h2>Параметры пользователя</h2>
                <input {...register('username')} placeholder="Имя пользователя" className="input-field" />
                <input {...register('login')} placeholder="Логин" className="input-field" />
                <input {...register('password')} type="password" placeholder="Пароль" className="input-field" />
                <h2>Параметры пациента</h2>
                <input {...register('lastname')} placeholder="Фамилия" className="input-field" />
                <input {...register('name')} placeholder="Имя" className="input-field" />
                <input {...register('surname')} placeholder="Отчество" className="input-field" />
                <input {...register('address')} placeholder="Адрес" className="input-field" />
                <input {...register('birthday')} type="date" placeholder="Дата рождения" className="date-picker" />
                <input {...register('email')} type="email" placeholder="Email" className="input-field" />
                <input {...register('phone')} placeholder="Телефон" className="input-field" />
                <input {...register('passport_num')} placeholder="Номер паспорта" className="input-field" />
                <input {...register('passport_series')} placeholder="Серия паспорта" className="input-field" />
                <input {...register('photo')} type="text" placeholder="Фото" className="input-field" />
                <input {...register('polis_final_date')} type="date" placeholder="Дата окончания полиса" className="date-picker" />
                <input {...register('polis_num')} placeholder="Номер полиса" className="input-field" />
                <button type="submit" className="submit-button">Подтвердить</button>
            </form>
        </div>
    );
};

export default AddPatientUserForm;


import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { addUserAndDoctor, uploadPhoto } from "../../../api/supabaseApi";
import useRealtimeData from "../../../dataProviders/useRealtimeData";
import './styles.css';


const AddDoctorUserForm = ({ onClose }) => {
    const { register, handleSubmit } = useForm();
    const positions = useRealtimeData('get_positions').data;
    const [photo, setPhoto] = useState(null);

    if (!positions) return null;

    const onSubmit = async (data) => {
        try {
            await addUserAndDoctor(data, data, "");
            onClose(); // Закрытие формы
        } catch (error) {
            console.error('Error adding user and doctor:', error);
        }
    };

    if (!positions) return null;

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="form-content">
                    <h2>Параметры пользователя</h2>
                    <input {...register('username')} placeholder="Имя пользователя" className="input-field" />
                    <input {...register('login')} placeholder="Логин" className="input-field" />
                    <input {...register('password')} type="password" placeholder="Пароль" className="input-field" />
                    <h2>Параметры врача</h2>
                    <select {...register('id_position')} className="select-field">
                        {positions.map(position => (
                            <option key={position.id} value={position.id}>{position.name}</option>
                        ))}
                    </select>
                    <label className="checkbox-label">
                        <input {...register('is_available')} type="checkbox" />
                        Доступен для записи
                    </label>
                    <input {...register('lastname')} placeholder="Фамилия" className="input-field" />
                    <input {...register('name')} placeholder="Имя" className="input-field" />
                    <input {...register('surname')} placeholder="Отчество" className="input-field" />
                <button type="submit" className="submit-button">Подтвердить</button>
            </form>
        </div>
    );
};

export default AddDoctorUserForm;


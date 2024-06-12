import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { addUserAndDoctor, uploadPhoto } from "../../../api/supabaseApi";


const AddDoctorUserForm = () => {
    const { register, handleSubmit } = useForm();
    const [photo, setPhoto] = useState(null);
    const [photoURL, setPhotoURL] = useState('');
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setPhoto(acceptedFiles[0]);
        }
    });

    const onSubmit = async (data) => {
        console.log(data)
        if (photo) {
            const uploadedPhotoURL = await uploadPhoto(photo);
            console.log(uploadedPhotoURL)
            // await addUserAndDoctor(data, data, uploadedPhotoURL);
        } else {
            // await addUserAndDoctor(data, data, '');
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', height: '100vh', overflowY: 'auto' }}>
                <div style={{ flex: 1, padding: '20px' }}>
                    <h2>Параметры пользователя</h2>
                    <input {...register('username')} placeholder="Имя пользователя" />
                    <input {...register('login')} placeholder="Логин" />
                    <input {...register('password')} type="password" placeholder="Пароль" />

                    <h2>Параметры врача</h2>
                    <input {...register('id_position')} placeholder="Position ID" />
                    <input {...register('is_archived')} type="checkbox" />
                    <input {...register('is_available')} type="checkbox" />
                    <input {...register('lastname')} placeholder="Фамилия" />
                    <input {...register('name')} placeholder="Имя" />
                    <input {...register('surname')} placeholder="Отчество" />
                    <button type="submit">Подтвердить</button>
                </div>

                <div style={{ flex: 1, padding: '20px' }}>
                    <div {...getRootProps({ className: 'dropzone' })} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                        <input {...getInputProps()} />
                        {
                            photo ?
                                <img src={URL.createObjectURL(photo)} alt="Uploaded photo" style={{ maxWidth: '100%' }} /> :
                                <p>Добавить фото (переместить или нажать)</p>
                        }
                    </div>
                </div>
            </form>
        </div>

    );
};

export default AddDoctorUserForm;


import React from 'react';

export const ErrorMessage = ({ error, status }) => {
    return (
        <div>
            <p>Ошибка: {error}</p>
            <p>Статус: {status}</p>
        </div>
    );
};
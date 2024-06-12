import React, { useEffect, useState } from "react";


const AddDoctorUserForm = ({ onSubmit }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [positionId, setPositionId] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [lastname, setLastname] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [positions, setPositions] = useState([]);


    return (
        <div>
            форма добавления врача
        </div>

    );
};

export default AddDoctorUserForm;


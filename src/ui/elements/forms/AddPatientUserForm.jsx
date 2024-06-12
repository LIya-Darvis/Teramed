import React, { useEffect, useState } from "react";

const AddPatientUserForm = ({ onSubmit }) => {
    const [address, setAddress] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [genderId, setGenderId] = useState('');
    const [userId, setUserId] = useState('');
    const [isArchived, setIsArchived] = useState(false);
    const [lastname, setLastname] = useState('');
    const [medDate, setMedDate] = useState('');
    const [name, setName] = useState('');
    const [passportNum, setPassportNum] = useState('');
    const [passportSeries, setPassportSeries] = useState('');
    const [phone, setPhone] = useState('');
    const [photo, setPhoto] = useState('');
    const [polisFinalDate, setPolisFinalDate] = useState('');
    const [polisNum, setPolisNum] = useState('');
    const [surname, setSurname] = useState('');
    const [genders, setGenders] = useState([]);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');



    return (
        <div>
            форма добавления пациента
        </div>
    );
};

export default AddPatientUserForm;


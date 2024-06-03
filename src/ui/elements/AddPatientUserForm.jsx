import React, { useEffect, useState } from "react";
import { getGenders } from "../../components/fire_api";
import ModalEditText from "./ModalEditText";
import { DropdownList } from "./DropdownLists";
import ModalCheckBox from "./ModalCheckBox";
import DatePickerComponent from "./DatePickerComponent";


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

    useEffect(() => {
        const fetchGenders = async () => {
            const gendersData = await getGenders();
            setGenders(gendersData);
        };

        fetchGenders();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            address, birthday, email, genderId, userId,
            lastname, medDate, name, passportNum, passportSeries,
            phone, polisFinalDate, polisNum, surname,
            login, password, username,
        });
    };

    return (
        <form onSubmit={handleSubmit} style={containerStyle}>
            <ModalEditText placeholder="Фамилия" value={lastname} onChange={(e) => setLastname(e.target.value)} />
            <ModalEditText placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
            <ModalEditText placeholder="Отчество" value={surname} onChange={(e) => setSurname(e.target.value)} />
            <DropdownList
                options={genders}
                value={genderId}
                onChange={(e) => setGenderId(e.target.value)}
                placeholder="Выберите пол"
            />
            <p style={datePickerName}>Дата начала медицинского обслуживания</p>
            <DatePickerComponent selectedDate={medDate} onChange={date => setMedDate(date)} />
            <p style={datePickerName}>Дата рождения</p>
            <DatePickerComponent selectedDate={birthday} onChange={date => setBirthday(date)} />
            <ModalEditText placeholder="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} />
            <ModalEditText placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <ModalEditText placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <ModalEditText placeholder="Серия паспорта" value={passportSeries} onChange={(e) => setPassportSeries(e.target.value)} />
            <ModalEditText placeholder="Номер паспорта" value={passportNum} onChange={(e) => setPassportNum(e.target.value)} />
            <ModalEditText placeholder="Номер полиса" value={polisNum} onChange={(e) => setPolisNum(e.target.value)} />
            <p style={datePickerName}>Дата окончания действия полиса</p>
            <DatePickerComponent selectedDate={polisFinalDate} onChange={date => setPolisFinalDate(date)} />
            <ModalEditText placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
            <ModalEditText placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
            <ModalEditText placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} />

            <button style={form_button} type="submit">Добавить пациента</button>
        </form>
    );
};

export default AddPatientUserForm;

const containerStyle = {
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    maxHeight: '55vh',
    // maxWidth: '60vw',
    // minWidth: '30vw',
    overflowY: 'scroll',
    padding: '35px 15px 15px 15px',
};

const datePickerName = {
    margin: '0px',
};

const form_button = {
    margin: '20px 0px',
    padding: '10px',
    backgroundColor: '#4B5672',
    color: '#fff',
    borderRadius: '4px'
}



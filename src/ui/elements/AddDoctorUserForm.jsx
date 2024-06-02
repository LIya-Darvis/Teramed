import React, { useEffect, useState } from "react";
import { getPositions } from "../../components/fire_api";
import ModalEditText from './ModalEditText';
import { DropdownList } from './DropdownLists';
import ModalCheckBox from './ModalCheckBox';


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

    useEffect(() => {
        const fetchPositions = async () => {
            const positionsData = await getPositions();
            setPositions(positionsData);
        };

        fetchPositions();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ login, password, username, positionId, isAvailable, lastname, name, surname });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={containerStyle}>
                <ModalEditText placeholder="Фамилия" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                <ModalEditText placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
                <ModalEditText placeholder="Отчество" value={surname} onChange={(e) => setSurname(e.target.value)} />
                <DropdownList
                    options={positions}
                    value={positionId}
                    onChange={(e) => setPositionId(e.target.value)}
                    placeholder="Выберите должность специалиста"
                />
                <ModalCheckBox title="Доступен для записи" value={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
                <ModalEditText placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
                <ModalEditText placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
                <ModalEditText placeholder="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} />
                <button type="submit">Добавить учетную запись </button>
            </form>
        </div>

    );
};

export default AddDoctorUserForm;

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    maxHeight: '65vh',
    // maxWidth: '60vw',
    // minWidth: '30vw',
    // overflowY: 'scroll',
    padding: '0px 15px',
};
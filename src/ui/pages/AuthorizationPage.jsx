// const styles = require('./styles.css');
import './styles.css';
// import { css } from "@emotion/react";
import { motion, useAnimate, usePresence } from "framer-motion";
import { useState, useContext, createContext, useEffect } from 'react';
import React from 'react';
import { useData } from '../../components/DataProvider.jsx';
import { User } from '../../components/classes.js';


import { getUsers } from '../../components/fire_api.js';

// авторизация
function AuthorizationPage() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState(' ');
    const { data, setData } = useData();


    async function autorization(login, password) {
        if (login.trim() === "" || password.trim() === "") {
            setErrorText("Введите данные");
        } else {
            try {

                var users = await getUsers();
                // если данные пользователей по апи успешно получены
                if (users) {
                    console.log(users);
                    for (var user of users) {
                        if (user.login === login && user.password === password) {
                            console.log(' -> ', user.id, user.role.name, user.username, 
                                user.login, user.password, user.photo);
                            var authUser = new User(user.id, user.role.name, user.username, 
                                    user.login, user.password, user.photo)

                            setData({ isLogin: true, userData: authUser });
                            console.log("-> ", data)
                            setErrorText("");
                        }
                        else {
                            setErrorText("Неверный логин или пароль");
                        }
                    }
                } else {
                    setErrorText("Ошибка подключения к серверу");
                }
            } catch (error) {
                console.log(error.message);
            }
        }


    }



    return (
        <div className='authorization_back_frame'>
            {/* <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.7 }} // длительность анимации
                style={{ position: "fixed", top: 0, left: 0, transform: "translateX(-50%)" }}
            >
                🌌👾✨ неправильный логин или пароль
            </motion.div> */}

            <div className='authorization_panel'>
                <div className='authorization_form'>
                    <h2 className='authorization_label'>TERAMED</h2>
                    <div className='authorization_edit_group'>
                        <input className='authorization_edit_text' type='text'
                            placeholder='Логин' value={login} onChange={e => setLogin(e.target.value)} />
                        <input className='authorization_edit_text' type='password'
                            placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <p className='error_text'>{errorText}</p>
                    <button className='panel_btn' onClick={() => autorization(login, password)}>Войти</button>
                </div>
            </div>

        </div>

    )
}

export { AuthorizationPage }





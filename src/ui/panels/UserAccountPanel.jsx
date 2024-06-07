import React from 'react'
import { useData } from '../../dataProviders/DataProvider';
import './styles.css';

export default function UserAccountPanel() {

    const { data, setData } = useData();

    return (
        <div className='user_account_panel'>
            <div className='user_avatar'>
                {/* <div className='user_photo' />
                 */}
                 <img src={data.userData.photo} className='user_photo'/>
                <div className='chat_button'/>
            </div>

            <p>{data.userData.userName}</p>

        </div>
    )
}

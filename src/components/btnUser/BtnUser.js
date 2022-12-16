import classNames from 'classnames/bind';
import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';

import style from './BtnUser.module.scss'
import icon from '../../assets/image/default-avatar.jpg'
import { db } from '../../firebase'
import { AuthContext } from '../../context/AuthContext'

function BtnUser() {
    const cl = classNames.bind(style)
    const {currentUser}= useContext(AuthContext)
    const [user, setUser] = useState({})
    
    // Lấy thông tin người dùng đang hoạt động
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "users", currentUser.uid),
            (doc) => {
                setUser({ id: doc.id, ...doc.data() })
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    }, [currentUser])

    return (
        <div className={cl('btn-user')}>
            <div className={cl('icon-avatar')}>
                <img
                    className={cl('avatar')}
                    src={user.avatar || icon}
                    alt='avatar'
                />
            </div>
            <div className={cl('username')}>
                {user.name}
            </div>
        </div>
    );
}

export default BtnUser;
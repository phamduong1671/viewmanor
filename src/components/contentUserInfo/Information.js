import classNames from "classnames/bind";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import style from './Information.module.scss'
import { AuthContext } from '../../context/AuthContext'
import { db } from '../../firebase'

function Information() {
    const cl = classNames.bind(style)
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState({})

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {
                    if (doc.id === currentUser.uid)
                        setUser({ id: doc.id, ...doc.data() })
                });
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, [currentUser])

    return (
        <div className={cl('content')}>
            <div className={cl('props')}>
                Thông tin
                <div className={cl('props-item')}>
                    <label>Họ Tên</label>
                    <label className={cl('value-item')}>{user.name}</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Email</label>
                    <label className={cl('value-item')}>{user.email}</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Số điện thoại</label>
                    <label className={cl('value-item')}>{user.phone}</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Địa chỉ cụ thể</label>
                    <label className={cl('value-item')}>{user.address}</label>
                </div>
            </div>
            <div className={cl('props')}>
                Liên hệ
                <div className={cl('props-item')}>
                    <label>Facebook</label>
                    <label className={cl('value-item')}>{user.facebook}</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Zalo</label>
                    <label className={cl('value-item')}>{user.zalo}</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Khác</label>
                    <label className={cl('value-item')}>{user.other}</label>
                </div>
            </div>
        </div>
    );
}



export default Information;

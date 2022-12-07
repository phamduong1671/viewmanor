import classNames from "classnames/bind";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

import style from './UserManager.module.scss'
import { useContext, useEffect, useState } from "react";
import { db } from '../../firebase.js'
import { AuthContext } from '../../context/AuthContext'

function UserManager({ id }) {
    const cl = classNames.bind(style)
    const { currentUser } = useContext(AuthContext)
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            let list = []
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach(doc => {
                    if(doc.id !== currentUser.uid)
                        list.push({ id: doc.id, ...doc.data() })
                });
                console.log(list);
                setUsers(list)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser();
    }, [currentUser])

    const handleDelete = async (id) => {
        if (window.confirm('Xóa tài khoản này?')) {
            try {
                await deleteDoc(doc(db, "users", id));
                setUsers(users.filter(item => item.id !== id))
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleStatus = (e) => {
        if (e.value === 'Chặn') {
            if (window.confirm('Bỏ chặn người dùng này?')) {
                console.log('đã bỏ chặn');
            }
        } else {
            if (window.confirm('Chặn người dùng này?')) {
                console.log('đã chặn');
            }
        }
    }

    return (
        <div className={cl('content')}>
            <div className={cl('wrap-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Trạng thái</th>
                            <th>Cấp</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) =>
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        id={user.id}
                                        value={user.status}
                                        title="Chặn/Bỏ chặn"
                                        className={cl('btn-icon', 'btn-status')}
                                        onClick={(e) => handleStatus(e.target)}
                                    ></button>
                                    <button
                                        id={user.id}
                                        title="Xóa"
                                        className={cl('btn-icon', 'btn-delete')}
                                        onClick={(e) => handleDelete(e.target.id)}
                                    ></button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}



export default UserManager;

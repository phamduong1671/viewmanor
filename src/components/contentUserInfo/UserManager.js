import classNames from "classnames/bind";
import { collection, doc, runTransaction, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import style from './UserManager.module.scss'
import { db } from '../../firebase.js'

function UserManager({ id }) {
    const cl = classNames.bind(style)
    const [users, setUsers] = useState([])

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    if (doc.id !== id)
                        list.push({ id: doc.id, ...doc.data() })
                });
                setUsers(list);
            }, (error) => {
                console.log(error);
            }
        );

        return () => {
            unsub();
        }

    }, [id])

    const handleDisable = async (e) => {
        let user = {}
        users.forEach(item => {
            if (item.id === e.target.id)
                user = item
        })

        if (user.status === 'Bình thường') {
            if (window.confirm('Khóa tài khoản này?')) {
                try {
                    await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(doc(db, "users", e.target.id));
                        if (!sfDoc.exists()) {
                            // eslint-disable-next-line
                            throw "Document does not exist!";
                        }
                        transaction.update(doc(db, "users", user.id), { ...user, status: 'Bị khóa' });
                    });
                    console.log('đã khóa');
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
            }
        } else {
            if (window.confirm('Mở khóa tài khoản này?')) {
                try {
                    await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(doc(db, "users", e.target.id));
                        if (!sfDoc.exists()) {
                            // eslint-disable-next-line
                            throw "Document does not exist!";
                        }
                        transaction.update(doc(db, "users", user.id), { ...user, status: 'Bình thường' });
                    });
                    console.log('đã mở khóa');
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
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
                                        title="Xóa"
                                        value={user.status}
                                        className={cl('btn-icon', 'btn-disable')}
                                        onClick={(e) => handleDisable(e)}
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

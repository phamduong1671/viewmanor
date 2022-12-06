import classNames from "classnames/bind";

import style from './UserManager.module.scss'
import InputContainer from '../inputContainer'
import { userItem } from '../../database.js'
import { useState } from "react";

function UserManager({ id }) {
    const cl = classNames.bind(style)
    const [users, setUsers] = useState(userItem.filter(item => item.userId !== id))

    const handleDelete = (e) => {
        if (window.confirm('Xóa tin này?')) {
            let newUsers = users.filter(item => JSON.stringify(item.userId) !== e)
            setUsers(newUsers)
        }
    }
    
    const handleStatus = (e) => {
        if(e.value == 'Chặn'){
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
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        id={user.userId}
                                        value={user.status}
                                        title="Chặn/Bỏ chặn"
                                        className={cl('btn-icon', 'btn-status')}
                                        onClick={(e) => handleStatus(e.target)}
                                    ></button>
                                    <button
                                        id={user.userId}
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

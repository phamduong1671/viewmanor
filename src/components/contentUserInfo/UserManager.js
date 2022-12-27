import classNames from "classnames/bind";
import { collection, doc, runTransaction, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";

import style from './UserManager.module.scss'
import InputContainer from '../inputContainer'
import { db } from '../../firebase.js'
import Pagination from "../pagination";

let PageSize = 10;

function UserManager({ id }) {
    const cl = classNames.bind(style)
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return users.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, users]);

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

    const handleChangeRole = (e)=> {
        let user = {}
        users.forEach(item => {
            if (item.id === e.target.id)
                user = item
        })

        if (user.role === 'Người dùng') {
            if (window.confirm('Phân quyền quản trị viên cho tài khoản này?')) {
                try {
                    console.log('Đã phân quyền');
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
            }
        } else {
            if (window.confirm('Phân quyền người dùng cho tài khoản này?')) {
                try {
                    console.log('đã phân quyền');
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
            }
        }
    }

    return (
        <div className={cl('content')}>
            <div className={cl('header-content')}>Quản lý tài khoản người dùng</div>
            <div className={cl('header')}>
                <div>
                    <InputContainer id='thoigian' value='Tất cả' />
                </div>
                <div className={cl('header-right')}>
                    <input
                        className={cl('box-search')}
                        placeholder='Tìm theo email'
                    />
                    <input
                        className={cl('box-search')}
                        placeholder='Số điện thoại'
                    />
                </div>
            </div>
            <div className={cl('wrap-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Trạng thái</th>
                            <th>Cấp</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTableData.map((user, index) =>
                            <tr key={index}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.status}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        id={user.id}
                                        title="Xóa"
                                        value={user.status}
                                        className={cl('btn-icon', 'btn-change-role')}
                                        onClick={(e) => handleChangeRole(e)}
                                    ></button>
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
            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={users.length}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    );
}



export default UserManager;

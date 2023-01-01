import classNames from "classnames/bind";
import { collection, doc, runTransaction, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import style from './UserManager.module.scss'
import { db } from '../../firebase.js'
import Pagination from "../pagination";

let PageSize = 10;
const roles = ['Tất cả', 'Người dùng', 'Quản trị viên']

function UserManager({ id }) {
    const cl = classNames.bind(style)
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState({})
    const [show, setShow] = useState(false)
    const [role, setRole] = useState('Tất cả')

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
                    if (doc.id !== id &&
                        doc.data().email.toLowerCase().search(search.emailSearch) !== -1 &&
                        doc.data().phone.toLowerCase().search(search.phoneSearch) !== -1
                    ) {
                        if (role === 'Tất cả')
                            list.push({ id: doc.id, ...doc.data() })
                        else if (doc.data().role === role)
                            list.push({ id: doc.id, ...doc.data() })
                    }
                });
                setUsers(list);
            }, (error) => {
                console.log(error);
            }
        );

        return () => {
            unsub();
        }

    }, [id, search, role])

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

    const handleChangeRole = async (e) => {
        let user = {}
        users.forEach(item => {
            if (item.id === e.target.id)
                user = item
        })

        if (user.role === 'Người dùng') {
            if (window.confirm('Phân quyền cho tài khoản này là Quản trị viên?')) {
                try {
                    await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(doc(db, "users", e.target.id));
                        if (!sfDoc.exists()) {
                            // eslint-disable-next-line
                            throw "Document does not exist!";
                        }
                        transaction.update(doc(db, "users", user.id), { ...user, role: 'Quản trị viên' });
                    });
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
            }
        } else {
            if (window.confirm('Phân quyền cho tài khoản này là Người dùng?')) {
                try {
                    await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(doc(db, "users", e.target.id));
                        if (!sfDoc.exists()) {
                            // eslint-disable-next-line
                            throw "Document does not exist!";
                        }
                        transaction.update(doc(db, "users", user.id), { ...user, role: 'Người dùng' });
                    });
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
            }
        }
    }

    const handleSearch = (e) => {
        setSearch({ ...search, [e.target.id]: e.target.value })
    }

    const showValue = (e) => {
        setShow(!show)
    }

    const selectItem = (e) => {
        setRole(e.target.id)
    }

    return (
        <div className={cl('content')}>
            <div className={cl('header-content')}>Quản lý tài khoản người dùng</div>
            <div className={cl('header')}>
                <div>
                    <div
                        id='role'
                        className={cl('cbb-container')}
                        onClick={(e) => showValue(e)}
                    >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={role || 'Tất cả'}
                                readOnly
                            />
                            <div className={cl('icon-dropdown')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        {show &&
                            <div className={cl('cbb-value')}>
                                {roles.map(item => (
                                    <div
                                        id={item}
                                        key={item}
                                        className={cl('cbb-item')}
                                        onClick={(e) => selectItem(e)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className={cl('header-right')}>
                    <input
                        id="emailSearch"
                        className={cl('box-search')}
                        placeholder='Tìm theo email'
                        onChange={e => handleSearch(e)}
                    />
                    <input
                        id="phoneSearch"
                        className={cl('box-search')}
                        placeholder='Số điện thoại'
                        onChange={e => handleSearch(e)}
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
                                        title="Phân quyền"
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
            <div className={cl('wrap-pagination')}>
                <div className={cl('page-info')}>
                    Hiển thị {currentPage * PageSize - PageSize + 1}
                    -
                    {currentPage * PageSize < users.length ?
                        currentPage * PageSize
                        : users.length}/{users.length} tài khoản
                </div>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={users.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
                <div className={cl('page-info')}>
                    {PageSize} tài khoản/trang
                </div>
            </div>
        </div>
    );
}



export default UserManager;

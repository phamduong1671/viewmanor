import classNames from 'classnames/bind';
import { updatePassword } from 'firebase/auth';
import { doc, runTransaction } from 'firebase/firestore';
import { useState } from 'react';

import { auth, db } from '../../firebase';
import style from './ChangePassword.module.scss'

function ChangePassword({ user }) {
    const cl = classNames.bind(style)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [warn, setWarn] = useState([])

    const handleInput = (e) => {
        switch (e.target.id) {
            case 'password':
                setPassword(e.target.value)
                break;
            case 'newPassword':
                setNewPassword(e.target.value)
                break;
            case 'newPassword2':
                setNewPassword2(e.target.value)
                break;
            default:
                break;
        }
    }

    const handleChangePassword = async () => {
        if (
            (password === user.password) &&
            (newPassword !== '') &&
            (newPassword !== password) &&
            (newPassword2 === newPassword)
        ) {
            setWarn([])
            try {
                await runTransaction(db, async (transaction) => {
                    const sfDoc = await transaction.get(doc(db, "users", user.id));
                    if (!sfDoc.exists()) {
                        // eslint-disable-next-line
                        throw "Document does not exist!";
                    }
                    transaction.update(doc(db, "users", user.id), { ...user, password: newPassword });
                });
                updatePassword(auth.currentUser, newPassword).then(() => {
                    console.log('auth: changed');
                })
                alert('Đã đổi mật khẩu')
            } catch (e) {
                console.log("Transaction failed: ", e);
            }
        }
        else {
            let array = []
            if (password === '')
                array.push('password')
            else {
                if (password !== user.password)
                    array.push('wrong password')
                if (newPassword === '')
                    array.push('newPassword')
                else {
                    if ((newPassword === password) || (newPassword.length < 6))
                        array.push('same password')
                    if (newPassword2 !== newPassword)
                        array.push('newPassword2')
                }
            }
            setWarn(array)
        }
    }

    return (
        <div className={cl('wrap-content')}>
            <div className={cl('header-content')}>Đổi mật khẩu</div>
            <div className={cl('content')}>
                <label className={cl('d-label')}>Mật khẩu hiện tại</label>
                <input
                    id="password"
                    type='password'
                    className={cl('value-item')}
                    onChange={(e) => handleInput(e)}
                    placeholder='Nhập mật hiện tại'
                />
                {warn.filter(i => i === 'password').length !== 0
                    && <div className={cl('d-warning')}>Hãy nhập mật khẩu hiện tại</div>}
                {warn.filter(i => i === 'wrong password').length !== 0
                    && <div className={cl('d-warning')}>Sai mật khẩu</div>}

                <label className={cl('d-label')}>Mật khẩu mới</label>
                <input
                    id="newPassword"
                    type='password'
                    className={cl('value-item')}
                    onChange={(e) => handleInput(e)}
                    placeholder='Nhập mật mới'
                />
                {warn.filter(i => i === 'newPassword').length !== 0
                    && <div className={cl('d-warning')}>Hãy nhập mật khẩu mới</div>}
                {warn.filter(i => i === 'same password').length !== 0
                    && <div className={cl('d-warning')}>Mật khẩu mới phải khác mật khẩu hiện tại và dài hơn 6 ký tự</div>}

                <label className={cl('d-label')}>Xác nhận mật khẩu mới</label>
                <input
                    id="newPassword2"
                    type='password'
                    className={cl('value-item')}
                    onChange={(e) => handleInput(e)}
                    placeholder='Nhập lại mật khẩu mới'
                />
                {warn.filter(i => i === 'newPassword2').length !== 0
                    && <div className={cl('d-warning')}>Mật khẩu không khớp</div>}

                <button
                    className={cl('btn-change')}
                    onClick={handleChangePassword}
                >
                    Đổi
                </button>
            </div>
        </div>
    );
}

export default ChangePassword;
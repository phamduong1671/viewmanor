import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

import signInStyle from '../signIn/SignIn.module.scss'
import style from './SignUp.module.scss'
import { auth, db } from "../../firebase";

function SignUp() {
    const navigate = useNavigate()
    const cl = classNames.bind(signInStyle)
    const cx = classNames.bind(style)
    const [data, setData] = useState({})

    const goSignInPage = () => {
        navigate('/sign-in')
    }

    const handleInput = (e) => {
        const id = e.target.id
        const value = e.target.value

        setData({ ...data, [id]: value })
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const res = await createUserWithEmailAndPassword(auth, data.email, data.password)

            await setDoc(doc(db, "users", res.user.uid), {
                ...data,
                status: 'Bình thường',
                role: 'Người dùng'
            });
        }
        catch (err) {
            console.log(err)
        }
    }

    const handlePassword2 = ()=>{
        
    }

    return (
        <div className={cx('page')}>
            <div className={cl('container')}>
                <div className={cl('title')}>Đăng ký tài khoản</div>
                <div className={cl('account')}>
                    <div className={cl('label')}>Họ tên</div>
                    <input
                        id='name'
                        className={cl('input-signIn')}
                        placeholder='Nhập họ tên'
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Email</div>
                    <input
                        id='email'
                        className={cl('input-signIn')}
                        placeholder='Nhập email'
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Số điện thoại</div>
                    <input
                        id='phone'
                        className={cl('input-signIn')}
                        placeholder='Nhập số điện thoại'
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Mật khẩu</div>
                    <input
                        id='password'
                        type='password'
                        className={cl('input-signIn')}
                        placeholder='Nhập mật khẩu'
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Nhập lại mật khẩu</div>
                    <input
                        id='password2'
                        type='password'
                        className={cl('input-signIn')}
                        placeholder='Nhập lại mật khẩu'
                        onChange={(e) => handlePassword2(e)}
                    />
                </div>
                <button
                    className={cl('btn-signIn')}
                    onClick={handleSignUp}
                >
                    Đăng ký
                </button>
                <div className={cl('no-account')}>
                    Đã có tài khoản?
                    <div
                        className={cl('link')}
                        onClick={goSignInPage}
                    >
                        Đăng nhập tại đây
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
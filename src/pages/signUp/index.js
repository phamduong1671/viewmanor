import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import signInStyle from '../signIn/SignIn.module.scss'
import style from './SignUp.module.scss'
import { auth, db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

function SignUp() {
    const navigate = useNavigate()
    const cl = classNames.bind(signInStyle)
    const cx = classNames.bind(style)
    const [data, setData] = useState({})
    const [password2, setPassword2] = useState('')
    const [compare, setCompare] = useState(true)
    const [warn, setWarn] = useState([])
    const { dispatch } = useContext(AuthContext)

    const handleInput = (e) => {
        const id = e.target.id
        const value = e.target.value

        setData({ ...data, [id]: value })
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        if (data.name && data.email && data.phone && data.password && data.password.length >= 6) {
            setWarn([])
            if (password2 === data.password) {
                try {
                    const res = await createUserWithEmailAndPassword(auth, data.email, data.password)

                    await setDoc(doc(db, "users", res.user.uid), {
                        ...data,
                        status: 'Bình thường',
                        role: 'Người dùng',
                        avatar: '',
                        facebook: '',
                        zalo: '',
                        other: '',
                        address: ''
                    });

                    // Đăng nhập luôn khi đăng ký thành công
                    signInWithEmailAndPassword(auth, data.email, data.password)
                        .then((userCredential) => {
                            const user = userCredential.user;
                            dispatch({ type: "LOGIN", payload: user })
                            navigate('/')
                        })
                        .catch(console.log('error'));
                }
                catch (err) {
                    err.toString() === 'FirebaseError: Firebase: Error (auth/email-already-in-use).' &&
                        alert('email đã tồn tại. Hãy đăng nhập hoặc sử dụng email khác');
                }
                setCompare(true)
            } else setCompare(false)
        } else {                            // Bắt lỗi input
            const array = []
            if (!data.name)
                array.push('name')
            if (!data.email)
                array.push('email')
            if (!data.phone)
                array.push('phone')
            if (!data.password)
                array.push('password')
            else if (data.password.length < 6)
                array.push('short password')
            setWarn(array)
        }
    }

    const handlePassword2 = (e) => {
        setPassword2(e.target.value)
    }

    return (
        <div className={cx('page')}>
            <div className={cl('container')}>
                <div
                    className={cl('btn-close')}
                    onClick={() => navigate('/')}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={cl('title')}>Đăng ký tài khoản</div>
                <div className={cl('account')}>
                    <div className={cl('label')}>Họ tên</div>
                    <input
                        id='name'
                        className={cl('input-signIn')}
                        placeholder='Nhập họ tên'
                        onChange={(e) => handleInput(e)}
                    />
                    {warn.filter(i => i === 'name').length !== 0
                        && <div className={cx('d-warning')}>Vui lòng nhập nhập Họ tên</div>}
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Email</div>
                    <input
                        id='email'
                        type='email'
                        className={cl('input-signIn')}
                        placeholder='Nhập email'
                        onChange={(e) => handleInput(e)}
                    />
                    {warn.filter(i => i === 'email').length !== 0
                        && <div className={cx('d-warning')}>Vui lòng nhập nhập Email</div>}
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Số điện thoại</div>
                    <input
                        id='phone'
                        className={cl('input-signIn')}
                        placeholder='Nhập số điện thoại'
                        onChange={(e) => handleInput(e)}
                    />
                    {warn.filter(i => i === 'phone').length !== 0
                        && <div className={cx('d-warning')}>Vui lòng nhập nhập Số điện thoại</div>}
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
                    {warn.filter(i => i === 'password').length !== 0 ?
                        <div className={cx('d-warning')}>Vui lòng nhập nhập Mật khẩu</div>
                        : warn.filter(i => i === 'short password').length !== 0 &&
                        <div className={cx('d-warning')}>Mật khẩu phải dài hơn 6 ký tự</div>
                    }
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
                    {!compare && <div className={cx('d-warning')}>Mật khẩu không khớp</div>}
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
                        onClick={() => navigate('/sign-in')}
                    >
                        Đăng nhập tại đây
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
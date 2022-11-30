import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

import style from './SignIn.module.scss'
import { AuthContext } from "../../context/AuthContext";

function SignIn() {
    const navigate = useNavigate()
    const cl = classNames.bind(style)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const goSignUpPage = () => {
        navigate('/sign-up')
    }
    const goForgotPasswordPage = () => {
        navigate('/forgot-password')
    }

    const {dispatch} = useContext(AuthContext)

    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({type:"LOGIN", payload:user})
                navigate('/')
            })
            .catch((error) => {
                setError(true)
            });
    }

    return (
        <div className={cl('page')}>
            <div className={cl('container')}>
                <div className={cl('title')}>Đăng nhập</div>
                <div className={cl('account')}>
                    <div className={cl('label')}>Tài khoản</div>
                    <input
                        className={cl('input-signIn')}
                        placeholder='Nhập email hoặc tên đăng nhập'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Mật khẩu</div>
                    <input
                        type='password'
                        className={cl('input-signIn')}
                        placeholder='Nhập mật khẩu'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a className={cl('link')} onClick={goForgotPasswordPage}>Quên mật khẩu?</a>
                </div>

                <button className={cl('btn-signIn')} onClick={handleSignIn} >Đăng nhập</button>
                {error && <div style={{color:'red'}}>Sai email hoặc mật khẩu!</div>}

                <div className={cl('no-account')}>
                    Chưa có tài khoản?
                    <a className={cl('link')} onClick={goSignUpPage}>Đăng ký ngay</a>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
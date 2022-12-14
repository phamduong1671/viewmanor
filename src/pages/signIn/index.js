import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { auth } from "../../firebase";
import style from './SignIn.module.scss'
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";

function SignIn() {
    const navigate = useNavigate()
    const cl = classNames.bind(style)
    const { currentPost } = useContext(PostContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const { dispatch } = useContext(AuthContext)

    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({ type: "LOGIN", payload: user })
                if (currentPost === null)
                    navigate('/')
                else navigate('/info-item')
            })
            .catch((error) => {
                setError(true)
            });
    }

    return (
        <div className={cl('page')}>
            <div className={cl('container')}>
                <div
                    className={cl('btn-close')}
                    onClick={() => navigate('/')}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={cl('title')}>Đăng nhập</div>
                <div className={cl('account')}>
                    <div className={cl('label')}>Email</div>
                    <input
                        type='email'
                        className={cl('input-signIn')}
                        placeholder='Nhập email'
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
                    <div className={cl('link')} onClick={() => navigate('/forgot-password')}>Quên mật khẩu?</div>
                </div>

                <button className={cl('btn-signIn')} onClick={handleSignIn} >Đăng nhập</button>
                {error && <div style={{ color: 'red' }}>Sai email hoặc mật khẩu!</div>}

                <div className={cl('no-account')}>
                    Chưa có tài khoản?
                    <div className={cl('link')} onClick={() => navigate('/sign-up')}>Đăng ký ngay</div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
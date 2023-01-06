import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router";

import { auth } from "../../firebase";
import signInStyle from '../signIn/SignIn.module.scss'

function ForgotPassword() {
    const cl = classNames.bind(signInStyle)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')

    const handleGetPassword = () => {
        sendPasswordResetEmail(auth, email, {url: 'http://localhost:3000/sign-in'})
            .then(() => {
                alert('Đã gửi mail đặt lại mật khẩu. Vui lòng kiểm tra email của bạn')
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className={cl('page')}>
            <div className={cl('container')}>
                <div
                    className={cl('btn-close')}
                    onClick={() => navigate('/sign-in')}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </div>
                <div className={cl('title')}>Lấy lại mật khẩu</div>
                <div className={cl('account')}>
                    <div className={cl('label')}>Email</div>
                    <input
                        className={cl('input-signIn')}
                        placeholder='Nhập email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button
                    className={cl('btn-signIn')}
                    onClick={handleGetPassword}
                >
                    Lấy lại mật khẩu
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
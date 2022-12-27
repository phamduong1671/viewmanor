import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useNavigate } from "react-router";

import signInStyle from '../signIn/SignIn.module.scss'

function ForgotPassword() {
    const cl = classNames.bind(signInStyle)
    const navigate = useNavigate()

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
                    <input className={cl('input-signIn')} placeholder='Nhập email' />
                </div>
                <button className={cl('btn-signIn')}>Lấy lại mật khẩu</button>
            </div>
        </div>
    );
}

export default ForgotPassword;
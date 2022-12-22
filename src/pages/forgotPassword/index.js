import classNames from "classnames/bind";

import signInStyle from '../signIn/SignIn.module.scss'
import style from './ForgotPassword.module.scss'

function ForgotPassword() {
    const cl = classNames.bind(signInStyle)
    const cx = classNames.bind(style)

    return (
        <div className={cl('page')}>
            <div className={cl('container')}>
                <div className={cl('title')}>Đổi mật khẩu</div>
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
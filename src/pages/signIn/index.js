import classNames from "classnames/bind";
import { useNavigate } from "react-router";

import style from './SignIn.module.scss'

function SignIn() {
    const navigate = useNavigate()
    const cl = classNames.bind(style)

    const goSignUpPage = () => {
        navigate('/sign-up')
    }
    const goForgotPasswordPage = () =>{
        navigate('/forgot-password')
    }

    return (
        <div className={cl('page')}>
            <div className={cl('container')}>
                <div className={cl('title')}>ViewManor</div>
                <div className={cl('account')}>
                    <div className={cl('label')}>Tài khoản</div>
                    <input className={cl('input-signIn')} placeholder='Nhập email hoặc tên đăng nhập' />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Mật khẩu</div>
                    <input type='password' className={cl('input-signIn')} placeholder='Nhập mật khẩu' />
                    <a className={cl('link')} onClick={goForgotPasswordPage}>Quên mật khẩu?</a>
                </div>
                <button className={cl('btn-signIn')}>Đăng nhập</button>
                <div className={cl('no-account')}>
                    Chưa có tài khoản?
                    <a className={cl('link')} onClick={goSignUpPage}>Đăng ký ngay</a>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
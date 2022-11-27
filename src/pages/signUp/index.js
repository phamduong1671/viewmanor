import classNames from "classnames/bind";
import { useNavigate } from "react-router";

import signInStyle from '../signIn/SignIn.module.scss'
import style from './SignUp.module.scss'

function SignUp() {
    const navigate = useNavigate()
    const cl = classNames.bind(signInStyle)
    const cx = classNames.bind(style)

    const goSignInPage = () => {
        navigate('/sign-in')
    }

    return (
        <div className={cx('page')}>
            <div className={cl('container')}>
                <div className={cl('title')}>Đăng ký tài khoản</div>
                <div className={cl('account')}>
                    <div className={cl('label')}>Họ tên</div>
                    <input className={cl('input-signIn')} placeholder='Nhập họ tên' />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Email</div>
                    <input className={cl('input-signIn')} placeholder='Nhập email' />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Số điện thoại</div>
                    <input className={cl('input-signIn')} placeholder='Nhập số điện thoại' />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Tên đăng nhập</div>
                    <input className={cl('input-signIn')} placeholder='Nhập tên đăng nhập' />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Mật khẩu</div>
                    <input type='password' className={cl('input-signIn')} placeholder='Nhập mật khẩu' />
                </div>
                <div className={cl('password')}>
                    <div className={cl('label')}>Nhập lại mật khẩu</div>
                    <input type='password' className={cl('input-signIn')} placeholder='Nhập lại mật khẩu' />
                </div>
                <button className={cl('btn-signIn')}>Đăng ký</button>
                <div className={cl('no-account')}>
                    Đã có tài khoản?
                    <a className={cl('link')} onClick={goSignInPage}>Đăng nhập tại đây</a>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
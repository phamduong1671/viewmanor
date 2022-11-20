import { Link, useNavigate } from "react-router-dom";
import style from './Header.module.scss';
import classNames from 'classnames/bind'

function Header() {

    const cl = classNames.bind(style)

    const navigate = useNavigate()
    const goHomePage = () => {
        navigate('/')
    };

    return (
        <div className={cl('header')}>
            <div className={cl('header-left')} onClick={goHomePage}></div>
            <div className={cl('header-right')}>
                <Link className={cl('btn-search', 'btn-header')} to='/search'>Tìm kiếm</Link>
                <Link className={cl('btn-home', 'btn-header')} to='/'>Trang chủ</Link>
                <Link className={cl('btn-post', 'btn-header')} to='/post'>Đăng tin</Link>
                <div className={cl('btn-user')}>
                    <Link className={cl('btn-signIn', 'btn-header')} to='/sign-in'>Đăng nhập</Link>
                    <Link className={cl('btn-signUp', 'btn-header')} to='/sign-up'>Đăng ký</Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
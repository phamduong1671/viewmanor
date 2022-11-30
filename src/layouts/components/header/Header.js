import { Link, useNavigate } from "react-router-dom";
import classNames from 'classnames/bind';
import Tippy from "@tippyjs/react/headless";

import style from './Header.module.scss';
import BtnUser from "../../../components/btnUser/BtnUser";
import { Fragment, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

function Header() {

    const cl = classNames.bind(style)

    const { currentUser } = useContext(AuthContext)

    const isSignIn = () => {
        return currentUser ? true : false;
    };

    const navigate = useNavigate()
    const goHomePage = () => {
        navigate('/')
    };

    const { dispatch } = useContext(AuthContext)
    const handleSignOut = () => {
        dispatch({ type: "LOGOUT", payload: null })
        navigate('/')
    }

    return (
        <div className={cl('header')}>
            <div className={cl('header-left')} onClick={goHomePage}></div>
            <div className={cl('header-right')}>
                <Link className={cl('btn-search', 'btn-header')} to='/search'>Tìm kiếm</Link>
                <Link className={cl('btn-home', 'btn-header')} to='/'>Trang chủ</Link>
                <Link className={cl('btn-post', 'btn-header')} to='/post'>Đăng tin</Link>
                <Tippy
                    interactive
                    render={attrs => (
                        <div className={cl('user-features')} tabIndex="0" {...attrs}>
                            <Link className={cl('item-feature')} to='/user-post'>Tin đã đăng</Link>
                            <Link className={cl('item-feature')} to='/user-info'>Thông tin tài khoản</Link>
                            <div className={cl('item-feature')} onClick={handleSignOut}>Đăng xuất</div>
                        </div>
                    )}
                >
                    <div className={cl('btn-user')}>
                        {currentUser ? <BtnUser /> : null}
                    </div>
                </Tippy>
                {currentUser === null ?
                    <Fragment>
                        <Link className={cl('btn-signIn')} to='/sign-in'>Đăng nhập</Link>
                        <Link className={cl('btn-signUp', 'btn-header')} to='/sign-up'>Đăng ký</Link>
                    </Fragment>
                    : null}
            </div>
        </div>
    );
}

export default Header;
import { Link, useNavigate } from "react-router-dom";
import classNames from 'classnames/bind';
import Tippy from "@tippyjs/react/headless";

import style from './Header.module.scss';
import BtnUser from "../../../components/btnUser/BtnUser";
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { PostContext } from "../../../context/PostContext";
import logo from '../../../assets/logo.png'
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

function Header() {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext)
    const { postDispatch } = useContext(PostContext)
    const { dispatch } = useContext(AuthContext)
    const [user, setUser] = useState({})

    useEffect(() => {
        if (currentUser !== null) {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid),
                (doc) => {
                    setUser({ id: doc.id, ...doc.data() })
                }, (error) => {
                    console.log(error);
                }
            );
            return () => {
                unsub();
            }
        }
    }, [currentUser])

    const goHomePage = () => {
        navigate('/')
    };

    const goPostPage = () => {
        if (user.status === 'Bị khóa') {
            alert('Tài khoản của bạn đã bị khóa, bạn không thể đăng tin mới. Hãy liên hệ quản trị viên để biết thêm chi tiết.')
        } else {
            postDispatch({ type: 'SHOW', payload: null })
            navigate('/post')
        }
    };

    const handleSignOut = () => {
        dispatch({ type: "LOGOUT", payload: null })
        navigate('/')
    }

    return (
        <div className={cl('header')}>
            <div className={cl('header-left')} onClick={goHomePage}>
                <img
                    className={cl('logo')}
                    src={logo}
                    alt='logo'
                />
            </div>
            <div className={cl('header-right')}>
                <Link className={cl('btn-search', 'btn-header')} to='/search'>Tìm kiếm</Link>
                <Link className={cl('btn-home', 'btn-header')} to='/'>Trang chủ</Link>
                <div className={cl('btn-post', 'btn-header')} onClick={goPostPage}>Đăng tin</div>
                <Tippy
                    interactive
                    render={attrs => (
                        <div className={cl('user-features')} tabIndex="0" {...attrs}>
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
        </div >
    );
}

export default Header;
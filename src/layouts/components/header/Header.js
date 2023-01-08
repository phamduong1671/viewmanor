import { Link, useNavigate } from "react-router-dom";
import classNames from 'classnames/bind';
import { doc, onSnapshot } from "firebase/firestore";
import { Fragment, useContext, useEffect, useState } from "react";
import Tippy from "@tippyjs/react/headless";

import style from './Header.module.scss';
import BtnUser from "../../../components/btnUser/BtnUser";
import { AuthContext } from "../../../context/AuthContext";
import { PostContext } from "../../../context/PostContext";
import logo from '../../../assets/logo.png'
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
        postDispatch({ type: 'SHOW', payload: null })
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

    const goSignInPage = () => {
        postDispatch({ type: 'SHOW', payload: null })
        navigate('/sign-in')
    }

    const goSignUpPage = () => {
        postDispatch({ type: 'SHOW', payload: null })
        navigate('/sign-up')
    }

    const handleSignOut = () => {
        postDispatch({ type: 'SHOW', payload: null })
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
                <Link
                    className={cl('btn-search', 'btn-header')}
                    to='/search'
                >
                    Tìm kiếm
                </Link>
                <div
                    className={cl('btn-home', 'btn-header')}
                    onClick={goHomePage}
                >
                    Trang chủ
                </div>
                <div
                    className={cl('btn-post', 'btn-header')}
                    onClick={goPostPage}
                >
                    Đăng tin
                </div>
                <Tippy
                    interactive
                    render={attrs => (
                        <div className={cl('user-features')} tabIndex="0" {...attrs}>
                            <Link
                                className={cl('item-feature')}
                                to='/user-info'
                            >
                                Thông tin tài khoản
                            </Link>
                            <div
                                className={cl('item-feature')}
                                onClick={handleSignOut}
                            >
                                Đăng xuất
                            </div>
                        </div>
                    )}
                >
                    <div className={cl('btn-user')}>
                        {currentUser ? <BtnUser /> : null}
                    </div>
                </Tippy>
                {currentUser === null ?
                    <Fragment>
                        <div
                            className={cl('btn-signIn')}
                            onClick={goSignInPage}
                        >
                            Đăng nhập
                        </div>
                        <div
                            className={cl('btn-signUp', 'btn-header')}
                            onClick={goSignUpPage}
                        >
                            Đăng ký
                        </div>
                    </Fragment>
                    : null}
            </div>
        </div >
    );
}

export default Header;
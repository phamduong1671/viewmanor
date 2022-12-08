import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import classNames from "classnames/bind";

import icon from '../../assets/image/default-avatar.jpg'
import style from './UserInformation.module.scss'
import Information from "../../components/contentUserInfo/Information";
import EditInfo from "../../components/contentUserInfo/EditInfo";
import PostsPublished from "../../components/contentUserInfo/PostsPublished";
import UserManager from "../../components/contentUserInfo/UserManager";
import { AuthContext } from '../../context/AuthContext'
import { db } from '../../firebase'
import { collection, getDocs } from "firebase/firestore";

function UserInformation() {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const [feature, setFeature] = useState('1')
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState({})

    // Lấy thông tin người dùng đang hoạt động
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {
                    if (doc.id === currentUser.uid) {
                        setUser({ id: doc.id, ...doc.data() })
                    }
                });
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, [currentUser])

    const handleFeature = (id) => {
        setFeature(id)
    }

    const changePassword = () => {
        navigate('/forgot-password')
    }

    return (
        <div className={cl('wrap-content')}>
            <div className={cl('wrap-sidebar')}>
                <div className={cl('sidebar')}>
                    <div className={cl('user')}>
                        {user.avatar === '' ?
                            <img
                                className={cl('avatar')}
                                src={icon}
                                alt='avatar'
                            />
                            : <img
                                className={cl('avatar')}
                                src={user.avatar}
                                alt='avatar'
                            />
                        }
                        <div className={cl('name')}>{user.name}</div>
                    </div>
                    <div className={cl('feature')}>
                        <div
                            id='1'
                            className={cl('item-feature')}
                            onClick={(e) => handleFeature(e.target.id)}
                        >
                            Thông tin cá nhân
                        </div>
                        <div
                            id='2'
                            className={cl('item-feature')}
                            onClick={(e) => handleFeature(e.target.id)}
                        >
                            Tin đã đăng
                        </div>
                        <div
                            id='3'
                            className={cl('item-feature')}
                            onClick={(e) => handleFeature(e.target.id)}
                        >
                            Chỉnh sửa thông tin cá nhân
                        </div>
                        <div
                            className={cl('item-feature')}
                            onClick={changePassword}
                        >
                            Đổi mật khẩu
                        </div>
                        {user.role === 'Quản trị viên' ? (
                            <Fragment>
                                <div
                                    id='4'
                                    className={cl('item-feature')}
                                    onClick={(e) => handleFeature(e.target.id)}
                                >
                                    Quản lý tin đăng
                                </div>
                                <div
                                    id='5'
                                    className={cl('item-feature')}
                                    onClick={(e) => handleFeature(e.target.id)}
                                >
                                    Quản lý tài khoản người dùng
                                </div>
                            </Fragment>
                        ) : null}
                    </div>
                </div>
            </div>
            {feature === '1' && <Information />}
            {feature === '2' && <PostsPublished id={user.userId} />}
            {feature === '3' && <EditInfo />}
            {feature === '4' && <PostsPublished />}
            {feature === '5' && <UserManager id={user.userId} />}
        </div >
    );
}

export default UserInformation;
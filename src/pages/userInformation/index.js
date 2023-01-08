import { Fragment, useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import { doc, onSnapshot } from "firebase/firestore";

import style from './UserInformation.module.scss'
import Information from "../../components/contentUserInfo/Information";
import EditInfo from "../../components/contentUserInfo/EditInfo";
import PostsPublished from "../../components/contentUserInfo/PostsPublished";
import UserManager from "../../components/contentUserInfo/UserManager";
import ReportManager from "../../components/contentUserInfo/ReportManager";
import { AuthContext } from '../../context/AuthContext'
import { db } from '../../firebase'
import defaultAvatar from '../../assets/image/default-avatar.jpg';
import ChangePassword from "../../components/contentUserInfo/ChangePassword";

function UserInformation() {
    const cl = classNames.bind(style)
    const [feature, setFeature] = useState('1')
    const { currentUser } = useContext(AuthContext)
    const [user, setUser] = useState({})

    // Lấy thông tin người dùng đang hoạt động
    useEffect(() => {
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
    }, [currentUser])
    
    const handleFeature = (id) => {
        setFeature(id)
    }

    return (
        <div className={cl('wrap-content')}>
            <div className={cl('wrap-sidebar')}>
                <div className={cl('sidebar')}>
                    <div className={cl('user')}>
                        <img
                            className={cl('avatar')}
                            src={user.avatar || defaultAvatar}
                            alt='avatar'
                        />
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
                            id='4'
                            className={cl('item-feature')}
                            onClick={(e) => handleFeature(e.target.id)}
                        >
                            Đổi mật khẩu
                        </div>
                        {user.role === 'Quản trị viên' ? (
                            <Fragment>
                                <div
                                    id='5'
                                    className={cl('item-feature')}
                                    onClick={(e) => handleFeature(e.target.id)}
                                >
                                    Quản lý tin đăng
                                </div>
                                <div
                                    id='6'
                                    className={cl('item-feature')}
                                    onClick={(e) => handleFeature(e.target.id)}
                                >
                                    Quản lý tài khoản người dùng
                                </div>
                                <div
                                    id='7'
                                    className={cl('item-feature')}
                                    onClick={(e) => handleFeature(e.target.id)}
                                >
                                    Danh sách báo cáo
                                </div>
                            </Fragment>
                        ) : null}
                    </div>
                </div>
            </div>
            {feature === '1' && <Information user={user} />}
            {feature === '2' && <PostsPublished id={user.id} />}
            {feature === '3' && <EditInfo />}
            {feature === '4' && <ChangePassword user={user} />}
            {feature === '5' && <PostsPublished />}
            {feature === '6' && <UserManager id={user.id} />}
            {feature === '7' && <ReportManager />}
        </div >
    );
}

export default UserInformation;
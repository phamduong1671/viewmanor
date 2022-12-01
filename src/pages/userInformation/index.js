import { useState } from "react";
import { useNavigate } from "react-router";
import classNames from "classnames/bind";

import icon from '../../assets/image/default-avatar.jpg'
import style from './UserInformation.module.scss'
import Information from "../../components/contentUserInfo/Information";
import EditInfo from "../../components/contentUserInfo/EditInfo";
import PostsPublished from "../../components/contentUserInfo/PostsPublished";

function UserInformation() {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const [feature, setFeature] = useState('1')

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
                        <img className={cl('avatar')} src={icon} alt='avatar' />
                        <div className={cl('name')}>Phạm Ánh Dương</div>
                    </div>
                    <div className={cl('feature')}>
                        <div id='1' className={cl('item-feature')} onClick={(e) => handleFeature(e.target.id)} >Thông tin cá nhân</div>
                        <div id='2' className={cl('item-feature')} onClick={(e) => handleFeature(e.target.id)} >Tin đã đăng</div>
                        <div id='3' className={cl('item-feature')} onClick={(e) => handleFeature(e.target.id)} >Chỉnh sửa thông tin cá nhân</div>
                        <div className={cl('item-feature')} onClick={changePassword} >Đổi mật khẩu</div>
                    </div>
                </div>
            </div>
            {feature === '1' && <Information />}
            {feature === '2' && <EditInfo />}
            {feature === '3' && <PostsPublished />}
        </div >
    );
}

export default UserInformation;
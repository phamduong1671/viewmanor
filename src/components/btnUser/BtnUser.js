import classNames from 'classnames/bind';

import style from './BtnUser.module.scss'
import icon from '../../assets/image/default-avatar.jpg'

function BtnUser() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('btn-user')}>
            <div className={cl('icon-avatar')}><img className={cl('avatar')} src={icon} alt='avatar' /></div>
            <div className={cl('username')}>
                Phạm Ánh Dương
            </div>
        </div>
    );
}

export default BtnUser;
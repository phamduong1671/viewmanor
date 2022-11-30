import classNames from 'classnames/bind';

import style from './BtnUser.module.scss'

function BtnUser() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('btn-user')}>
            <div className={cl('icon-avatar')}></div>
            <div className={cl('username')}>
                Phạm Ánh Dương
            </div>
        </div>
    );
}

export default BtnUser;
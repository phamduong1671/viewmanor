import classNames from 'classnames/bind';
// import { auth } from '../../firebase';

import style from './ChangePassword.module.scss'

function ChangePassword() {
    const cl = classNames.bind(style)

    const handleInput = (e) => {

    }

    const handleChangePassword = () => {
        
    }

    return (
        <div className={cl('wrap-content')}>
            <div className={cl('header-content')}>Đổi mật khẩu</div>
            <div className={cl('content')}>
                    <label className={cl('d-label')}>Mật khẩu hiện tại</label>
                    <input
                        id="name"
                        className={cl('value-item')}
                        onChange={(e) => handleInput(e)}
                        placeholder='Nhập mật hiện tại'
                    />
                    <label className={cl('d-label')}>Mật khẩu mới</label>
                    <input
                        id="email"
                        className={cl('value-item')}
                        onChange={(e) => handleInput(e)}
                        placeholder='Nhập mật mới'
                    />
                    <label className={cl('d-label')}>Xác nhận mật khẩu mới</label>
                    <input
                        id="phone"
                        className={cl('value-item')}
                        onChange={(e) => handleInput(e)}
                        placeholder='Nhập lại mật khẩu mới'
                    />
                <button
                    className={cl('btn-change')}
                    onClick={handleChangePassword}
                >
                    Đổi
                </button>
            </div>
        </div>
    );
}

export default ChangePassword;
import { Link } from "react-router-dom";
import classNames from 'classnames/bind';
import { faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from './Footer.module.scss';
import logo from '../../../assets/logo.png'

function Header() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('footer')}>
            <img
                className={cl('logo')}
                src={logo}
                alt='logo'
            />
            <div className={cl('wrap-info')}>
                <div style={{ 'display': 'flex' }}>
                    <div className={cl('info-label')}>Theo dõi chúng tôi:</div>
                    <div
                        className={cl('wrap-icon')}
                    >
                        <FontAwesomeIcon
                            icon={faFacebookF}
                            className={cl('icon')}
                            onClick={() => window.location = 'https://www.facebook.com/pham.duong.142892/'}
                        />
                        <FontAwesomeIcon
                            icon={faTwitter}
                            className={cl('icon')}
                        />
                    </div>
                </div>
                <div className={cl('info-label')}>Liên hệ chúng tôi: phamduongmd2k@gmail.com</div>
                <div className={cl('info-label')}>Địa chỉ: Số 12, Ngách 29/70 Khương Hạ, Phường Khương Đình, Thanh Xuân, TP. Hà Nội</div>
                <div className={cl('line-footer')}></div>
                <div className={cl('copyright')}>
                    <div className={cl('info-label')}>Copyright © 2022</div>
                    <div>
                        <Link className={cl('info-label', 'link-footer')} to='/'>Trang chủ</Link>
                        <Link className={cl('info-label', 'link-footer')} to='/privacy-policy'>Chính sách bảo mật</Link>
                        <Link className={cl('info-label', 'link-footer')} to='/covenant-terms'>Điều khoản dịch vụ</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
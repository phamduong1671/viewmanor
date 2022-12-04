import classNames from "classnames/bind";

import icon from '../../assets/image/default-avatar.jpg'
import style from './InfoItem.module.scss'

function InfoItem() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('item-container')}>
            <div className={cl('title')}>
                Cần bán căn hộ Vinhomes Grand Park - phân khu Rainbow toà S3.05
            </div>
            <div className={cl('wrap-image')}>

            </div>
            <div className={cl('wrap-content')}>
                <div className={cl('information')}>
                    <h1>Chi tiết</h1>
                    <div style={{ display: "flex" }}>
                        <div className={cl('half')}>
                            <div>
                                <label>Loại:</label>
                                <label>Căn hộ</label>
                            </div>
                            <div>
                                <label>Địa chỉ:</label>
                                <label>Tây Sơn, Đống Đa, Hà Nội</label>
                            </div>
                        </div>
                        <div className={cl('half')}>
                            <div>
                                <label>Diện Tích:</label>
                                <label>50 mét vuông</label>
                            </div>
                            <div>
                                <label>Giá:</label>
                                <label>1.900.000.000 VND</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cl('description')}>
                    <h1>Mô tả</h1>
                    <label>
                        {`Mình chủ nhà, cần bán căn hộ tại Đại đô thị Vinhomes Grand Park Quận 9.
                        Vị trí Tòa nhà phân khu The Rainbow.
                        
                        Tòa S3.05 diện tích 49m², 1PN.
                        View sông Tắc, hướng Đông Nam
                        Giá rẻ hơn thị trường, tiện mua ở hoặc đầu tư
                        
                        Khách mua có thể nhận nhà công chứng vào ở ngay.`}
                    </label>
                </div>
                <div className={cl('author')}>
                    <h1>Liên hệ</h1>
                    <div className={cl('btn-user')}>
                        <div className={cl('icon-avatar')}><img className={cl('avatar')} src={icon} alt='avatar' /></div>
                        <div className={cl('username')}>
                            Phạm Ánh Dương
                        </div>
                    </div>
                    <div className={cl('wrap-author')}>
                        <div className={cl('email')}>Email:
                            <div>duong@gmail.com</div>
                        </div>
                        <div className={cl('phone')}>Số điện thoại:
                            <div>0987654321</div>
                        </div>
                    </div>
                    <div className={cl('wrap-btn')}>
                        <div className={cl('btn-zalo')} onClick={() => window.location='https://zalo.me/0869913240'}>
                            <div className={cl('icon-zalo')}></div>
                            <div className={cl('label-zalo')}>
                                Zalo
                            </div>
                        </div>
                        <div className={cl('btn-facebook')} onClick={() => window.location='https://www.facebook.com/pham.duong.142892/'}>
                            <div className={cl('icon-facebook')}></div>
                            <div className={cl('label-facebook')}>
                                Facebook
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoItem;
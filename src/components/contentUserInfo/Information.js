import classNames from "classnames/bind";

import style from './Information.module.scss'

function Information() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('content')}>
            <div className={cl('props')}>
                Thông tin
                <div className={cl('props-item')}>
                    <label>Họ Tên</label>
                    <label className={cl('value-item')}>Phạm Ánh Dương</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Email</label>
                    <label className={cl('value-item')}>duong@gmail.com</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Số điện thoại</label>
                    <label className={cl('value-item')}>0987654321</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Địa chỉ cụ thể</label>
                    <label className={cl('value-item')}>Đội 12, thôn Vạn Phúc</label>
                </div>
            </div>
            <div className={cl('props')}>
                Liên hệ
                <div className={cl('props-item')}>
                    <label>Facebook</label>
                    <label className={cl('value-item')}>fb.com/pham.duong.142892</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Zalo</label>
                    <label className={cl('value-item')}>...</label>
                </div>
                <div className={cl('props-item')}>
                    <label>Khác</label>
                    <label className={cl('value-item')}>...</label>
                </div>
            </div>
        </div>
    );
}



export default Information;

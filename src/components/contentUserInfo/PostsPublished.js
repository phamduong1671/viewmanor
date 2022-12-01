import classNames from "classnames/bind";

import style from './PostsPublished.module.scss'

function PostsPublished() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('content')}>
            <div className={cl('props')}>
                Liên hệ
                <div className={cl('props-item')}>
                    <label>Họ Tên</label>
                    <label className={cl('value-item')}>Phạm Ánh Dương</label>
                </div>
                
            </div>
            <div className={cl('props')}>
                Bài đăng
                <div className={cl('props-item')}>
                    <label>Tỉnh / Thành phố</label>
                    <label className={cl('value-item')}>Hà Nội</label>
                </div>
            </div>
        </div>
    );
}



export default PostsPublished;

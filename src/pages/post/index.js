import classNames from "classnames/bind";

import style from './Post.module.scss'
import InputContainer from "../../components/inputContainer/InputContainer";

function Post() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('content')}>
            <div className={cl('content-child')}>
                <div className={cl('post-props')}>Danh mục
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Loại
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Tỉnh / Thành phố
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Quận / Huyện
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Xã / Phường
                    <InputContainer placeholder='Loại' />
                </div>
            </div>
            <div className={cl('content-child')}>
                <div className={cl('post-props')}>Tiêu đề
                    <textarea className={cl('input-container', 'title')}></textarea>
                </div>
                <div className={cl('post-props')}>Địa chỉ cụ thể
                    <textarea className={cl('input-container', 'address')}></textarea>
                </div>
                <div className={cl('post-props')}>Diện tích (m²)
                    <input type='number' className={cl('input-container')} />
                </div>
                <div className={cl('post-props')}>Giá (VND)
                    <input type='number' className={cl('input-container')} />
                </div>
                <div className={cl('post-props')}>Mô tả chi tiết (nội thất, dịch vụ, ...)
                    <textarea className={cl('input-container', 'description')}></textarea>
                </div>
            </div>
            <div className={cl('content-child')}>
                <div className={cl('post-props')}>Hình ảnh
                    <div className={cl('btn-image')} onClick={() => document.querySelector('.input-field').click()}>
                        Tải ảnh lên
                        <input type='file' className={cl('input-field')} hidden />
                    </div>
                </div>
                <div className={cl('wrap-image')}>

                </div>
                <button className={cl('btn-post')}>Đăng tin</button>
            </div>
        </div>
    );
}

export default Post;
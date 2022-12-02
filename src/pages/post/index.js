import classNames from "classnames/bind";

import style from './Post.module.scss'
import InputContainer from "../../components/inputContainer/InputContainer";

function Post() {
    const cl = classNames.bind(style)

    return (

        <div className={cl('content')}>
            <div className={cl('content-left')}>
                <div className={cl('post-props')}>Danh mục:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Loại:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Tỉnh / Thành phố:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Quận / Huyện:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Xã / Phường:
                    <InputContainer placeholder='Loại' />
                </div>
            </div>
            <div className={cl('content-right')}>
                <div className={cl('post-props')}>Tiêu đề:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Loại:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Loại:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Loại:
                    <InputContainer placeholder='Loại' />
                </div>
                <div className={cl('post-props')}>Loại:
                    <InputContainer placeholder='Loại' />
                </div>
            </div>
            <div className={cl('content-right')}>
                <div className={cl('post-props')}>Hình ảnh:
                    <div className={cl('wrap-image')} onClick={()=>document.querySelector('.input-field').click()}>
                        Tải ảnh lên
                        <input type='file' className={cl('input-field')} hidden/>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Post;
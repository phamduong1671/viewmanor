import classNames from "classnames/bind";

import style from './Post.module.scss'
import InputContainer from "../../layouts/components/inputContainer/InputContainer";

function Post() {
    const cl = classNames.bind(style)

    return (
        <div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
            <div className={cl('post-props')}>Loại:
                <InputContainer placeholder='Loại'/>
            </div>
        </div>
    );
}

export default Post;
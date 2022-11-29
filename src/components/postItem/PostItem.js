import classNames from "classnames/bind";
import { useNavigate } from "react-router";

import style from './PostItem.module.scss'

function PostItem() {
    const cl = classNames.bind(style)
    const navigate = useNavigate()

    const goInfoItemPage = () => {
        navigate('./info-item')
    }

    return (
        <div className={cl('post-item')} onClick={goInfoItemPage} >
            Post Item
        </div>
    );
}

export default PostItem;
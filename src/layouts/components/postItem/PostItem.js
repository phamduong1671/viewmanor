import classNames from "classnames/bind";

import style from './PostItem.module.scss'

function PostItem() {
    const cl = classNames.bind(style)

    return ( 
        <div className={cl('post-item')}>
            Post Item
        </div>
    );
}

export default PostItem;
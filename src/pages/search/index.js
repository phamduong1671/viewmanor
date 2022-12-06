import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import style from './Search.module.scss';
import InputContainer from "../../components/inputContainer/InputContainer";
import PostItem from "../../components/postItem";

function Search() {
    const cl = classNames.bind(style);

    return (
        <div className={cl('wrap-content')}>
            <div className={cl('content-header')}>
                <InputContainer id='loai' value='Loại' />
                <InputContainer id='tinh' value='Tỉnh / Thành Phố' />
                <InputContainer id='huyen' value='Quận / Huyện' />
                <InputContainer id='dientich' value='Diện Tích' />
                <div className={cl('btn-search')}>
                    <FontAwesomeIcon fontSize={'20px'} icon={faMagnifyingGlass} />
                    Tìm
                </div>
            </div>
            <div className={cl('content')}>
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
            </div>
        </div>
    );
}

export default Search;
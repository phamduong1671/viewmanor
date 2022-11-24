import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import style from './Search.module.scss';
import InputContainer from "../../layouts/components/inputContainer/InputContainer";

function Search() {
    const cl = classNames.bind(style);

    return (
        <div>
            <div className={cl('content-header')}>
                <InputContainer placeholder='Loại' />
                <InputContainer placeholder='Tỉnh / Thành Phố' />
                <InputContainer placeholder='Quận / Huyện' />
                <InputContainer placeholder='Diện Tích' />
                <div className={cl('btn-search')}>
                    <FontAwesomeIcon fontSize={'20px'} icon={faMagnifyingGlass} />
                    Tìm
                </div>
            </div>
        </div>
    );
}

export default Search;
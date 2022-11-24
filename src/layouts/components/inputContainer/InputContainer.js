import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import style from './InputContainer.module.scss'

function InputContainer({placeholder}) {
    const cl = classNames.bind(style)

    return (
        <div className={cl('input-container')}>
            <input className={cl('input-combobox')} spellCheck={false} placeholder={placeholder} readOnly />
            <div className={cl('icon-dropdown')}><FontAwesomeIcon icon={faAngleDown} /></div>
        </div>
    );
}

export default InputContainer;
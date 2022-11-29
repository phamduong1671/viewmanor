import classNames from "classnames/bind";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import style from './InputContainer.module.scss'
import ComboboxValue from "../comboboxValue/ComboboxValue";

const tabs = ['']

function InputContainer({ placeholder }) {
    const cl = classNames.bind(style)
    const [show, setShow] = useState(false)
    const [icon, setIcon] = useState(faAngleDown)

    const showValue = () => {
        if (show) {
            setShow(false)
        } else{
            setShow(true)
        }
    }

    const hideValue = () => {
        setIcon(faAngleDown)
        setShow(false)
    }

    console.log(show);

    return (
        <div className={cl('cbb-container')} onClick={showValue} onBlur={hideValue}>
            <div className={cl('input-container')}>
                <input className={cl('input-cbb')} spellCheck={false} placeholder={placeholder} readOnly />
                <div className={cl('icon-dropdown')}><FontAwesomeIcon icon={faAngleDown} /></div>
            </div>
            {show && <ComboboxValue />}
        </div>
    );
}

export default InputContainer;
import classNames from "classnames/bind";
import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import style from './InputContainer.module.scss'
import ComboboxValue from "../comboboxValue/ComboboxValue";

const tabs = ['']

function InputContainer(props) {
    const cl = classNames.bind(style)
    const [show, setShow] = useState(false)
    const [value, setValue] = useState(props.value)

    const showValue = () => {
        setShow(prev => !prev)
    }

    const callbackValue = useCallback((item) => {
        setValue(item);
    },[])

    return (
        <div className={cl('cbb-container')} onClick={() => showValue()} >
            <div className={cl('input-container')}>
                <input className={cl('input-cbb')} spellCheck={false} value={value} readOnly />
                <div className={cl('icon-dropdown')}><FontAwesomeIcon icon={faAngleDown} /></div>
            </div>
            {show && <ComboboxValue id={props.id} value={callbackValue} />}
        </div>
    );
}

export default InputContainer;
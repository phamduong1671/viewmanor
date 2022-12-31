import classNames from 'classnames/bind';
import { memo } from 'react';

import style from './ComboboxValue.module.scss'

// combobox item
const thoiGian = ['Tất cả', 'Tuần này', 'Tháng này']

function ComboboxValue(props) {
    const cl = classNames.bind(style)
    /* eslint-disable no-unused-vars */
    let type = []
    /* eslint-enable no-unused-vars */

    const typeCbb = () => {
        switch (props.id) {
            case 'thoigian':
                return type = thoiGian;
            default:
                return console.log(Error);
        }
    }

    const selectItem = (item) => {
        props.value(item);
    }

    return (
        <div className={cl('cbb-value')}>
            {typeCbb().map((item, index) => (
                <div key={index} className={cl('cbb-item')} onClick={() => selectItem(item)}>{item}</div>
            ))}
        </div>
    );
}

export default memo(ComboboxValue);
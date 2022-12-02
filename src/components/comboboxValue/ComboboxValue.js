import classNames from 'classnames/bind';
import { memo } from 'react';

import style from './ComboboxValue.module.scss'

// combobox item
const loai = ['loai 1', 'loai 2', 'loai 3', 'loai 4', 'loai 5', 'loai 6', 'loai 7', 'loai 8']
const thanhPho = ['Thành Phố 1', 'Thành Phố 2', 'Thành Phố 3', 'Thành Phố 4', 'Thành Phố 5', 'Thành Phố 6', 'Thành Phố 7', 'Thành Phố 8']
const huyen = ['Huyện 1', 'Huyện 2', 'Huyện 3', 'Huyện 4', 'Huyện 5', 'Huyện 6', 'Huyện 7', 'Huyện 8']
const xa = ['Xã 1', 'Xã 2', 'Xã 3', 'Xã 4', 'Xã 5', 'Xã 6', 'Xã 7', 'Xã 8']
const dienTich = ['Diện tích 1', 'Diện tích 2', 'Diện tích 3', 'Diện tích 4', 'Diện tích 5', 'Diện tích 6', 'Diện tích 7', 'Diện tích 8']

function ComboboxValue(props) {
    const cl = classNames.bind(style)
    /* eslint-disable no-unused-vars */
    let type = []
    /* eslint-enable no-unused-vars */

    const typeCbb = () => {
        switch (props.id) {
            case 'loai':
                return type = loai;
            case 'tinh':
                return type = thanhPho;
            case 'huyen':
                return type = huyen;
            case 'xa':
                return type = xa;
            case 'dientich':
                return type = dienTich;
            default:
                return console.log(typeof props.id);
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
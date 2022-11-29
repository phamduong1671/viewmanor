import classNames from 'classnames/bind';
import { memo } from 'react';

import style from './ComboboxValue.module.scss'

// combobox item
const loai = ['loai 1', 'loai 2', 'loai 3', 'loai 4', 'loai 5', 'loai 6', 'loai 7', 'loai 8']
const thanhPho = ['Thành Phố 1', 'Thành Phố 2', 'Thành Phố 3', 'Thành Phố 4', 'Thành Phố 5', 'Thành Phố 6', 'Thành Phố 7', 'Thành Phố 8']
const huyen = ['huyen 1', 'huyen 2', 'huyen 3', 'huyen 4', 'huyen 5', 'huyen 6', 'huyen 7', 'huyen 8']
const dienTich = ['dien tich 1', 'dien tich 2', 'dien tich 3', 'dien tich 4', 'dien tich 5', 'dien tich 6', 'dien tich 7', 'dien tich 8']

function ComboboxValue(props) {
    const cl = classNames.bind(style)
    let type = []

    const typeCbb = () => {
        switch (props.id) {
            case 'loai':
                return type = loai;
            case 'tinh':
                return type = thanhPho;
            case 'huyen':
                return type = huyen;
            case 'dientich':
                return type = dienTich;
            default:
                return console.log(typeof props.id);
        }
    }

    const selectItem = (item) => {
        console.log(typeof item)
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
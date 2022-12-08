import classNames from 'classnames/bind';
import { memo } from 'react';

import style from './ComboboxValue.module.scss'
import { data } from '../../tree'

// combobox item
const loai = ['Tất cả', 'Loại 1', 'Loại 2', 'Loại 3', 'Loại 4', 'Loại 5', 'Loại 6', 'Loại 7', 'Loại 8']
const thanhPho = ['Tất cả Tỉnh / Thành phố', 'Thành Phố 1', 'Thành Phố 2', 'Thành Phố 3', 'Thành Phố 4', 'Thành Phố 5', 'Thành Phố 6', 'Thành Phố 7', 'Thành Phố 8']
const huyen = ['Tất cả Quận / Huyện', 'Huyện 1', 'Huyện 2', 'Huyện 3', 'Huyện 4', 'Huyện 5', 'Huyện 6', 'Huyện 7', 'Huyện 8']
const xa = ['Tất cả Xã / Phường', 'Xã 1', 'Xã 2', 'Xã 3', 'Xã 4', 'Xã 5', 'Xã 6', 'Xã 7', 'Xã 8']
const dienTich = ['Tất cả', 'Diện tích 1', 'Diện tích 2', 'Diện tích 3', 'Diện tích 4', 'Diện tích 5', 'Diện tích 6', 'Diện tích 7', 'Diện tích 8']
const danhMuc = ['Bán', 'Cho thuê']
const thoiGian = ['Tất cả', 'Tuần này', 'Tháng này']

const dvhc = data

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
            case 'danhmuc':
                return type = danhMuc;
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
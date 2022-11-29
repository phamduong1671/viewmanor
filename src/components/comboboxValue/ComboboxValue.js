import classNames from 'classnames/bind';

import style from './ComboboxValue.module.scss'

// combobox item
const loai = ['loai 1', 'loai 2', 'loai 3', 'loai 4']
const thanhPho = ['TP 1', 'TP 2', 'TP 3', 'TP 4']
const huyen = ['huyen 1', 'huyen 2', 'huyen 3', 'huyen 4']
const dienTich = ['dien tich 1', 'dien tich 2', 'dien tich 3', 'dien tich 4']

function ComboboxValue() {
    const cl = classNames.bind(style)
    // const data = [id]
    // const num = parseInt(id.id)
    let type = loai

    // switch (num) {
    //     case 1:
    //         return type = loai;
    //     case 2:
    //         return type = thanhPho;
    //     case 3:
    //         return type = huyen;
    //     case 4:
    //         return type = dienTich;
    //     default:
    //         return console.log(typeof num);
    // }

    return (
        <div className={cl('cbb-value')}>
            {type.map((item,index) => (
                <div key={index} className={cl('cbb-item')}>{item}</div>
            ))}
        </div>
    );
}

export default ComboboxValue;
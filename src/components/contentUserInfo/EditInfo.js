import classNames from "classnames/bind";
import { useState } from "react";

import style from './EditInfo.module.scss'

const user = { name: 'Phạm Ánh Dương', email: 'duong@gmail.com', phone: '0987654321', facebook: 'fb.com/pham.duong.142892', zalo: '', other: '', ward: 'Vạn Kim', address: '' }

function EditInfo() {
    const cl = classNames.bind(style)
    const [data, setData] = useState(user)
    const [edit, setEdit] = useState(data)

    const changeName = (value) =>{
        setEdit({name: value, email: edit.email, phone: edit.phone, facebook: edit.facebook, zalo: edit.zalo, other: edit.other, address: edit.address})
    }
    const changeEmail = (value) =>{
        setEdit({name: edit.name, email: value, phone: edit.phone, facebook: edit.facebook, zalo: edit.zalo, other: edit.other, address: edit.address})
    }
    const changePhone = (value) =>{
        setEdit({name: edit.name, email: edit.email, phone: value, facebook: edit.facebook, zalo: edit.zalo, other: edit.other, address: edit.address})
    }
    const changeFacebook = (value) =>{
        setEdit({name: edit.name, email: edit.email, phone: edit.phone, facebook: value, zalo: edit.zalo, other: edit.other, address: edit.address})
    }
    const changeZalo = (value) =>{
        setEdit({name: edit.name, email: edit.email, phone: edit.phone, facebook: edit.facebook, zalo: value, other: edit.other, address: edit.address})
    }
    const changeOther = (value) =>{
        setEdit({name: edit.name, email: edit.email, phone: edit.phone, facebook: edit.facebook, zalo: edit.zalo, other: value, address: edit.address})
    }
    const changeAddress = (value) =>{
        setEdit({name: edit.name, email: edit.email, phone: edit.phone, facebook: edit.facebook, zalo: edit.zalo, other: edit.other, address: value})
    }

    const handleSave = () => {
        setData(edit)
        alert('Đã lưu')
    }

    const handleCancel = () => {
        if (window.confirm('Hủy thay đổi?')) {
            setEdit(data)
        } else return null
    }

    return (
        <div className={cl('wrap-content')}>
            <div className={cl('header-content')}>Chỉnh sửa thông tin</div>
            <div className={cl('content')}>
                <div className={cl('props')}>
                    <div className={cl('props-item')}>
                        <label>Họ Tên</label>
                        <input
                            id="name"
                            value={edit.name}
                            className={cl('value-item')}
                            onChange={(e) => changeName(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Email</label>
                        <input
                            id="email"
                            value={edit.email}
                            className={cl('value-item')}
                            onChange={(e) => changeEmail(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Số điện thoại</label>
                        <input
                            id="phone"
                            value={edit.phone}
                            className={cl('value-item')}
                            onChange={(e) => changePhone(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Địa chỉ cụ thể</label>
                        <input
                            id="address"
                            value={edit.address}
                            className={cl('value-item')}
                            onChange={(e) => changeAddress(e.target.value)}
                        />
                    </div>
                </div>
                <div className={cl('props')}>
                    <div className={cl('props-item')}>
                        <label>Facebook</label>
                        <input
                            id="facebook"
                            value={edit.facebook}
                            className={cl('value-item')}
                            onChange={(e) => changeFacebook(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Zalo</label>
                        <input
                            id="zalo"
                            value={edit.zalo}
                            className={cl('value-item')}
                            onChange={(e) => changeZalo(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Khác</label>
                        <input
                            id="other"
                            value={edit.other}
                            className={cl('value-item')}
                            onChange={(e) => changeOther(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className={cl('btn')}>
                <button
                    className={cl('btn-save')}
                    disabled={edit === data}
                    onClick={handleSave}
                >
                    Lưu
                </button>
                <button
                    className={cl('btn-cancel')}
                    disabled={edit === data}
                    onClick={handleCancel}
                >
                    Hủy
                </button>
            </div>
        </div>
    );
}



export default EditInfo;

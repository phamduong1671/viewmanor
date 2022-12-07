import classNames from "classnames/bind";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";

import { storage } from "../../firebase";
import style from './EditInfo.module.scss'
import { db } from '../../firebase'
import { AuthContext } from '../../context/AuthContext'

function EditInfo() {
    const cl = classNames.bind(style)
    const [file, setFile] = useState('')
    const [user, setUser] = useState({})
    const [edit, setEdit] = useState({})
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {
                    if (doc.id === currentUser.uid) {
                        setUser({ id: doc.id, ...doc.data() })
                    }
                });
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, [currentUser])
    
    console.log(user);
    
    const handleUpdate = (e) => {

    }

    const handleSave = () => {

    }

    const handleCancel = () => {
        if (window.confirm('Hủy thay đổi?')) {
            setEdit(user)
        } else return null
    }

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name
            const storageRef = ref(storage, name)

            console.log(name)

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                    });
                }
            );
        }
        file && uploadFile()
    }, [file])

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
                            onChange={(e) => handleUpdate(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Email</label>
                        <input
                            id="email"
                            value={edit.email}
                            className={cl('value-item')}
                            onChange={(e) => handleUpdate(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Số điện thoại</label>
                        <input
                            id="phone"
                            value={edit.phone}
                            className={cl('value-item')}
                            onChange={(e) => handleUpdate(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Địa chỉ cụ thể</label>
                        <input
                            id="address"
                            value={edit.address}
                            className={cl('value-item')}
                            onChange={(e) => handleUpdate(e.target.value)}
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
                            onChange={(e) => handleUpdate(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Zalo</label>
                        <input
                            id="zalo"
                            value={edit.zalo}
                            className={cl('value-item')}
                            onChange={(e) => handleUpdate(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Khác</label>
                        <input
                            id="other"
                            value={edit.other}
                            className={cl('value-item')}
                            onChange={(e) => handleUpdate(e.target.value)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <div
                            className={cl('btn-image')}
                            onClick={() => document.querySelector('.input-field').click()}
                        >
                            Đổi ảnh đại diện
                            <input
                                type='file'
                                className={cl('input-field')}
                                onChange={(e) => setFile(e.target.files[0])}
                                hidden
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={cl('btn')}>
                <button
                    className={cl('btn-save')}
                    disabled={edit === user}
                    onClick={handleSave}
                >
                    Lưu
                </button>
                <button
                    className={cl('btn-cancel')}
                    disabled={edit === user}
                    onClick={handleCancel}
                >
                    Hủy
                </button>
            </div>
        </div>
    );
}



export default EditInfo;

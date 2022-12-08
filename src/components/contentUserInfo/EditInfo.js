import classNames from "classnames/bind";
import { collection, doc, getDocs, runTransaction } from "firebase/firestore";
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
    const [original, setOriginal] = useState({})
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {
                    if (doc.id === currentUser.uid) {
                        const data = { id: doc.id, ...doc.data() }
                        setUser(data)
                        setOriginal(data)
                    }
                });
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    }, [currentUser])

    const handleInput = (e) => {
        setUser({ ...user, [e.target.id]: e.target.value })
    }

    // Cập nhật thông tin người dùng
    const handleSave = async (e) => {
        e.preventDefault();

        if (user.name === '' || user.email === '' || user.phone === '')
            alert('Không được để trống "Họ tên", "Email" và "Số điện thoại"!')
        else {
            setOriginal(user)
            try {
                await runTransaction(db, async (transaction) => {
                    const sfDoc = await transaction.get(doc(db, "users", user.id));
                    if (!sfDoc.exists()) {
                        // eslint-disable-next-line
                        throw "Document does not exist!";
                    }
                    transaction.update(doc(db, "users", user.id), { ...user });
                });
                alert('Đã lưu')
            } catch (e) {
                console.log("Transaction failed: ", e);
            }
            window.location.reload(false);
        }
    }

    const handleCancel = () => {
        if (window.confirm('Hủy thay đổi?')) {
            setUser(original)
        } else return null
    }

    useEffect(() => {
        const uploadFile = () => {
            const name = new Date().getTime() + file.name
            const storageRef = ref(storage, name)
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
                        setUser((prev) => ({ ...prev, avatar: downloadURL }))
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
                            value={user.name || ''}
                            className={cl('value-item')}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Email</label>
                        <input
                            id="email"
                            value={user.email || ''}
                            className={cl('value-item')}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Số điện thoại</label>
                        <input
                            id="phone"
                            value={user.phone || ''}
                            className={cl('value-item')}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Địa chỉ cụ thể</label>
                        <input
                            id="address"
                            value={user.address || ''}
                            className={cl('value-item')}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                </div>
                <div className={cl('props')}>
                    <div className={cl('props-item')}>
                        <label>Facebook</label>
                        <input
                            id="facebook"
                            value={user.facebook || ''}
                            className={cl('value-item')}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Zalo</label>
                        <input
                            id="zalo"
                            value={user.zalo || ''}
                            className={cl('value-item')}
                            onChange={(e) => handleInput(e)}
                        />
                    </div>
                    <div className={cl('props-item')}>
                        <label>Khác</label>
                        <input
                            id="other"
                            value={user.other || ''}
                            className={cl('value-item')}
                            onChange={(e) => handleInput(e)}
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
                    disabled={user === original}
                    onClick={handleSave}
                >
                    Lưu
                </button>
                <button
                    className={cl('btn-cancel')}
                    disabled={user === original}
                    onClick={handleCancel}
                >
                    Hủy
                </button>
            </div>
        </div>
    );
}



export default EditInfo;

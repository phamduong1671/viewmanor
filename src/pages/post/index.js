import classNames from "classnames/bind";
import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";

import style from './Post.module.scss'
import { categorys, types, dvhc } from '../../tree.js'
import { db, storage } from '../../firebase'
import { AuthContext } from '../../context/AuthContext'
import { PostContext } from "../../context/PostContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

function Post() {
    const cl = classNames.bind(style)
    const { currentUser } = useContext(AuthContext)
    const { currentPost } = useContext(PostContext)
    const [post, setPost] = useState({})
    const [data, setData] = useState({ image: [] })
    const [show, setShow] = useState('')
    const [category, setCategory] = useState('')
    const [type, setType] = useState({})
    const [city, setCity] = useState({})
    const [distric, setDistric] = useState({})
    const [ward, setWard] = useState({})
    const [file, setFile] = useState('')
    const [imgs, setImgs] = useState([])
    const [warn, setWarn] = useState([])

    useEffect(() => {
        if (currentPost) {
            const unsub = onSnapshot(doc(db, "posts", currentPost),
                (doc) => {
                    setPost({ id: doc.id, ...doc.data() })
                }, (error) => {
                    console.log(error);
                }
            );
            return () => {
                unsub();
            }
        }
    }, [currentPost])

    console.log(post);

    const today = new Date()
    const currentDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    const showValue = (e) => {
        let id = ''
        e.target.parentNode.id ? id = e.target.parentNode.id
            : e.target.parentNode.parentNode.id ? id = e.target.parentNode.parentNode.id
                : id = e.target.parentNode.parentNode.parentNode.id
        if (id === show) {
            setShow('')
        } else setShow(id)
    }

    const selectItem = (e) => {
        switch (e.target.id.length) {
            case 1:
                const selected1 = types.filter(item => item.id === e.target.id)
                setType(selected1[0])
                setData({ ...data, type: selected1[0].name })
                break;
            case 2:
                const selected2 = dvhc.filter(item => item.level1_id === e.target.id)
                setCity(selected2[0])
                setData({ ...data, city: selected2[0].name })
                break;
            case 3:
                const selected3 = city.level2s.filter(item => item.level2_id === e.target.id)
                setDistric(selected3[0])
                setData({ ...data, distric: selected3[0].name })
                break;
            case 5:
                const selected5 = distric.level3s.filter(item => item.level3_id === e.target.id)
                setWard(selected5[0])
                setData({ ...data, ward: selected5[0].name })
                break;
            case 6:
                const selected6 = categorys.filter(item => item.id === e.target.id)
                setCategory(selected6[0])
                setData({ ...data, category: selected6[0].name })
                break;
            default:
                break;
        }
    }

    const handleInput = (e) => {
        const id = e.target.id
        let value = e.target.value
        if (id === 'sqm' || id === 'price')
            value = parseInt(value)

        setData({ ...data, [id]: value })
    }

    const handleSave = () => {

    }

    const handlePost = async (e) => {
        e.preventDefault()
        if (data.title && data.address && data.sqm && data.price && data.description && data.category && data.type && data.ward) {
            console.log('ok');
            try {
                const res = await addDoc(collection(db, "posts"), {
                    ...data,
                    date: currentDate,
                    userId: currentUser.uid
                });
                console.log(res.id);
                alert('Đăng thành công')
                window.location.reload(false);
            }
            catch (err) {
                console.log(err)
            }
        } else {                            // Bắt lỗi input trống
            const array = []
            if (!data.title)
                array.push('title')
            if (!data.address)
                array.push('address')
            if (!data.sqm)
                array.push('sqm')
            if (!data.price)
                array.push('price')
            if (!data.description)
                array.push('description')
            if (!data.category)
                array.push('category')
            if (!data.type)
                array.push('type')
            if (!data.ward)
                array.push('ward')
            setWarn(array)
        }
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
                        const array = [...imgs, downloadURL]
                        setImgs(array)
                        setData((prev) => ({ ...prev, image: array }))
                    });
                }
            );
        }
        file && uploadFile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    const handleDeleteImage = (e) => {
        const array = imgs.filter(i => i !== e.target.id)
        setImgs(array)
    }

    return (
        <div className={cl('content')}>
            <div className={cl('content-child')}>
                <div className={cl('post-props')}>Danh mục
                    <div id='category' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={category.name || 'Danh mục'}
                                readOnly
                            />
                            <div className={cl('icon-dropdown')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        {show === 'category' &&
                            <div className={cl('cbb-value')}>
                                {categorys.map(item => (
                                    <div
                                        key={item.id}
                                        id={item.id}
                                        className={cl('cbb-item')}
                                        onClick={(e) => selectItem(e)}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                {warn.filter(i => i === 'category').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng chọn danh mục
                    </div>}
                <div className={cl('post-props')}>Loại
                    <div id='type' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={type.name || 'Loại'}
                                readOnly
                            />
                            <div className={cl('icon-dropdown')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        {show === 'type' &&
                            <div className={cl('cbb-value')}>
                                {types.map(item => (
                                    <div
                                        key={item.id}
                                        id={item.id}
                                        className={cl('cbb-item')}
                                        onClick={(e) => selectItem(e)}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                {warn.filter(i => i === 'type').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng chọn loại
                    </div>}
                <div className={cl('post-props')}>Tỉnh / Thành phố
                    <div id='city' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={city.name || 'Tỉnh / Thành phố'}
                                readOnly
                            />
                            <div className={cl('icon-dropdown')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        {show === 'city' &&
                            <div className={cl('cbb-value')}>
                                {dvhc.map(item => (
                                    <div
                                        key={item.level1_id}
                                        id={item.level1_id}
                                        className={cl('cbb-item')}
                                        onClick={(e) => selectItem(e)}
                                    >
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
                <div className={cl('post-props')}>Quận / Huyện
                    <div id='distric' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={distric.name || 'Quận / Huyện'}
                                readOnly
                            />
                            <div className={cl('icon-dropdown')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        {show === 'distric' &&
                            <div className={cl('cbb-value')}>
                                {city.name ?
                                    city.level2s.map(item => (
                                        <div
                                            key={item.level2_id}
                                            id={item.level2_id || ''}
                                            className={cl('cbb-item')}
                                            onClick={(e) => selectItem(e)}
                                        >
                                            {item.name}
                                        </div>
                                    ))
                                    : <div className={cl('cbb-item')}>Chưa chọn Tỉnh / Thành Phố</div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className={cl('post-props')}>Xã / Phường
                    <div id='ward' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={ward.name || 'Xã / Phường'}
                                readOnly
                            />
                            <div className={cl('icon-dropdown')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        {show === 'ward' &&
                            <div className={cl('cbb-value')}>
                                {distric.name ?
                                    distric.level3s.map(item => (
                                        <div
                                            key={item.level3_id}
                                            id={item.level3_id || ''}
                                            className={cl('cbb-item')}
                                            onClick={(e) => selectItem(e)}
                                        >
                                            {item.name}
                                        </div>
                                    ))
                                    : <div className={cl('cbb-item')}>Chưa chọn Quận / Huyện</div>
                                }
                            </div>
                        }
                    </div>
                </div>
                {warn.filter(i => i === 'ward').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng chọn địa chỉ
                    </div>}
            </div>
            <div className={cl('content-child')}>
                <div className={cl('post-props')}>Tiêu đề
                    <textarea
                        id='title'
                        className={cl('input-text', 'title')}
                        onChange={(e) => handleInput(e)}
                        spellCheck='false'
                    >
                    </textarea>
                </div>
                {warn.filter(i => i === 'title').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng nhập tiêu đề
                    </div>}
                <div className={cl('post-props')}>Địa chỉ cụ thể
                    <textarea
                        id='address'
                        className={cl('input-text', 'address')}
                        onChange={(e) => handleInput(e)}
                        spellCheck='false'
                    >
                    </textarea>
                </div>
                {warn.filter(i => i === 'address').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng nhập địa chỉ cụ thể
                    </div>}
                <div className={cl('post-props')}>Diện tích (m²)
                    <input
                        id='sqm'
                        type='number'
                        className={cl('input-text')}
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                {warn.filter(i => i === 'sqm').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng nhập diện tích
                    </div>}
                <div className={cl('post-props')}>Giá (VND)
                    <input
                        id='price'
                        type='number'
                        className={cl('input-text')}
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                {warn.filter(i => i === 'price').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng nhập giá
                    </div>}
                <div className={cl('post-props')}>Mô tả chi tiết (nội thất, dịch vụ, ...)
                    <textarea
                        id='description'
                        className={cl('input-text', 'description')}
                        onChange={(e) => handleInput(e)}
                        spellCheck='false'
                    >
                    </textarea>
                </div>
                {warn.filter(i => i === 'description').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui lòng nhập mô tả
                    </div>
                }
                {currentPost ?
                    <button
                        className={cl('btn-post')}
                        onClick={handleSave}
                    >
                        Lưu
                    </button>
                    : <button
                        className={cl('btn-post')}
                        onClick={handlePost}
                    >
                        Đăng tin
                    </button>
                }
            </div>
            <div className={cl('content-child-right')}>
                <div className={cl('post-props')}>Hình ảnh
                    <div className={cl('btn-image')} onClick={() => document.querySelector('.input-field').click()}>
                        Tải ảnh lên
                        <input
                            type='file'
                            className={cl('input-field')}
                            onChange={(e) => setFile(e.target.files[0])}
                            hidden
                        />
                    </div>
                </div>
                <div className={cl('wrap-image')}>
                    {imgs.map((item, index) =>
                        <div
                            key={index}
                            className={cl('d-images')}
                        >
                            <button
                                id={item}
                                className={cl('delete-image')}
                                onClick={(e) => handleDeleteImage(e)}
                            >
                                x
                            </button>
                            <img
                                className={cl('images')}
                                src={item}
                                alt="avatar"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Post;
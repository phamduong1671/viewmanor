import classNames from "classnames/bind";
import { useState, useContext, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection, doc, onSnapshot, runTransaction } from "firebase/firestore";

import { useClickOutside } from "../../hooks";
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

    const today = new Date()
    const currentDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    const wrapperRef = useRef("");
    useClickOutside(wrapperRef, () => {
        setShow('');
    });

    useEffect(() => {
        if (currentPost) {
            const unsub = onSnapshot(doc(db, "posts", currentPost),
                (doc) => {
                    setCategory({ name: doc.data().category })
                    setType({ name: doc.data().type })
                    setCity({ name: doc.data().city })
                    setDistric({ name: doc.data().distric })
                    setWard({ name: doc.data().ward })
                    setImgs(doc.data().image)
                    setData({ ...doc.data() })
                }, (error) => {
                    console.log(error);
                }
            );
            return () => {
                unsub();
            }
        }
    }, [currentPost])

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

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(doc(db, "posts", currentPost));
                if (!sfDoc.exists()) {
                    // eslint-disable-next-line
                    throw "Document does not exist!";
                }
                transaction.update(doc(db, "posts", currentPost), { ...data });
            });
            console.log(data);
            alert('???? l??u')
        } catch (e) {
            console.log("Transaction failed: ", e);
        }
    }

    const handlePost = async (e) => {
        e.preventDefault()
        if (data.title && data.address && data.sqm && data.price && data.description && data.category && data.type && data.ward) {
            try {
                const res = await addDoc(collection(db, "posts"), {
                    ...data,
                    date: currentDate,
                    userId: currentUser.uid
                });
                console.log(res.id);
                alert('????ng th??nh c??ng')
                window.location.reload(false);
            }
            catch (err) {
                console.log(err)
            }
        } else {                            // B???t l???i input tr???ng
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
        setData((prev) => ({ ...prev, image: array }))
    }

    return (
        <div className={cl('content')}>
            <div ref={wrapperRef} className={cl('content-child')}>
                <div className={cl('post-props')}>Danh m???c
                    <div id='category' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={category.name || 'Danh m???c'}
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
                        Vui l??ng ch???n danh m???c
                    </div>}
                <div className={cl('post-props')}>Lo???i
                    <div id='type' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={type.name || 'Lo???i'}
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
                        Vui l??ng ch???n lo???i
                    </div>}
                <div className={cl('post-props')}>T???nh / Th??nh ph???
                    <div id='city' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={city.name || 'T???nh / Th??nh ph???'}
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
                <div className={cl('post-props')}>Qu???n / Huy???n
                    <div id='distric' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={distric.name || 'Qu???n / Huy???n'}
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
                                    : <div className={cl('cbb-item')}>Ch??a ch???n T???nh / Th??nh Ph???</div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className={cl('post-props')}>X?? / Ph?????ng
                    <div id='ward' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={ward.name || 'X?? / Ph?????ng'}
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
                                    : <div className={cl('cbb-item')}>Ch??a ch???n Qu???n / Huy???n</div>
                                }
                            </div>
                        }
                    </div>
                </div>
                {warn.filter(i => i === 'ward').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui l??ng ch???n ?????a ch???
                    </div>}
            </div>
            <div className={cl('content-child')}>
                <div className={cl('post-props')}>Ti??u ?????
                    <textarea
                        id='title'
                        value={data.title || ''}
                        className={cl('input-text', 'title')}
                        onChange={(e) => handleInput(e)}
                        spellCheck='false'
                    />
                </div>
                {warn.filter(i => i === 'title').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui l??ng nh???p ti??u ?????
                    </div>}
                <div className={cl('post-props')}>?????a ch??? c??? th???
                    <textarea
                        id='address'
                        value={data.address || ''}
                        className={cl('input-text', 'address')}
                        onChange={(e) => handleInput(e)}
                        spellCheck='false'
                    />
                </div>
                {warn.filter(i => i === 'address').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui l??ng nh???p ?????a ch??? c??? th???
                    </div>}
                <div className={cl('post-props')}>Di???n t??ch (m??)
                    <input
                        id='sqm'
                        type='number'
                        value={data.sqm || ''}
                        className={cl('input-text')}
                        onChange={(e) => handleInput(e)}
                    />
                </div>
                {warn.filter(i => i === 'sqm').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui l??ng nh???p di???n t??ch
                    </div>}
                <div className={cl('post-props')}>
                    Gi?? (VND)
                    <input
                        id='price'
                        type='number'
                        value={data.price || ''}
                        className={cl('input-text')}
                        onChange={(e) => handleInput(e)}
                    />
                    {data.price &&
                        <div
                            className={cl('preview-price')}
                        >
                            {data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND
                        </div>
                    }
                </div>
                {warn.filter(i => i === 'price').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui l??ng nh???p gi??
                    </div>}
                <div className={cl('post-props')}>M?? t??? chi ti???t (n???i th???t, d???ch v???, ...)
                    <textarea
                        id='description'
                        value={data.description || ''}
                        className={cl('input-text', 'description')}
                        onChange={(e) => handleInput(e)}
                        spellCheck='false'
                    />
                </div>
                {warn.filter(i => i === 'description').length !== 0
                    && <div className={cl('d-warning')} >
                        Vui l??ng nh???p m?? t???
                    </div>
                }
                {currentPost ?
                    <button
                        className={cl('btn-post')}
                        onClick={handleSave}
                    >
                        L??u
                    </button>
                    : <button
                        className={cl('btn-post')}
                        onClick={handlePost}
                    >
                        ????ng tin
                    </button>
                }
            </div>
            <div className={cl('content-child-right')}>
                <div className={cl('post-props')}>H??nh ???nh
                    <div className={cl('btn-image')} onClick={() => document.querySelector('.input-field').click()}>
                        T???i ???nh l??n
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
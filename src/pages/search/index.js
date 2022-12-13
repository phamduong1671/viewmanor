import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faHouse, faRulerCombined } from "@fortawesome/free-solid-svg-icons";
import { faMap, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { db } from "../../firebase";
import style from './Search.module.scss';
import { types, dvhc, sqms } from '../../tree.js'
import { PostContext } from "../../context/PostContext";
import { PropsContext } from "../../context/PropsContext";
import image from '../../assets/image/background-sign-up.png';

function Search() {
    const navigate = useNavigate()
    const cl = classNames.bind(style);
    const { currentProps } = useContext(PropsContext)
    const [posts, setPosts] = useState([])
    const [props, setProps] = useState(currentProps)
    const { dispatch } = useContext(PostContext)
    const [show, setShow] = useState('')
    const [city, setCity] = useState({})
    const [distric, setDistric] = useState({})
    const [sqm, setSqm] = useState(currentProps.sqm || {})

    useEffect(() => {
        handleSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

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
                setProps({ ...props, type: selected1[0].name })
                break;
            case 2:
                const selected2 = dvhc.filter(item => item.level1_id === e.target.id)
                setCity(selected2[0])
                setProps({ ...props, city: selected2[0].name })
                break;
            case 3:
                const selected3 = city.level2s.filter(item => item.level2_id === e.target.id)
                setDistric(selected3[0])
                setProps({ ...props, distric: selected3[0].name })
                break;
            case 4:
                const selected4 = sqms.filter(item => item.id === e.target.id)
                setSqm(selected4[0])
                setProps({ ...props, sqmMin: selected4[0].min, sqmMax: selected4[0].max })
                break;
            default:
                break;
        }
    }

    const handleSearch = async () => {
        // Mảng chứa các query về đặc điểm cần tìm kiếm
        let array = []
        for (const [key, value] of Object.entries(props)) {
            array.push(where(key, '==', value))
        }

        const q = query(
            collection(db, "posts"),
            ...array
        );

        const querySnapshot = await getDocs(q);
        let list = [];
        querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() })
        });
        setPosts(list);
    }

    const goInfoItemPage = (e) => {
        const postId = { id: e.target.id }
        dispatch({ type: "SHOW", payload: postId })

        navigate('/info-item')
    }

    return (
        <div className={cl('wrap-content')}>
            <div className={cl('content-header')}>
                {/* Loại */}
                <div
                    id='type'
                    className={cl('cbb-container')}
                    onClick={(e) => showValue(e)}
                >
                    <div className={cl('input-container')}>
                        <input className={cl('input-cbb')}
                            spellCheck={false}
                            value={props.type || 'Loại'}
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
                                    key={item.name}
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
                {/* Tỉnh Thành */}
                <div id='city' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                    <div className={cl('input-container')}>
                        <input className={cl('input-cbb')}
                            spellCheck={false}
                            value={props.city || 'Tỉnh / Thành phố'}
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
                {/* Quận Huyện */}
                <div
                    id='distric'
                    className={cl('cbb-container')}
                    onClick={(e) => showValue(e)}
                >
                    <div className={cl('input-container')}>
                        <input className={cl('input-cbb')}
                            spellCheck={false}
                            value={props.distric || 'Quận / Huyện'}
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

                {/* Diện tích */}
                <div
                    id='sqm'
                    className={cl('cbb-container')}
                    onClick={(e) => showValue(e)}
                >
                    <div className={cl('input-container')}>
                        <input className={cl('input-cbb')}
                            spellCheck={false}
                            value={sqm.name || 'Diện tích'}
                            readOnly
                        />
                        <div className={cl('icon-dropdown')}>
                            <FontAwesomeIcon icon={faAngleDown} />
                        </div>
                    </div>
                    {show === 'sqm' &&
                        <div className={cl('cbb-value')}>
                            {sqms.map(item => (
                                <div
                                    key={item.name}
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

                <div className={cl('btn-search')} onClick={handleSearch}>
                    <FontAwesomeIcon
                        fontSize={'20px'}
                        icon={faMagnifyingGlass}
                    />
                    Tìm
                </div>
            </div>
            <div className={cl('content')}>
                {posts.map(post =>
                    <div
                        key={post.id}
                        id={post.id}
                        className={cl('slick-item')}
                        onClick={e => goInfoItemPage(e)}
                    >
                        <div id={post.id} className={cl('wrap-image')}>
                            <img
                                id={post.id}
                                className={cl('image')}
                                src={image}
                                alt="postItem"
                            />
                        </div>
                        <div id={post.id} className={cl('wrap-info')}>
                            <div id={post.id} className={cl('title')}>
                                {post.title}
                            </div>
                            <div id={post.id} className={cl('info')}>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faHouse} color='#32a428' />
                                    <label id={post.id}>{post.type}</label>
                                </div>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faRulerCombined} color='#32a428' />
                                    <label id={post.id}>{post.sqm + ' m²'}</label>
                                </div>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faMoneyBill1} color='#32a428' />
                                    <label id={post.id}>{post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'}</label>
                                </div>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faMap} color='#32a428' />
                                    <label id={post.id}>{post.ward + ', ' + post.distric + ', ' + post.city}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
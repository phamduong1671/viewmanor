import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState, useMemo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { faMap, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { faHouse, faRulerCombined, faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { useClickOutside } from "../../hooks";
import { db } from "../../firebase";
import style from './Search.module.scss';
import Pagination from "../../components/pagination";
import { PostContext } from "../../context/PostContext";
import { PropsContext } from "../../context/PropsContext";
import image from '../../assets/image/no-image.png';
import { categorys, types, dvhc, sqms, priceRent, priceBuy } from '../../tree.js';

let PageSize = 15;

function Search() {
    const navigate = useNavigate()
    const cl = classNames.bind(style);
    const { currentProps } = useContext(PropsContext)
    const [lockedUsers, setLockedUsers] = useState([])
    const [posts, setPosts] = useState([])
    const { postDispatch } = useContext(PostContext)
    const [show, setShow] = useState('')
    const [city, setCity] = useState({})
    const [distric, setDistric] = useState({})
    const [sqm, setSqm] = useState(currentProps.sqm || {})
    const [price, setPrice] = useState({ min: 0, max: 999999999999 })
    const [props, setProps] = useState(currentProps)
    const [currentPage, setCurrentPage] = useState(1);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return posts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, posts]);

    const wrapperRef = useRef("");
    useClickOutside(wrapperRef, () => {
        setShow('');
    });

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    if (doc.data().status === 'Bị khóa')
                        list.push({ id: doc.id, ...doc.data() })
                });
                setLockedUsers(list);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    }, [])

    useEffect(() => {
        handleSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props, lockedUsers])

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
            case 5:
                const selected5 = distric.level3s.filter(item => item.level3_id === e.target.id)
                setProps({ ...props, ward: selected5[0].name })
                break;
            case 6:
                const selected6 = categorys.filter(item => item.id === e.target.id)
                setProps({ ...props, category: selected6[0].name })
                break;
            case 7:
                const selected7 = priceRent.filter(item => item.id === e.target.id)
                setPrice(selected7[0])
                setProps({ ...props, priceMin: selected7[0].min, priceMax: selected7[0].max })
                break;
            case 8:
                const selected8 = priceBuy.filter(item => item.id === e.target.id)
                setPrice(selected8[0])
                setProps({ ...props, priceMin: selected8[0].min, priceMax: selected8[0].max })
                break;
            default:
                break;
        }
    }

    const handleSearch = async () => {
        // Mảng chứa các query về đặc điểm cần tìm kiếm
        let array = []
        for (const [key, value] of Object.entries(props)) {
            if (key !== 'sqmMin' && key !== 'sqmMax' && key !== 'sqm' && key !== 'priceMin' && key !== 'priceMax') {
                array.push(where(key, '==', value))
            } else {
                if (key === 'sqmMin')
                    array.push(where('sqm', '>', value))
                if (key === 'sqmMax')
                    array.push(where('sqm', '<=', value))
            }
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
        list = list.filter(item => price.min < item.price && item.price <= price.max)
        lockedUsers.forEach(lockedUser =>
            list = list.filter(item => item.userId !== lockedUser.id)
        )
        setPosts(list);
    }

    const resetProps = () => {
        setProps({ sqmMin: 0, sqmMax: 999999999 })
        setPrice({ min: 0, max: 999999999999 })
        setSqm({})
        setCity({})
        setDistric({})
    }

    const goInfoItemPage = (e) => {
        const postId = { id: e.target.id }
        postDispatch({ type: "SHOW", payload: postId })

        navigate('/info-item')
    }

    return (
        <div className={cl('wrap-content')}>
            <div ref={wrapperRef} className={cl('header')}>
                <div className={cl('content-header')}>
                    {/* Danh mục */}
                    <div
                        id='category'
                        className={cl('cbb-container')}
                        onClick={(e) => showValue(e)}
                    >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={props.category || 'Danh mục'}
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
                    {/* Giá */}
                    <div
                        id='price'
                        className={cl('cbb-container')}
                        onClick={(e) => showValue(e)}
                    >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={price.name || 'Giá'}
                                readOnly
                            />
                            <div className={cl('icon-dropdown')}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        </div>
                        {show === 'price' && (
                            props.category === 'Cho thuê' ?
                                <div className={cl('cbb-value')}>
                                    {priceRent.map(item => (
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
                                : <div className={cl('cbb-value')}>
                                    {priceBuy.map(item => (
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
                        )}
                    </div>
                </div>
                <div className={cl('content-header')}>
                    {/* Tỉnh / Thành phố */}
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
                    {/* Quận / Huyện */}
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
                    {/* Xã / Phường */}
                    <div
                        id='ward'
                        className={cl('cbb-container')}
                        onClick={(e) => showValue(e)}
                    >
                        <div className={cl('input-container')}>
                            <input className={cl('input-cbb')}
                                spellCheck={false}
                                value={props.ward || 'Xã / Phường'}
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
            </div>

            <div className={cl('btn-reset')} onClick={resetProps}>
                Đặt lại
            </div>
            <div className={cl('results')}>
                - {posts.length} kết quả được tìm thấy -
            </div>
            {/* Kết quả tìm kiếm */}
            <div className={cl('content')}>
                {currentTableData.map(post =>
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
                                src={post.image[0] || image}
                                alt="postItem"
                            />
                        </div>
                        <div id={post.id} className={cl('wrap-info')}>
                            <div id={post.id} className={cl('title')}>
                                {post.title}
                            </div>
                            <div id={post.id} className={cl('info')}>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faHouse} color='#32a428' /> { }
                                    <label id={post.id}>{post.type}</label>
                                </div>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faRulerCombined} color='#32a428' /> { }
                                    <label id={post.id}>{post.sqm + ' m²'}</label>
                                </div>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faMoneyBill1} color='#32a428' /> { }
                                    <label id={post.id}>{post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'}</label>
                                </div>
                                <div id={post.id}>
                                    <FontAwesomeIcon icon={faMap} color='#32a428' /> { }
                                    <label id={post.id}>{post.ward + ', ' + post.distric + ', ' + post.city}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={posts.length}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    );
}

export default Search;
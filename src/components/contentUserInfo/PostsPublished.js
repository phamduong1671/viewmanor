import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState, useMemo, Fragment, useRef } from "react";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import 'tippy.js/animations/shift-away.css';
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

import style from './PostsPublished.module.scss';
import { db } from '../../firebase.js';
import { PostContext } from '../../context/PostContext';
import Pagination from "../pagination";
import { useClickOutside } from "../../hooks";

let PageSize = 10;
const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048]

function PostsPublished({ id }) {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const { postDispatch } = useContext(PostContext)
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [personalPosts, setPersonalPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState({})
    const [showFilter, setShowFilter] = useState(false)
    const [show, setShow] = useState('')
    const [prevDate, setPrevDate] = useState('1/1/2010')
    const [lastDate, setLastDate] = useState('1/1/2048')
    const [props, setProps] = useState({
        prevDay: 1,
        prevMonth: 1,
        prevYear: 2010,
        lastDay: 1,
        lastMonth: 1,
        lastYear: 2048
    })

    const wrapperRef = useRef("");
    useClickOutside(wrapperRef, () => {
        setShow('');
    });

    const currentTablePosts = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return posts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, posts]);

    const currentTablePersonalPosts = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return personalPosts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, personalPosts]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "users"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                setUsers(list);
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    }, [])

    useEffect(() => {
        const fetchPosts = async () => {
            let list = []
            let list2 = []
            try {
                const querySnapshot = await getDocs(collection(db, "posts"));
                querySnapshot.forEach(doc => {
                    const address = [doc.data().address, doc.data().ward, doc.data().distric, doc.data().city].join(', ')
                    users.forEach(user => {
                        if (user.id === doc.data().userId) {
                            if (user.name.toLowerCase().search(search.userSearch) !== -1 &&
                                address.toLowerCase().search(search.addressSearch) !== -1 &&
                                convertDateToNumber(doc.data().date) >= convertDateToNumber(prevDate) &&
                                convertDateToNumber(doc.data().date) <= convertDateToNumber(lastDate)
                            )
                                list.push({ id: doc.id, userName: user.name, ...doc.data() })
                        }
                    })
                    if (doc.data().userId === id &&
                        address.toLowerCase().search(search.addressSearch) !== -1 &&
                        convertDateToNumber(doc.data().date) >= convertDateToNumber(prevDate) &&
                        convertDateToNumber(doc.data().date) <= convertDateToNumber(lastDate)
                    )
                        list2.push({ id: doc.id, ...doc.data() })
                });
                setPosts(list)
                setPersonalPosts(list2)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts();
    }, [id, search, prevDate, lastDate, users])

    const convertDateToNumber = (date) => {
        return Date.parse(
            [
                date.split("/")[1],
                date.split("/")[0],
                date.split("/")[2]
            ].join('/')
        );
    }

    const handleDelete = async (id) => {
        if (window.confirm('Xóa tin đăng này?')) {
            try {
                await deleteDoc(doc(db, "posts", id));
                setPosts(posts.filter(item => item.id !== id))
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleView = (e) => {
        const postId = { id: e.target.id }
        postDispatch({ type: "SHOW", payload: postId })
        navigate('/info-item')
    }

    const handleUpdate = (e) => {
        postDispatch({ type: 'SHOW', payload: e.target.id })
        navigate('/post')
    }

    const handleSearch = (e) => {
        setSearch({ ...search, [e.target.id]: e.target.value.toLowerCase() })
    }

    const handleFilter = () => {
        setShowFilter(true)
    }

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
        switch (show) {
            case 'prevDays':
                setProps({ ...props, prevDay: e.target.id })
                break;
            case 'prevMonths':
                setProps({ ...props, prevMonth: e.target.id })
                break;
            case 'prevYears':
                setProps({ ...props, prevYear: e.target.id })
                break;
            case 'lastDays':
                setProps({ ...props, lastDay: e.target.id })
                break;
            case 'lastMonths':
                setProps({ ...props, lastMonth: e.target.id })
                break;
            case 'lastYears':
                setProps({ ...props, lastYear: e.target.id })
                break;
            default:
                break;
        }
    }

    const handleApply = () => {
        setPrevDate([props.prevDay, props.prevMonth, props.prevYear].join('/'))
        setLastDate([props.lastDay, props.lastMonth, props.lastYear].join('/'))
        setShowFilter(false)
    }

    const handleReset = () => {
        setProps({
            prevDay: 1,
            prevMonth: 1,
            prevYear: 2010,
            lastDay: 1,
            lastMonth: 1,
            lastYear: 2048
        })
    }

    return (
        <Fragment>
            {showFilter &&
                <div className={cl('wrap-filter')}>
                    <div ref={wrapperRef} className={cl('filter')}>
                        <div
                            className={cl('btn-close')}
                            onClick={() => setShowFilter(false)}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </div>
                        Từ:
                        <div style={{ display: 'flex' }}>
                            {/* Ngày đầu */}
                            <div className={cl('filter-props')}>Ngày:
                                <div id='prevDays' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.prevDay || 'ngày'}
                                            readOnly
                                        />
                                        <div className={cl('icon-dropdown')}>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                    {show === 'prevDays' &&
                                        <div className={cl('cbb-value')}>
                                            {days.map(item => (
                                                <div
                                                    key={item}
                                                    id={item}
                                                    className={cl('cbb-item')}
                                                    onClick={(e) => selectItem(e)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                            {/* Tháng đầu*/}
                            <div className={cl('filter-props')}>Tháng:
                                <div id='prevMonths' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.prevMonth || 'tháng'}
                                            readOnly
                                        />
                                        <div className={cl('icon-dropdown')}>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                    {show === 'prevMonths' &&
                                        <div className={cl('cbb-value')}>
                                            {months.map(item => (
                                                <div
                                                    key={item}
                                                    id={item}
                                                    className={cl('cbb-item')}
                                                    onClick={(e) => selectItem(e)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                            {/* Năm đầu */}
                            <div className={cl('filter-props')}>Năm:
                                <div id='prevYears' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.prevYear || 'năm'}
                                            readOnly
                                        />
                                        <div className={cl('icon-dropdown')}>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                    {show === 'prevYears' &&
                                        <div className={cl('cbb-value')}>
                                            {years.map(item => (
                                                <div
                                                    key={item}
                                                    id={item}
                                                    className={cl('cbb-item')}
                                                    onClick={(e) => selectItem(e)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        Đến:
                        <div style={{ display: 'flex' }}>
                            {/* Ngày cuối */}
                            <div className={cl('filter-props')}>Ngày:
                                <div id='lastDays' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.lastDay || 'ngày'}
                                            readOnly
                                        />
                                        <div className={cl('icon-dropdown')}>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                    {show === 'lastDays' &&
                                        <div className={cl('cbb-value')}>
                                            {days.map(item => (
                                                <div
                                                    key={item}
                                                    id={item}
                                                    className={cl('cbb-item')}
                                                    onClick={(e) => selectItem(e)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                            {/* Tháng cuối */}
                            <div className={cl('filter-props')}>Tháng:
                                <div id='lastMonths' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.lastMonth || 'tháng'}
                                            readOnly
                                        />
                                        <div className={cl('icon-dropdown')}>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                    {show === 'lastMonths' &&
                                        <div className={cl('cbb-value')}>
                                            {months.map(item => (
                                                <div
                                                    key={item}
                                                    id={item}
                                                    className={cl('cbb-item')}
                                                    onClick={(e) => selectItem(e)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                            {/* Năm cuối */}
                            <div className={cl('filter-props')}>Năm:
                                <div id='lastYears' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.lastYear || 'năm'}
                                            readOnly
                                        />
                                        <div className={cl('icon-dropdown')}>
                                            <FontAwesomeIcon icon={faAngleDown} />
                                        </div>
                                    </div>
                                    {show === 'lastYears' &&
                                        <div className={cl('cbb-value')}>
                                            {years.map(item => (
                                                <div
                                                    key={item}
                                                    id={item}
                                                    className={cl('cbb-item')}
                                                    onClick={(e) => selectItem(e)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <button
                                className={cl('btn-apply')}
                                onClick={handleApply}
                            >
                                Áp dụng
                            </button>
                            <button
                                className={cl('btn-apply')}
                                onClick={handleReset}
                            >
                                Đặt lại
                            </button>
                        </div>
                    </div>
                </div>
            }
            <div className={cl('content')}>
                {id ?
                    <div className={cl('header-content')}>Tin đã đăng</div>
                    : <div className={cl('header-content')}>Quản lý tin đăng</div>
                }
                <div className={cl('header')}>
                    <div className={cl('header-left')}>
                        <div
                            onClick={handleFilter}
                            className={cl('btn-filter')}
                        >
                            <FontAwesomeIcon icon={faCalendarCheck} className={cl('icon-filter')} />
                            <div className={cl('label-filter')}>Lọc thời gian</div>
                        </div>
                    </div>
                    <div className={cl('header-right')}>
                        <input
                            id="addressSearch"
                            className={cl('box-search')}
                            placeholder='Tìm theo địa chỉ'
                            onChange={e => handleSearch(e)}
                        />
                        {id ? null
                            : <input
                                id="userSearch"
                                className={cl('box-search')}
                                placeholder='Tìm theo người đăng'
                                onChange={e => handleSearch(e)}
                            />
                        }
                    </div>
                </div>
                <div className={cl('wrap-table')}>
                    <table className={cl('d-table')}>
                        <thead>
                            <tr>
                                <th style={{ width: '100px' }}>Id</th>
                                <th style={{ width: '80px' }}>Danh Mục</th>
                                <th style={{ width: '80px' }}>Loại</th>
                                <th style={{ width: '25%' }} className={cl('td-sqm')}>Địa chỉ</th>
                                {id ?
                                    <th
                                        style={{ width: '80px' }}
                                        className={cl('td-sqm')}
                                    >
                                        Diện tích
                                    </th>
                                    : <th>Người đăng</th>
                                }
                                <th style={{ width: '90px' }}>Ngày đăng</th>
                                <th style={{ width: '13%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {id ?
                                // Bảng quản lý tin đăng cá nhân
                                currentTablePersonalPosts.map((post, index) => (
                                    post.userId === id &&
                                    <tr key={index}>
                                        <Tippy
                                            content={post.id}
                                        >
                                            <td>{post.id}</td>
                                        </Tippy>
                                        <td>{post.category}</td>
                                        <Tippy
                                            content={post.type}
                                        >
                                            <td>{post.type}</td>
                                        </Tippy>
                                        <Tippy
                                            content={[post.address, post.ward, post.distric, post.city].join(', ')}
                                        >
                                            <td>{[post.address, post.ward, post.distric, post.city].join(', ')}</td>
                                        </Tippy>
                                        <td className={cl('td-sqm')}>{post.sqm} m²</td>
                                        <td>{post.date}</td>
                                        <td>
                                            <Tippy
                                                content='Xem'
                                            >
                                                <button
                                                    id={post.id}
                                                    className={cl('btn-icon', 'btn-view')}
                                                    onClick={(e) => handleView(e)}
                                                ></button>
                                            </Tippy>
                                            <Tippy
                                                content='Sửa'
                                            >
                                                <button
                                                    id={post.id}
                                                    className={cl('btn-icon', 'btn-update')}
                                                    onClick={(e) => handleUpdate(e)}
                                                ></button>
                                            </Tippy>
                                            <Tippy
                                                content='Xóa'
                                            >
                                                <button
                                                    id={post.id}
                                                    className={cl('btn-icon', 'btn-delete')}
                                                    onClick={(e) => handleDelete(e.target.id)}
                                                ></button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                ))
                                // Bảng quản lý tất cả tin đăng
                                : currentTablePosts.map((post, index) =>
                                    <tr key={index}>
                                        <Tippy
                                            content={post.id}
                                        >
                                            <td>{post.id}</td>
                                        </Tippy>
                                        <td>{post.category}</td>
                                        <Tippy
                                            content={post.type}
                                        >
                                            <td>{post.type}</td>
                                        </Tippy>
                                        <Tippy
                                            content={[post.address, post.ward, post.distric, post.city].join(', ')}
                                        >
                                            <td>{[post.address, post.ward, post.distric, post.city].join(', ')}</td>
                                        </Tippy>
                                        <Tippy
                                            content={post.userName}
                                        >
                                            <td>
                                                {post.userName}
                                            </td>
                                        </Tippy>
                                        <td>{post.date}</td>
                                        <td className={cl('td-btn')}>
                                            <Tippy
                                                content='Xem'
                                            >
                                                <button
                                                    id={post.id}
                                                    className={cl('btn-icon', 'btn-view')}
                                                    onClick={(e) => handleView(e)}
                                                ></button>
                                            </Tippy>
                                            <Tippy
                                                content='Xóa'
                                            >
                                                <button
                                                    id={post.id}
                                                    className={cl('btn-icon', 'btn-delete')}
                                                    onClick={(e) => handleDelete(e.target.id)}
                                                ></button>
                                            </Tippy>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
                <div className={cl('wrap-pagination')}>
                    {id ?
                        <div className={cl('page-info')}>
                            Hiển thị {currentPage * PageSize - PageSize + 1}
                            -
                            {currentPage * PageSize < personalPosts.length ?
                                currentPage * PageSize
                                : personalPosts.length}/{personalPosts.length} tin
                        </div>
                        : <div className={cl('page-info')}>
                            Hiển thị {currentPage * PageSize - PageSize + 1}
                            -
                            {currentPage * PageSize < posts.length ?
                                currentPage * PageSize
                                : posts.length}/{posts.length} tin
                        </div>
                    }
                    {!id &&
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={posts.length}
                            pageSize={PageSize}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    }
                    {id &&
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={personalPosts.length}
                            pageSize={PageSize}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    }
                    <div className={cl('page-info')}>
                        {PageSize} tin/trang
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default PostsPublished;
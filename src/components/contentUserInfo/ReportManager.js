import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState, useMemo, Fragment, useRef } from "react";
import { collection, deleteDoc, doc, getDocs, onSnapshot, runTransaction } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import 'tippy.js/animations/shift-away.css';
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

import style from './ReportManager.module.scss';
import { db } from '../../firebase.js';
import { PostContext } from '../../context/PostContext';
import Pagination from "../pagination";
import { useClickOutside } from "../../hooks";

let PageSize = 10;
const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048]

function ReportManager({ id }) {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const { postDispatch } = useContext(PostContext)
    const [users, setUsers] = useState([])
    const [reports, setReports] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
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

    const currentTableReports = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return reports.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, reports]);

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
        const fetchReports = async () => {
            let list = []
            try {
                const querySnapshot = await getDocs(collection(db, "reports"));
                querySnapshot.forEach(doc => {
                    users.forEach(user => {
                        if (user.id === doc.data().userId) {
                            if (convertDateToNumber(doc.data().date) >= convertDateToNumber(prevDate) &&
                                convertDateToNumber(doc.data().date) <= convertDateToNumber(lastDate)
                            )
                                list.push({ id: doc.id, userName: user.name, userStatus: user.status, ...doc.data() })
                        }
                    })
                });
                setReports(list)
            } catch (error) {
                console.log(error)
            }
        }
        fetchReports();
    }, [id, prevDate, lastDate, users])

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
        if (window.confirm('X??a tin ????ng n??y?')) {
            try {
                await deleteDoc(doc(db, "reports", id));
                setReports(reports.filter(item => item.id !== id))
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

    const handleDisable = async (e) => {
        let user = {}
        users.forEach(item => {
            if (item.id === e.target.id)
                user = item
        })

        if (user.status === 'B??nh th?????ng') {
            if (window.confirm('Kh??a t??i kho???n n??y?')) {
                try {
                    await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(doc(db, "users", e.target.id));
                        if (!sfDoc.exists()) {
                            // eslint-disable-next-line
                            throw "Document does not exist!";
                        }
                        transaction.update(doc(db, "users", user.id), { ...user, status: 'B??? kh??a' });
                    });
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
            }
        } else {
            if (window.confirm('M??? kh??a t??i kho???n n??y?')) {
                try {
                    await runTransaction(db, async (transaction) => {
                        const sfDoc = await transaction.get(doc(db, "users", e.target.id));
                        if (!sfDoc.exists()) {
                            // eslint-disable-next-line
                            throw "Document does not exist!";
                        }
                        transaction.update(doc(db, "users", user.id), { ...user, status: 'B??nh th?????ng' });
                    });
                    console.log('???? m??? kh??a');
                } catch (err) {
                    console.log("Transaction failed: ", err);
                }
            }
        }
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
                        T???:
                        <div style={{ display: 'flex' }}>
                            {/* Ng??y ?????u */}
                            <div className={cl('filter-props')}>Ng??y:
                                <div id='prevDays' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.prevDay || 'ng??y'}
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
                            {/* Th??ng ?????u*/}
                            <div className={cl('filter-props')}>Th??ng:
                                <div id='prevMonths' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.prevMonth || 'th??ng'}
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
                            {/* N??m ?????u */}
                            <div className={cl('filter-props')}>N??m:
                                <div id='prevYears' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.prevYear || 'n??m'}
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
                        ?????n:
                        <div style={{ display: 'flex' }}>
                            {/* Ng??y cu???i */}
                            <div className={cl('filter-props')}>Ng??y:
                                <div id='lastDays' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.lastDay || 'ng??y'}
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
                            {/* Th??ng cu???i */}
                            <div className={cl('filter-props')}>Th??ng:
                                <div id='lastMonths' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.lastMonth || 'th??ng'}
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
                            {/* N??m cu???i */}
                            <div className={cl('filter-props')}>N??m:
                                <div id='lastYears' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                                    <div className={cl('input-container')}>
                                        <input className={cl('input-cbb')}
                                            spellCheck={false}
                                            value={props.lastYear || 'n??m'}
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
                                ??p d???ng
                            </button>
                            <button
                                className={cl('btn-apply')}
                                onClick={handleReset}
                            >
                                ?????t l???i
                            </button>
                        </div>
                    </div>
                </div>
            }
            <div className={cl('content')}>
                <div className={cl('header-content')}>Danh s??ch b??o c??o</div>
                <div className={cl('header')}>
                    <div className={cl('header-left')}>
                        <div
                            onClick={handleFilter}
                            className={cl('btn-filter')}
                        >
                            <FontAwesomeIcon icon={faCalendarCheck} className={cl('icon-filter')} />
                            <div className={cl('label-filter')}>L???c th???i gian</div>
                        </div>
                    </div>
                    <div className={cl('header-right')}></div>
                </div>
                <div className={cl('wrap-table')}>
                    <table className={cl('d-table')}>
                        <thead>
                            <tr>
                                <th>ID ng?????i b??o</th>
                                <th>ID tin ????ng</th>
                                <th>Ng?????i ????ng tin</th>
                                <th style={{ width: '25%' }}>L?? do</th>
                                <th style={{ width: '110px' }}>Ng??y b??o c??o</th>
                                <th style={{ width: '125px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTableReports.map((report, index) =>
                                <tr key={index}>
                                    <Tippy
                                        content={report.reporterId}
                                    >
                                        <td>{report.reporterId}</td>
                                    </Tippy>
                                    <Tippy
                                        content={report.postId}
                                    >
                                        <td>{report.postId}</td>
                                    </Tippy>
                                    <Tippy
                                        content={report.userName}
                                    >
                                        <td>
                                            {report.userName}
                                        </td>
                                    </Tippy>
                                    {(report.reason !== '' && report.otherReason !== '') ?
                                        <td>{[report.reason, report.otherReason].join(', ')}</td>
                                        : (report.reason !== '') ?
                                            <Tippy
                                                content={report.reason}
                                            >
                                                <td>{report.reason}</td>
                                            </Tippy>
                                            : <td>{report.otherReason}</td>
                                    }
                                    <td>{report.date}</td>
                                    <td className={cl('td-btn')}>
                                        <Tippy
                                            content='Xem'
                                        >
                                            <button
                                                id={report.postId}
                                                className={cl('btn-icon', 'btn-view')}
                                                onClick={(e) => handleView(e)}
                                            ></button>
                                        </Tippy>
                                        <Tippy
                                            content='Kh??a/M??? kh??a ng?????i ????ng tin'
                                        >
                                            <button
                                                id={report.userId}
                                                value={report.userStatus}
                                                className={cl('btn-icon', 'btn-disable')}
                                                onClick={(e) => handleDisable(e)}
                                            ></button>
                                        </Tippy>
                                        <Tippy
                                            content='X??a'
                                        >
                                            <button
                                                id={report.id}
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
                    <div className={cl('page-info')}>
                        Hi???n th??? {currentPage * PageSize - PageSize + 1}
                        -
                        {currentPage * PageSize < reports.length ?
                            currentPage * PageSize
                            : reports.length}/{reports.length} b??o c??o
                    </div>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={reports.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                    <div className={cl('page-info')}>
                        {PageSize} b??o c??o/trang
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ReportManager;
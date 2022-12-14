import Slick from 'react-slick';
import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";

import { db } from '../../firebase';
import style from './InfoItem.module.scss';
import image from '../../assets/image/no-image.png';
import settings from '../../components/slider/Slick';
import { AuthContext } from "../../context/AuthContext";
import { PostContext } from "../../context/PostContext";
import icon from '../../assets/image/default-avatar.jpg';
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function InfoItem() {
    const navigate = useNavigate()
    const cl = classNames.bind(style)
    const { currentUser } = useContext(AuthContext)
    const { currentPost } = useContext(PostContext)
    const [post, setPost] = useState({})
    const [user, setUser] = useState({})
    const [zoom, setZoom] = useState({ show: false, src: '' })
    const [showReport, setShowReport] = useState(false)
    const [report, setReport] = useState({
        reason: '',
        otherReason: ''
    })
    const [warn, setWarn] = useState(false)
    const [active, setActive] = useState('')

    const today = new Date()
    const currentDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "posts", currentPost.id),
            (doc) => {
                setPost({ id: doc.id, ...doc.data() })
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
    }, [currentPost])

    useEffect(() => {
        if (post.userId) {
            const unsub = onSnapshot(doc(db, "users", post.userId),
                (doc) => {
                    setUser({ id: doc.id, ...doc.data() })
                }, (error) => {
                    console.log(error);
                }
            );
            return () => {
                unsub();
            }
        }
    }, [post])

    const handleShowReport = () => {
        if (currentUser !== null) {
            if (currentUser.uid === post.userId)
                alert('B???n kh??ng th??? t??? b??o c??o b??i ????ng c???a m??nh!')
            else {
                setActive('')
                setReport({
                    reason: '',
                    otherReason: ''
                })
                setShowReport(true)
            }
        } else if (window.confirm('H??y ????ng nh???p ????? b??o c??o tin ????ng n??y.')) {
            navigate('/sign-in')
        }
    }

    const chooseReason = (e) => {
        setReport({
            ...report,
            reporterId: currentUser.uid,
            postId: post.id,
            userId: post.userId,
            reason: e.target.id,
            date: currentDate
        })
        setActive(e.target.id)
    }

    const handleReport = async () => {
        if (report.reason === '' && report.otherReason === '')
            setWarn(true)
        else if (window.confirm('G???i b??o c??o tin ????ng n??y?')) {
            try {
                const res = await addDoc(collection(db, "reports"), {
                    ...report
                });
                console.log(res.id);
                alert('???? b??o c??o')
                window.location.reload(false);
            }
            catch (err) {
                console.log(err)
            }
            setShowReport(false)
            setWarn(false)
        }
    }

    const handleInput = (e) => {
        const value = e.target.value
        setReport({
            ...report,
            reporterId: currentUser.uid,
            postId: post.id,
            userId: post.userId,
            otherReason: value,
            date: currentDate
        })
    }

    const handleZoom = (e) => {
        if (post.image.length !== 0)
            setZoom({ show: !zoom.show, src: e.target.src || '' })
    }

    return (
        <div className={cl('item-container')}>
            {showReport &&
                <div className={cl('wrap-report')}>
                    <div className={cl('box-report')}>
                        <div className={cl('header-report')}>
                            <div className={cl('title-report')}>B??o c??o</div>
                            <div
                                className={cl('btn-close')}
                                onClick={() => setShowReport(false)}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>
                        <div style={{ padding: '10px 10px 0 10px' }}>
                            <div style={{ padding: '0 0 10px 0' }}>H??y ch???n v???n ?????:</div>
                            <div
                                id="N???i dung sai s??? th???t"
                                style={{ backgroundColor: (active === 'N???i dung sai s??? th???t') ? '#2eb71f' : '#fff' }}
                                className={cl('reason-item')}
                                onClick={e => chooseReason(e)}
                            >
                                N???i dung sai s??? th???t
                            </div>
                            <div
                                id="Ng?????i ????ng c?? d???u hi???u l???a ?????o"
                                style={{ backgroundColor: (active === 'Ng?????i ????ng c?? d???u hi???u l???a ?????o') ? '#2eb71f' : '#fff' }}
                                className={cl('reason-item')}
                                onClick={e => chooseReason(e)}
                            >
                                Ng?????i ????ng c?? d???u hi???u l???a ?????o
                            </div>
                            <textarea
                                id='reason'
                                value={report.otherReason || ''}
                                className={cl('input-reason')}
                                onChange={(e) => handleInput(e)}
                                placeholder='L?? do kh??c...'
                                spellCheck='false'
                            />
                            {warn &&
                                <div className={cl('warn')}>Ch??a ch???n l?? do b??o c??o!</div>
                            }
                        </div>
                        <div className={cl('wrap-btn-report')}>
                            <button
                                className={cl('btn-report')}
                                onClick={handleReport}
                            >
                                G???i
                            </button>
                        </div>
                    </div>
                </div>
            }
            {zoom.show && post.image.length !== 0 &&
                <div className={cl('zoom')} onClick={handleZoom}>
                    <img
                        className={cl('image')}
                        src={zoom.src}
                        alt="postItem"
                        onClick={handleZoom}
                    />
                </div>
            }
            <div className={cl('title')}>
                {post.title}
            </div>
            <div className={cl('date')}>Ng??y ????ng: {post.date}</div>
            <div className={cl('report')}>
                <div
                    className={cl('label-report')}
                    onClick={handleShowReport}
                >
                    B??o c??o tin ????ng
                </div>
            </div>
            <div className={cl('wrap-image')}>
                {(post.image && post.image.length !== 0) ?
                    <Slick {...settings}>
                        {post.image.map((item, index) =>
                            <div key={index} className={cl('image-item')}>
                                <img
                                    className={cl('image')}
                                    src={item}
                                    alt="postItem"
                                    onClick={e => handleZoom(e)}
                                />
                            </div>)
                        }
                    </Slick>
                    : <div className={cl('image-item')}>
                        <img
                            className={cl('image')}
                            src={image}
                            alt="postItem"
                            onClick={e => handleZoom(e)}
                        />
                    </div>
                }
            </div>
            <div className={cl('wrap-content')}>
                <div className={cl('information')}>
                    <h1>Chi ti???t</h1>
                    <div style={{ display: "flex" }}>
                        <div className={cl('half')}>
                            <div>
                                <label>Lo???i:</label>
                                <label>{post.type}</label>
                            </div>
                            <div>
                                <label>?????a ch???:</label>
                                <label>{post.address + ', ' + post.ward + ', ' + post.distric + ', ' + post.city}</label>
                            </div>
                        </div>
                        <div className={cl('half')}>
                            <div>
                                <label>Di???n T??ch:</label>
                                <label>{post.sqm} m??t vu??ng</label>
                            </div>
                            <div>
                                <label>Gi??:</label>
                                <label>{post.price && post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cl('description')}>
                    <h1>M?? t???</h1>
                    <label className={cl('description-content')}>
                        {post.description}
                    </label>
                </div>
                <div className={cl('author')}>
                    <h1>Li??n h???</h1>
                    <div className={cl('btn-user')}>
                        <div className={cl('icon-avatar')}><img className={cl('avatar')} src={user.avatar || icon} alt='avatar' /></div>
                        <div className={cl('username')}>
                            {user.name}
                        </div>
                    </div>
                    <div className={cl('wrap-author')}>
                        <div className={cl('email')}>Email:
                            <div>{user.email}</div>
                        </div>
                        <div className={cl('phone')}>S??? ??i???n tho???i:
                            <div>{user.phone}</div>
                        </div>
                    </div>
                    <div className={cl('wrap-btn')}>
                        {user.zalo &&
                            <div
                                className={cl('btn')}
                                onClick={() => window.location = `https://zalo.me/${user.zalo}`}
                            >
                                <div className={cl('icon-zalo')}></div>
                                <div className={cl('label-zalo')}>
                                    Zalo
                                </div>
                            </div>
                        }
                        {user.facebook &&
                            <div
                                className={cl('btn')}
                                onClick={() => window.location = user.facebook}
                            >
                                <FontAwesomeIcon icon={faSquareFacebook} size="2x" color="#3B5998" />
                                <div className={cl('label-facebook')}>
                                    Facebook
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoItem;
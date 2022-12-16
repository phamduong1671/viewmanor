import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import classNames from "classnames/bind";
import Slick from 'react-slick';

import settings from '../../components/slider/Slick';
import { db } from '../../firebase';
import style from './InfoItem.module.scss';
import { PostContext } from "../../context/PostContext";
import icon from '../../assets/image/default-avatar.jpg';
import image from '../../assets/image/no-image.png';

function InfoItem() {
    const cl = classNames.bind(style)
    const { currentPost } = useContext(PostContext)
    const [post, setPost] = useState({})
    const [user, setUser] = useState({})
    const [zoom, setZoom] = useState({ show: false, src: '' })

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

    const handleZoom = (e) => {
        setZoom({ show: !zoom.show, src: e.target.src || '' })
    }

    return (
        <div className={cl('item-container')}>
            {zoom.show &&
                <div className={cl('zoom')} onClick={handleZoom}>
                    <img
                        className={cl('image')}
                        src={zoom.src}
                        alt="postItem"
                        onClick={e => handleZoom(e)}
                    />
                </div>
            }
            <div className={cl('title')}>
                {post.title}
            </div>
            <div className={cl('wrap-image')}>
                <Slick {...settings}>
                    {(post.image && post.image.length !== 0) ?
                        post.image.map((item, index) =>
                            <div key={index} className={cl('image-item')}>
                                <img
                                    className={cl('image')}
                                    src={item}
                                    alt="postItem"
                                    onClick={e => handleZoom(e)}
                                />
                            </div>)
                        : <div className={cl('image-item')}>
                            <img
                                className={cl('image')}
                                src={image}
                                alt="postItem"
                                onClick={e => handleZoom(e)}
                            />
                        </div>
                    }
                </Slick>
            </div>
            <div className={cl('wrap-content')}>
                <div className={cl('information')}>
                    <h1>Chi tiết</h1>
                    <div style={{ display: "flex" }}>
                        <div className={cl('half')}>
                            <div>
                                <label>Loại:</label>
                                <label>{post.type}</label>
                            </div>
                            <div>
                                <label>Địa chỉ:</label>
                                <label>{post.address + ', ' + post.ward + ', ' + post.distric + ', ' + post.city}</label>
                            </div>
                        </div>
                        <div className={cl('half')}>
                            <div>
                                <label>Diện Tích:</label>
                                <label>{post.sqm} mét vuông</label>
                            </div>
                            <div>
                                <label>Giá:</label>
                                <label>{post.price && post.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cl('description')}>
                    <h1>Mô tả</h1>
                    <label>
                        {post.description}
                    </label>
                </div>
                <div className={cl('author')}>
                    <h1>Liên hệ</h1>
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
                        <div className={cl('phone')}>Số điện thoại:
                            <div>{user.phone}</div>
                        </div>
                    </div>
                    <div className={cl('wrap-btn')}>
                        {user.zalo &&
                            <div className={cl('btn-zalo')} onClick={() => window.location = `https://zalo.me/${user.zalo}`}>
                                <div className={cl('icon-zalo')}></div>
                                <div className={cl('label-zalo')}>
                                    Zalo
                                </div>
                            </div>
                        }
                        {user.facebook &&
                            <div className={cl('btn-facebook')} onClick={() => window.location = user.facebook}>
                                <div className={cl('icon-facebook')}></div>
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
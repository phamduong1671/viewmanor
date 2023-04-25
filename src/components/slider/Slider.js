import Slick from 'react-slick';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { faHouse, faRulerCombined } from '@fortawesome/free-solid-svg-icons';

import settings from './Slick';
import { db } from '../../firebase'
import style from './Slider.module.scss'
import { PostContext } from '../../context/PostContext';
import image from '../../assets/image/no-image.png';

function Slider({ name }) {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const [lockedUsers, setLockedUsers] = useState([])
    const [posts, setPosts] = useState([])
    const { postDispatch } = useContext(PostContext)

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
        const unsub = onSnapshot(collection(db, "posts"),
            (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                lockedUsers.forEach(lockedUser =>
                    list = list.filter(item => item.userId !== lockedUser.id)
                )
                setPosts(list.filter(item => item.category === name));
            }, (error) => {
                console.log(error);
            }
        );
        return () => {
            unsub();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lockedUsers])

    const goInfoItemPage = (e) => {
        const postId = { id: e.target.id }
        postDispatch({ type: "SHOW", payload: postId })

        navigate(`/info-item/${e.target.id}`)
    }

    return (
        <div className={cl('slider-container')}>
            <div className={cl('post-list')}>
                <Slick {...settings}>
                    {posts.slice(0, 30).map((post, index) =>
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
                </Slick>
            </div>
        </div>
    );
}

export default Slider;
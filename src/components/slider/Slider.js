import classNames from 'classnames/bind';
import Slick from 'react-slick';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect, useContext } from 'react';
import { faHouse, faRulerCombined } from '@fortawesome/free-solid-svg-icons'
import { faMap, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";

import style from './Slider.module.scss'
import settings from './Slick';
import { db } from '../../firebase'
import image from '../../assets/image/background-sign-up.png'
import { PostContext } from '../../context/PostContext';

function Slider({ name }) {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const { dispatch } = useContext(PostContext)

    useEffect(() => {
        const fetchPosts = async () => {
            let list = []
            try {
                const querySnapshot = await getDocs(collection(db, "posts"));
                querySnapshot.forEach(doc => {
                    list.push({ id: doc.id, ...doc.data() })
                });
                setPosts(list)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts();
    }, [])

    const goSearchPage = () => {
        navigate('/search')
    };

    const goInfoItemPage = (e) => {
        const postId = {id: e.target.id}
        dispatch({ type: "SHOW", payload: postId })

        navigate('./info-item')
    }

    return (
        <div className={cl('slider-container')}>
            <div className={cl('name-slider')}>
                Tin{' ' + name}
                <div className={cl('see-more')} onClick={goSearchPage}>
                    xem thêm
                    <FontAwesomeIcon style={{ fontSize: '12px' }} icon={faAnglesRight} />
                </div>
            </div>
            <div className={cl('post-list')}>
                <Slick {...settings}>
                    {posts.filter(item => item.category === name).map(post =>
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
                </Slick>
            </div>
        </div>
    );
}

export default Slider;
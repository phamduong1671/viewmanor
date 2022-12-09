import classNames from 'classnames/bind';
import Slick from 'react-slick';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { faHouse, faRulerCombined } from '@fortawesome/free-solid-svg-icons'
import { faMap, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";

import style from './Slider.module.scss'
import settings from './Slick';
import { db } from '../../firebase'
import image from '../../assets/image/background-sign-up.png'

function Slider({ name }) {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])

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

    const goInfoItemPage = () => {
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
                        <div key={post.id} className={cl('slick-item')} onClick={goInfoItemPage} >
                            <div className={cl('wrap-image')}>
                                <img
                                    className={cl('image')}
                                    src={image}
                                    alt="postItem"
                                />
                            </div>
                            <div className={cl('wrap-info')}>
                                <div className={cl('title')}>
                                    {post.title}
                                </div>
                                <div className={cl('info')}>
                                    <div>
                                        <FontAwesomeIcon icon={faHouse} color='#32a428' />
                                        <label>{post.type}</label>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faRulerCombined} color='#32a428' />
                                        <label>{post.sqm + ' m²'}</label>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faMoneyBill1} color='#32a428' />
                                        <label>{post.price + ' VND'}</label>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faMap} color='#32a428' />
                                        <label>{post.ward + ', ' + post.distric + ', ' + post.city}</label>
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
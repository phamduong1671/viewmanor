import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { faHouse, faRulerCombined } from '@fortawesome/free-solid-svg-icons'
import { faMap, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import { collection, getDocs } from "firebase/firestore";

import style from './SlickItem.module.scss'
import icon from '../../assets/image/default-avatar.jpg'
import image from '../../assets/image/background-sign-up.png'
import { db } from '../../firebase'

function SlickItem({ value }) {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            let list = []
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach(doc => {
                    if (doc.id === value.userId) {
                        list.push({ id: doc.id, ...doc.data() })
                    }
                });
                setUsers(list)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUsers();
    }, [value])

    const goInfoItemPage = () => {
        navigate('./info-item')
    }

    return (
        <div className={cl('slick-item')} onClick={goInfoItemPage} >
            <div className={cl('wrap-image')}>
                <img
                    className={cl('image')}
                    src={image}
                    alt="postItem"
                />
            </div>
            <div className={cl('wrap-info')}>
                <div className={cl('title')}>
                    {value.title}
                </div>
                <div className={cl('info')}>
                    <div className={cl('half')}>
                        <div>
                            <FontAwesomeIcon icon={faHouse} color='#32a428' />
                            <label>{value.type}</label>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMap} color='#32a428' />
                            <label>{value.distric + ', ' + value.city}</label>
                        </div>
                    </div>
                    <div className={cl('half')}>
                        <div>
                            <FontAwesomeIcon icon={faRulerCombined} color='#32a428' />
                            <label>{value.sqm + ' m²'}</label>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMoneyBill1} color='#32a428' />
                            <label>{value.price + ' VND'}</label>
                        </div>
                    </div>
                </div>
                <div className={cl('author')}>
                    <div className={cl('btn-user')}>
                        <div className={cl('icon-avatar')}>
                            <img
                                className={cl('avatar')}
                                src={icon} alt='avatar'
                            />
                        </div>
                        <div className={cl('username')}>
                            name
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlickItem;
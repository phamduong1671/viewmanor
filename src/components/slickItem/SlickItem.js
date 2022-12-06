import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from './SlickItem.module.scss'
import icon from '../../assets/image/default-avatar.jpg'
import image from '../../assets/image/background-sign-up.png'
import { faHouse, faRulerCombined } from '@fortawesome/free-solid-svg-icons'
import { faMap, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";

function SlickItem() {
    const cl = classNames.bind(style)
    const navigate = useNavigate()

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
                    Cần bán căn hộ Vinhomes Grand Park - phân khu Rainbow toà S3.05
                </div>
                <div className={cl('info')}>
                    <div className={cl('half')}>
                        <div>
                            <FontAwesomeIcon icon={faHouse} color='#32a428' />
                            <label>Căn hộ</label>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMap} color='#32a428' />
                            <label>Đống Đa, Hà Nội</label>
                        </div>
                    </div>
                    <div className={cl('half')}>
                        <div>
                            <FontAwesomeIcon icon={faRulerCombined} color='#32a428' />
                            <label>50 mét vuông</label>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faMoneyBill1} color='#32a428' />
                            <label>1.900.000.000 VND</label>
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
                            Phạm Ánh Dương
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SlickItem;
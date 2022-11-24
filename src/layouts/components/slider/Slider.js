import classNames from 'classnames/bind';
import Slick from 'react-slick';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';

import style from './Slider.module.scss'
import PostItem from '../postItem';
import settings from './Slick';

function Slider({ name }) {
    const cl = classNames.bind(style)

    const navigate = useNavigate()
    const goSearchPage = () => {
        navigate('/search')
    };

    return (
        <div className={cl('slider-container')}>
            <div className={cl('name-slider')}>
                {name}
                <div className={cl('see-more')} onClick={goSearchPage}>
                    xem thêm
                    <FontAwesomeIcon style={{fontSize: '12px'}} icon={faAnglesRight} />
                </div>
            </div>
            <div className={cl('post-list')}>
                <Slick {...settings}>
                    <PostItem />
                    <PostItem />
                    <PostItem />
                    <PostItem />
                    <PostItem />
                    <PostItem />
                    <PostItem />
                    <PostItem />
                    <PostItem />
                </Slick>
            </div>
        </div>
    );
}

export default Slider;
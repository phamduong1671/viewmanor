import { Fragment, useContext } from "react";
import classNames from "classnames/bind";
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';

import SearchBox from "../../layouts/components/searchBox";
import Slider from "../../components/slider/Slider";
import style from './Home.module.scss'
import { PropsContext } from '../../context/PropsContext';

function Home() {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const { dispatch } = useContext(PropsContext)

    const goSearchPage = (e) => {
        dispatch({ type: "SEARCH", payload: {category: e.target.id} })

        navigate('/search')
    };

    return (
        <Fragment>
            <SearchBox />
            <div className={cl('name-slider')}>
                Tin Bán
                <div id="Bán" className={cl('see-more')} onClick={e=>goSearchPage(e)}>
                    xem thêm { }
                    <FontAwesomeIcon style={{ fontSize: '12px' }} icon={faAnglesRight} />
                </div>
            </div>
            <Slider name='Bán' />
            <div className={cl('name-slider')}>
                Tin Cho thuê
                <div id="Cho thuê" className={cl('see-more')} onClick={e=>goSearchPage(e)}>
                    xem thêm { }
                    <FontAwesomeIcon style={{ fontSize: '12px' }} icon={faAnglesRight} />
                </div>
            </div>
            <Slider name='Cho thuê' />
        </Fragment>
    );
}

export default Home;
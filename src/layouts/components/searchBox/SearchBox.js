import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// import OutsideAlerter from '../../../components/OutsideAlerter.js'
import style from './SearchBox.module.scss';
import buttonHeader from '../header/Header.module.scss';
import { types, dvhc, sqms } from '../../../tree.js'


function SearchBox() {
    const cl = classNames.bind(style)
    const cx = classNames.bind(buttonHeader)
    const [category, setCategory] = useState('')
    const [show, setShow] = useState('')
    const [type, setType] = useState({})
    const [city, setCity] = useState({})
    const [huyen, setHuyen] = useState({})
    const [sqm, setSqm] = useState({})

    const handleCategory = (e) => {
        setCategory(e.target.id)
        
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
        switch (e.target.id.length) {
            case 1:
                const selected1 = types.filter(item => item.id === e.target.id)
                setType(selected1[0])
                break;
            case 2:
                const selected2 = dvhc.filter(item => item.level1_id === e.target.id)
                setCity(selected2[0])
                break;
            case 3:
                const selected3 = city.level2s.filter(item => item.level2_id === e.target.id)
                setHuyen(selected3[0])
                break;
            case 4:
                const selected4 = sqms.filter(item => item.id === e.target.id)
                setSqm(selected4[0])
                break;
            default:
                break;
        }
    }

    return (
        <div className={cl('banner')}>
            <div className={cl('search-box')}>
                <div className={cl('buy-rent')}>
                    <div
                        id="btn-buy"
                        className={category === 'btn-buy' ? cl('buy', 'is-active') : cl('buy')}
                        onClick={e => handleCategory(e)}
                    >
                        MUA
                    </div>
                    <div
                        id="btn-rent"
                        className={category === 'btn-rent' ? cl('buy', 'is-active') : cl('buy')}
                        onClick={e => handleCategory(e)}
                    >
                        THUÊ
                    </div>
                </div>
                <div className={cl('search-props')}>
                    <div className={cl('center')}>
                        {/* Loại */}
                        {/* <OutsideAlerter> */}
                        <div id='type' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                            <div className={cl('input-container')}>
                                <input className={cl('input-cbb')}
                                    spellCheck={false}
                                    value={type.name || 'Loại'}
                                    readOnly
                                />
                                <div className={cl('icon-dropdown')}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            </div>
                            {show === 'type' &&
                                <div className={cl('cbb-value')}>
                                    {types.map(item => (
                                        <div
                                            key={item.name}
                                            id={item.id}
                                            className={cl('cbb-item')}
                                            onClick={(e) => selectItem(e)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                        {/* </OutsideAlerter> */}
                        {/* Tỉnh Thành */}
                        <div id='city' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                            <div className={cl('input-container')}>
                                <input className={cl('input-cbb')}
                                    spellCheck={false}
                                    value={city.name || 'Tỉnh / Thành Phố'}
                                    readOnly
                                />
                                <div className={cl('icon-dropdown')}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            </div>
                            {show === 'city' &&
                                <div className={cl('cbb-value')}>
                                    {dvhc.map(item => (
                                        <div
                                            key={item.level1_id}
                                            id={item.level1_id}
                                            className={cl('cbb-item')}
                                            onClick={(e) => selectItem(e)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                    <div className={cl('center')}>
                        {/* Quận Huyện */}
                        <div id='huyen' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                            <div className={cl('input-container')}>
                                <input className={cl('input-cbb')}
                                    spellCheck={false}
                                    value={huyen.name || 'Quận / Huyện'}
                                    readOnly
                                />
                                <div className={cl('icon-dropdown')}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            </div>
                            {show === 'huyen' &&
                                <div className={cl('cbb-value')}>
                                    {city.name ?
                                        city.level2s.map(item => (
                                            <div
                                                key={item.level2_id}
                                                id={item.level2_id || ''}
                                                className={cl('cbb-item')}
                                                onClick={(e) => selectItem(e)}
                                            >
                                                {item.name}
                                            </div>
                                        ))
                                        : <div className={cl('cbb-item')}>Chưa chọn Tỉnh / Thành Phố</div>
                                    }
                                </div>
                            }
                        </div>

                        {/* Diện tích */}
                        <div id='sqm' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                            <div className={cl('input-container')}>
                                <input className={cl('input-cbb')}
                                    spellCheck={false}
                                    value={sqm.name || 'Diện tích'}
                                    readOnly
                                />
                                <div className={cl('icon-dropdown')}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            </div>
                            {show === 'sqm' &&
                                <div className={cl('cbb-value')}>
                                    {sqms.map(item => (
                                        <div
                                            key={item.name}
                                            id={item.id}
                                            className={cl('cbb-item')}
                                            onClick={(e) => selectItem(e)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={cl('btn-search-container')}>
                    <Link className={`${cx('btn-header')} ${cl('btn-search')}`} to='/search'>
                        <FontAwesomeIcon fontSize={'20px'} icon={faMagnifyingGlass} />
                        Tìm kiếm
                    </Link>
                </div>
            </div>
        </div >
    );
}

export default SearchBox;
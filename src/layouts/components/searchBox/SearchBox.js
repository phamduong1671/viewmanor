import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import style from './SearchBox.module.scss';
import buttonHeader from '../header/Header.module.scss';
// import OutsideAlerter from '../../../components/OutsideAlerter.js'
import { data } from '../../../tree.js'


function SearchBox() {
    const cl = classNames.bind(style)
    const cx = classNames.bind(buttonHeader)
    const [show, setShow] = useState('')
    const [tinh, setTinh] = useState({})
    const [huyen, setHuyen] = useState({})
    const [dientich, setDientich] = useState({})
    const dvhc = data

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
        switch(e.target.id.length){
            case 2:
                const selected1 = dvhc.filter(item => item.level1_id === e.target.id)
                setTinh(selected1[0])
                break;
            case 3:
                const selected2 = tinh.level2s.filter(item => item.level2_id === e.target.id)
                setHuyen(selected2[0])
                console.log(selected2[0]);
                break;
            default:
                break;
        }
    }

    return (
        <div className={cl('banner')}>
            <div className={cl('search-box')}>
                <div className={cl('buy-rent')}>
                    <div id="btn-buy" className={cl('buy', {})}>MUA</div>
                    <div id="btn-rent" className={cl('rent')}>THUÊ</div>
                </div>
                <div className={cl('search-props')}>
                    <div className={cl('center')}>
                        {/* Loại */}
                        {/* <OutsideAlerter> */}
                        <div id='loai' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                            <div className={cl('input-container')}>
                                <input className={cl('input-cbb')}
                                    spellCheck={false}
                                    // value={value}
                                    readOnly
                                />
                                <div className={cl('icon-dropdown')}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            </div>
                            {show === 'loai' &&
                                <div className={cl('cbb-value')}>
                                    Loai
                                </div>
                            }
                        </div>
                        {/* </OutsideAlerter> */}
                        {/* Tỉnh Thành */}
                        <div id='tinh' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                            <div className={cl('input-container')}>
                                <input className={cl('input-cbb')}
                                    spellCheck={false}
                                    value={tinh.name || 'Tỉnh / Thành Phố'}
                                    readOnly
                                />
                                <div className={cl('icon-dropdown')}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            </div>
                            {show === 'tinh' &&
                                <div className={cl('cbb-value')}>
                                    {dvhc.map(item => (
                                        <div
                                            key={item.name}
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
                                    {tinh.level2s.map(item => (
                                        <div
                                            key={item.name}
                                            id={item.level2_id || ''}
                                            className={cl('cbb-item')}
                                            onClick={(e) => selectItem(e)}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>

                        {/* Diện tích */}
                        <div id='dientich' className={cl('cbb-container')} onClick={(e) => showValue(e)} >
                            <div className={cl('input-container')}>
                                <input className={cl('input-cbb')}
                                    spellCheck={false}
                                    // value={value}
                                    readOnly
                                />
                                <div className={cl('icon-dropdown')}>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                            </div>
                            {show === 'dientich' &&
                                <div className={cl('cbb-value')}>
                                    dien tich
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
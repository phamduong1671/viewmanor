import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import style from './SearchBox.module.scss';
import buttonHeader from '../header/Header.module.scss';

function SearchBox() {
    const cl = classNames.bind(style)
    const cx = classNames.bind(buttonHeader)

    return (
        <div className={cl('banner')}>
            <div className={cl('search-box')}>
                <div className={cl('buy-rent')}>
                    <div id="btn-buy" className={cl('buy', {})}>MUA</div>
                    <div id="btn-rent" className={cl('rent')}>THUÊ</div>
                </div>
                <div className={cl('search-props')}>
                    <div className={cl('input-container')}>
                        <input className={cl('input-combobox')} spellCheck={false} placeholder='Loại' readOnly />
                        <div className={cl('icon-dropdown')}><FontAwesomeIcon icon={faAngleDown} /></div>
                    </div>
                    <div className={cl('input-container')}>
                        <input className={cl('input-combobox')} spellCheck={false} placeholder='Tỉnh / Thành Phố' readOnly />
                        <div className={cl('icon-dropdown')}><FontAwesomeIcon icon={faAngleDown} /></div>
                    </div>
                    <div className={cl('input-container')}>
                        <input className={cl('input-combobox')} spellCheck={false} placeholder='Quận / Huyện' readOnly />
                        <div className={cl('icon-dropdown')}><FontAwesomeIcon icon={faAngleDown} /></div>
                    </div>
                    <div className={cl('input-container')}>
                        <input className={cl('input-combobox')} spellCheck={false} placeholder='Loại' readOnly />
                        <div className={cl('icon-dropdown')}><FontAwesomeIcon icon={faAngleDown} /></div>
                    </div>
                </div>
                <div className={cl('btn-search-container')}>
                    <Link className={`${cx('btn-header')} ${cl('btn-search')}`} to='/search'>
                        <FontAwesomeIcon fontSize={'20px'} icon={faMagnifyingGlass} />
                        Tìm kiếm
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SearchBox;
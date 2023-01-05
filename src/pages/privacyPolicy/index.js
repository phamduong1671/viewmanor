import classNames from 'classnames/bind';

import style from './PrivacyPolicy.module.scss'

function PrivacyPolicy() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('content')}>
            Privacy Policy Page
        </div>
    );
}

export default PrivacyPolicy;
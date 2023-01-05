import classNames from 'classnames/bind';

import style from './CovenantTerms.module.scss'

function CovenantTerms() {
    const cl = classNames.bind(style)

    return (
        <div className={cl('content')}>
            Covenant Terms Page
        </div>
    );
}

export default CovenantTerms;
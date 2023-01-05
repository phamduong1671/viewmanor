import classNames from "classnames/bind";

import style from './DefaultLayout.module.scss'
import Header from "../components/header";
import Footer from "../components/footer";


function DefaultLayout({ children }) {
    const cl = classNames.bind(style)

    return (
        <div>
            <Header />
            <div className={cl('content')}>
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;

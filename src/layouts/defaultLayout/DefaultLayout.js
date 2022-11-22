import classNames from "classnames/bind";
import style from './DefaultLayout.module.scss'
import Header from "../components/header";

function DefaultLayout({children}) {
    const cl = classNames.bind(style)

    return ( 
        <div>
            <Header />
            <div className={cl('container')}>
                {children}
            </div>
        </div>
     );
}

export default DefaultLayout;

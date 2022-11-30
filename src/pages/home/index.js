import { Fragment } from "react";

import SearchBox from "../../layouts/components/searchBox";
import Slider from "../../components/slider/Slider";

function Home() {

    return (
        <Fragment>
            <SearchBox />
            <Slider name='Tin Bán' />
            <Slider name='Tin Cho Thuê' />
            <div>BLOG</div>
        </Fragment>
    );
}

export default Home;
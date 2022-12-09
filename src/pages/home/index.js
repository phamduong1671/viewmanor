import { Fragment } from "react";

import SearchBox from "../../layouts/components/searchBox";
import Slider from "../../components/slider/Slider";

function Home() {

    return (
        <Fragment>
            <SearchBox />
            <Slider name='Bán' />
            <Slider name='Cho thuê' />
        </Fragment>
    );
}

export default Home;
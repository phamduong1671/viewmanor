import { Fragment } from "react";
import SearchBox from "../../layouts/components/searchBox";
import Slider from "../../layouts/components/slider/Slider";

function Home() {

    return (
        <Fragment>
            <SearchBox />
            <Slider name='Tin Bán' />
            <Slider name='Tin Cho Thuê' />
        </Fragment>
    );
}

export default Home;
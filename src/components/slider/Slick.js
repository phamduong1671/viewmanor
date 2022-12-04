import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ButtonSlick.scss'

const settings = {
  dots: true,
  infinite: false,
  speed: 800,
  slidesToShow: 3,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1
      }
    }
  ]
};

export default settings;
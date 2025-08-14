import Carousel from 'react-bootstrap/Carousel';
import '../style.scss';

const Carouseles = () => {
    return (
        <>
            <div className='container d-flex carousel-container'>
                <Carousel data-bs-theme="dark" className='container mt-4 d-lg-block d-none'>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="1.jpg"
                            alt="1"
                            height="400px"
                            style={{ borderRadius: '6px' }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="2.jpg"
                            alt="2"
                            height="400px"
                            style={{ borderRadius: '6px' }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="3.webp"
                            alt="3"
                            height="400px"
                            style={{ borderRadius: '6px' }}
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="4.webp"
                            alt="4"
                            height="400px"
                            style={{ borderRadius: '6px' }}
                        />
                    </Carousel.Item>
                </Carousel>
            </div>
        </>
    );
}

export default Carouseles;
const Footer = () => {
    return (
        <>
            <footer className="text-center text-lg-start bg-body-tertiary text-muted">
                <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                    <div className="me-5 d-none d-lg-block">
                        <span>Vui lòng liên hệ với chúng tôi nếu bạn có thắc mắc</span>
                    </div>
                    <div>
                        <a href="" className="me-4 text-reset">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="" className="me-4 text-reset">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="" className="me-4 text-reset">
                            <i className="fab fa-google"></i>
                        </a>
                        <a href="" className="me-4 text-reset">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="" className="me-4 text-reset">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="" className="me-4 text-reset">
                            <i className="fab fa-github"></i>
                        </a>
                    </div>
                </section>
                <section className="">
                    <div className="container text-center text-md-start mt-5">
                        <div className="row mt-3">
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4 fst-italic">
                                    <i className="fa-solid fa-phone me-2"></i>Shopphone
                                </h6>
                                <p>
                                    Chào mừng đến với SHOPPHONE. Nơi bạn có thể tìm bất cứ sản phẩm điện thoại thịnh hành nhất!!!
                                </p>
                            </div>
                            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">
                                    Dịch vụ
                                </h6>
                                <p>
                                    Giao hàng tận nơi
                                </p>
                                <p>
                                    Bảo hành 12 tháng
                                </p>
                                <p>
                                    Hoàn trả 100%
                                </p>
                            </div>
                            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                                <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                                <p><i className="fas fa-home me-3"></i> Phường 4, TP. Trà Vinh, tỉnh Trà Vinh</p>
                                <p><i className="fas fa-envelope me-4"></i>Shopphone@gmail.com</p>
                                <p><i className="fas fa-phone me-3"></i> + 01 234 567 88</p>
                                <p><i className="fas fa-print me-3"></i> + 01 234 567 89</p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                    ©2025 Copyright:
                    <label className="text-reset fw-bold ms-1">Nguyễn Hoàng Nhân - DA21TTA - 110121071</label>
                </div>
            </footer>
        </>
    )
}

export default Footer;
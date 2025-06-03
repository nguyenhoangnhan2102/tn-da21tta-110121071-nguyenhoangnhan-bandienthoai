import "../style/header.scss";

const Header = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <span className="header__logo-text">PhoneShop</span>
            </div>

            <div className="header__search">
                <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                <button>Tìm</button>
            </div>

            <div className="header__auth">
                <button className="login">Đăng nhập</button>
                <button className="register">Đăng ký</button>
            </div>
        </header>
    );
};

export default Header;

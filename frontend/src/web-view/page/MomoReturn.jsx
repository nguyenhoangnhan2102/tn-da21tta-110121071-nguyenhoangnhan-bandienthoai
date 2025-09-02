import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MomoReturn() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const resultCode = query.get("resultCode");

        if (resultCode === "0") {
            alert("Thanh toán MoMo thành công!");
            navigate("/");
        } else {
            alert("Thanh toán MoMo thất bại hoặc bị hủy!");
            navigate("/checkout");
        }
    }, [location, navigate]);

    return <p>Đang xử lý thanh toán MoMo...</p>;
}

export default MomoReturn;

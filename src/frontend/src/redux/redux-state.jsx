import { useSelector } from "react-redux";

export default function ReduxStateExport() {

    const userInfo = useSelector((state) => state.reduxState.userInfo);
    // const totalCart = useSelector(
    //     (state) => state.reduxState.totalCart.qualityCart
    // );
    return { userInfo };
}

const express = require("express");
const router = express.Router();
const {
    loginUserGoogle,
    verifyAdmin,
    logoutUser,
    updateUserById_Admin,
    getAllUser_Admin,
    getUser_ById,
    updateUserById_User,
    sendOtp,
    updatePasswordUser,
    checkOtp,
    registerUser,
    loginUser,
} = require("../controllers/userController");
// const { checkUserJWT } = require("../../middleware/JWTaction");

router.get("/user", getAllUser_Admin);
router.get("/user/:id", getUser_ById);
router.post("/logout", logoutUser);
router.post("/login/google", loginUserGoogle);
router.post("/verify-admin", verifyAdmin);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/user/:id", updateUserById_User);
router.put("/user/update", updateUserById_Admin);
router.post("/send-otp", sendOtp);
router.post("/check-otp", checkOtp);
router.post("/update-password", updatePasswordUser);


module.exports = router;

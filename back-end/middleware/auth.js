const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        // Verification of jwt token
        const decoded = jwt.verify(
            token,
            "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd"
        );

        // Find the user by id
        User.findById(decoded.userId)
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ success: false, message: "User not found" });
                }
                req.user = user;
                next();
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ success: false, message: "Error in auth failed" });
            });

    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = {
    authenticate,
};

// const authenticate = (req, res, next) => {
//     try {
//         const token = req.header("Authorization");
//         const user = jwt.verify(
//             token,
//             "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd"
//         );
//         User.findByPk(user.userId)
//             .then((user) => {
//                 req.user = user;
//                 next();
//             });
//     } catch (err) {
//         console.log(err);
//         return res.status(401).json({ success: false });
//     }
// };
// module.exports ={
//     authenticate
// }
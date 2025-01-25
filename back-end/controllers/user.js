const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate Access Token
let generateAccessToken = (id, email) => {
  return jwt.sign({ userId: id, email: email }, "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd");
};

// Get All Users (Leaderboard Feature)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ totalExpenses: -1 }) 
      .select("name totalExpenses"); 
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Check Premium User
const isPremiumUser = (req, res) => {
  if (req.user.isPremiumUser) {
    return res.json({ isPremiumUser: true });
  } else {
    res.json({ isPremiumUser: false });
  }
};

// Sign Up
const postUserSignUp = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    console.error("Error in POST /sign-up:", err);
    res.status(500).json({ error: "An error occurred while adding the user." });
  }
};

// Login
const postUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = generateAccessToken(user._id, user.email);
      return res.status(200).json({
        success: true,
        message: "Login Successful!",
        token,
      });
    } else {
      res.status(401).json({ error: "Wrong Password" });
    }
  } catch (err) {
    console.error("Error in POST /login:", err);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

module.exports = {
  isPremiumUser,
  generateAccessToken,
  postUserSignUp,
  postUserLogin,
  getAllUsers,
};




// let generateAccessToken = (id, email)=> {
//     return jwt.sign(
//         { userId: id, email: email },
//         "kjhsgdfiuiew889kbasgdfskjabsdfjlabsbdljhsd"
//     );
// };

// const getAllUsers = (req, res, next) => {

//     User.findAll({
//       attributes: [
//         [sequelize.col("name"), "name"],
//         [sequelize.col("totalExpenses"), "totalExpenses"],
//       ],
//       order: [[sequelize.col("totalExpenses"), "DESC"]],
//     }).then((users) => {
//       const result = users.map((user) => ({
//         name: user.getDataValue("name"),
//         totalExpenses: user.getDataValue("totalExpenses"),
//       }));
//       res.send(JSON.stringify(result));
//     });
//   };


// const isPremiumUser = async (req, res, next) => {
//   try {
//     if (req.user.isPremiumUser) {
//       return res.json({ isPremiumUser: true });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// const postUserSignUp = async (req, res) => {
//     const { name, email, phone, password } = req.body;
//     console.log(name, 'name', email, 'email', phone, 'phone', password);
//     const t = await sequelize.transaction();
//     try {
//         const existingUser = await User.findOne({ where: { email } });

//         if (existingUser) {

//             return res.status(400).json({ error: 'User already exists' });

//         }
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = await User.create({
//             name,
//             email,
//             phone,
//             password: hashedPassword,
//         },{transaction:t});

//         await t.commit();
//         res.status(201).json({ message: 'User added successfully', user: newUser });
//     }
//     catch (err) {
//         await t.rollback();
//         console.error("Error in POST /add-user:", err);
//         res.status(500).json({ error: 'An error occurred while adding the user.' });
//     }
// };



// const postUserLogin = async(req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;

//    await User.findOne({ where: { email: email } })
//         .then((user) => {
//             if (user) {

//                 bcrypt.compare(password, user.password, async (err, result) => {

//                     if (err) {
//                         return res.status(500).json({ error: 'something went  wrong' });
//                     }

//                     if (result == true) {
//                         return res.status(200).json({
//                             success: true,
//                             message: "Login Successful!",
//                             token: generateAccessToken(user.id, user.email),
//                         });
//                     }
//                     else {
//                         res.status(401).json({ error: 'Wrong Password' });
//                     }
//                 });

//             } else {
//                 return res.status(404).json({ error: 'User not found' });

//             }
//         });
// };





// module.exports = {
//     isPremiumUser,
//     generateAccessToken,
//     postUserSignUp,
//     postUserLogin,
//     getAllUsers,
   
//   };
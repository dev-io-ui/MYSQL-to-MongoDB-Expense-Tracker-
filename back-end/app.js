const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const cors = require('cors');

const app = express();
app.use(cors());

const userRoute = require('./routes/user');
const expenseRoute = require('./routes/expense');
const purchaseMembershipRouter = require("./routes/purchaseMember");
const leaderboardRouter = require("./routes/leaderBoard");
const resetPasswordRouter = require("./routes/resetPassword");
const reportsRouter = require('./routes/reports');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const ResetPassword = require("./models/resetPassword");


app.use(bodyParser.json({ extended: false }));

const dotenv = require("dotenv");
dotenv.config();

const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.use(userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseMembershipRouter);
app.use("/premium", leaderboardRouter);
app.use("/password", resetPasswordRouter);
app.use('/reports', reportsRouter);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

ResetPassword.belongsTo(User);
User.hasMany(ResetPassword);


sequelize.sync()
    .then((res) => {
        app.listen(4000);
        console.log('server started');
    })
    .catch((err) => {
        console.log(err);
    })



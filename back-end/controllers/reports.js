const Expense = require("../models/expense");
const moment = require("moment"); 

exports.dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;
    const expenses = await Expense.find({ date: date, userId: req.user._id });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};
exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;
    const userId = req.user._id;
    const expenses = await Expense.find({
      date: { $regex: `.*-${month}-.*` },
      userId: userId,
    });
   
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

// exports.dailyReports = async (req, res, next) => {
//   try {
//     const { date } = req.body;

//     // Ensure the date is in the correct format (e.g., 'YYYY-MM-DD')
//     const formattedDate = moment(date).startOf('day').toDate();

//     // Query to fetch expenses for the given date
//     const expenses = await Expense.find({
//       date: {
//         $gte: formattedDate,
//         $lt: moment(formattedDate).endOf('day').toDate(),
//       },
//       userId: req.user.id,
//     });

//     return res.status(200).json(expenses);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Something went wrong", error });
//   }
// };

// exports.monthlyReports = async (req, res, next) => {
//   try {
//     const { month } = req.body;

//     // Assuming the month format is "MM" (e.g., "01" for January, "02" for February)
//     const startOfMonth = moment().month(month - 1).startOf('month').toDate();
//     const endOfMonth = moment(startOfMonth).endOf('month').toDate();

//     // Query to fetch expenses for the given month
//     const expenses = await Expense.find({
//       date: {
//         $gte: startOfMonth,
//         $lte: endOfMonth,
//       },
//       userId: req.user.id,
//     });

//     return res.status(200).json(expenses);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Something went wrong", error });
//   }
// };




// const path = require("path");
// const Expense = require("../models/expense");
// const { Op } = require("sequelize");


// exports.dailyReports = async (req, res, next) => {
//   try {
//     const date = req.body.date;
//     const expenses = await Expense.findAll({
//       where: { date: date, userId: req.user.id },
//     });
//     return res.send(expenses);
//   } catch (error) {
//     console.log(error);
//   }
// };
// exports.monthlyReports = async (req, res, next) => {
//   try {
//     const month = req.body.month;
//     const expenses = await Expense.findAll({
//       where: {
//         date: {
//           [Op.like]: `%-${month}-%`,
//         },
//         userId: req.user.id,
//       },
//       raw: true,
//     });
//     return res.send(expenses);
//   } catch (error) {
//     console.log(error);
//   }
// };
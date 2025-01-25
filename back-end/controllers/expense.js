const Expense = require("../models/expense");
const User = require("../models/user");
const mongoose = require("mongoose");


exports.addExpense = async (req, res, next) => {
    const { date, category, description, amount } = req.body;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { totalExpenses: amount } },
            { session }
        );

        const expense = new Expense({
            date,
            category,
            description,
            amount,
            userId: req.user.id,
        });

        await expense.save({ session });
        await session.commitTransaction();

        res.status(200).json({ message: "Expense added successfully" });
    } catch (err) {
        session.abortTransaction();
        res.status(500).json({ error: err.message });
    }
};

exports.getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllExpensesforPagination = async (req, res, next) => {
    try {
        const pageNo = parseInt(req.params.page);
        const limit = 6;
        const offset = (pageNo - 1) * limit;

        const totalExpenses = await Expense.countDocuments({
            userId: req.user.id,
        });
        const totalPages = Math.ceil(totalExpenses / limit);

        const expenses = await Expense.find({ userId: req.user.id })
            .skip(offset)
            .limit(limit);

        res.json({ expenses, totalPages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;

    try {
        // Start a session for transaction-like behavior
        const session = await mongoose.startSession();
        session.startTransaction();

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { totalExpenses: -expense.amount } },
            { session }
        );

        await expense.remove({ session });
        await session.commitTransaction();

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
        session.abortTransaction();
        res.status(500).json({ error: err.message });
    }
};

exports.editExpense = async (req, res, next) => {
    const id = req.params.id;
    const { category, description, amount } = req.body;

    try {
        // Start a session for transaction-like behavior
        const session = await mongoose.startSession();
        session.startTransaction();

        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const oldAmount = expense.amount;

        await User.findByIdAndUpdate(
            req.user.id,
            {
                $inc: { totalExpenses: -oldAmount + amount },
            },
            { session }
        );

        expense.category = category;
        expense.description = description;
        expense.amount = amount;
        await expense.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: "Expense edited successfully" });
    } catch (err) {
        session.abortTransaction();
        res.status(500).json({ error: err.message });
    }
};




// const path = require("path");
// const Expense = require("../models/expense");
// const User = require('../models/user');
// const sequelize = require("../util/database");

// exports.addExpense = async (req, res, next) => {
//     const { date, category, description, amount } = req.body;
//     const t = await sequelize.transaction();

//     try {
//         await User.update(
//             { totalExpenses: req.user.totalExpenses + amount },
//             { where: { id: req.user.id }, transaction: t }
//         );

//         await Expense.create(
//             { date, category, description, amount, userId: req.user.id },
//             { transaction: t }
//         );

//         await t.commit();
//         res.status(200).json({ message: "Expense added successfully" });
//     } catch (err) {
//         await t.rollback();
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.getAllExpenses = async (req, res, next) => {
//     try {
//         const expenses = await Expense.findAll({ where: { userId: req.user.id } });
//         res.status(200).json(expenses);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.getAllExpensesforPagination = async (req, res, next) => {
//     try {
//       const pageNo = req.params.page;
//       const limit = 6;
//       const offset = (pageNo - 1) * limit;
//       const totalExpenses = await Expense.count({
//         where: { userId: req.user.id },
//       });
//       const totalPages = Math.ceil(totalExpenses / limit);
//       const expenses = await Expense.findAll({
//         where: { userId: req.user.id },
//         offset: offset,
//         limit: limit,
//       });
//       res.json({ expenses: expenses, totalPages: totalPages });
//     } catch (err) {
//       console.log(err);
//     }
//   };
 

// exports.deleteExpense = async (req, res, next) => {
//     const id = req.params.id;
//     const t = await sequelize.transaction();

//     try {
//         const expense = await Expense.findByPk(id, { transaction: t });

//         await User.update(
//             { totalExpenses: req.user.totalExpenses - expense.amount },
//             { where: { id: req.user.id }, transaction: t }
//         );

//         await Expense.destroy({
//             where: { id, userId: req.user.id },
//             transaction: t,
//         });

//         await t.commit();
//         res.status(200).json({ message: "Expense deleted successfully" });
//     } catch (err) {
//         await t.rollback();
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.editExpense = async (req, res, next) => {
//     const id = req.params.id;
//     const { category, description, amount } = req.body;
//     const t = await sequelize.transaction();

//     try {
//         const expense = await Expense.findByPk(id, { transaction: t });

//         await User.update(
//             { totalExpenses: req.user.totalExpenses - expense.amount + Number(amount) },
//             { where: { id: req.user.id }, transaction: t }
//         );

//         await Expense.update(
//             { category, description, amount },
//             { where: { id, userId: req.user.id }, transaction: t }
//         );

//         await t.commit();
//         res.status(200).json({ message: "Expense edited successfully" });
//     } catch (err) {
//         await t.rollback();
//         res.status(500).json({ error: err.message });
//     }
// };

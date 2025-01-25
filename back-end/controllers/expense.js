const path = require("path");
const Expense = require("../models/expense");
const User = require('../models/user');
const sequelize = require("../util/database");

exports.addExpense = async (req, res, next) => {
    const { date, category, description, amount } = req.body;
    const t = await sequelize.transaction();

    try {
        await User.update(
            { totalExpenses: req.user.totalExpenses + amount },
            { where: { id: req.user.id }, transaction: t }
        );

        await Expense.create(
            { date, category, description, amount, userId: req.user.id },
            { transaction: t }
        );

        await t.commit();
        res.status(200).json({ message: "Expense added successfully" });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

exports.getAllExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllExpensesforPagination = async (req, res, next) => {
    try {
      const pageNo = req.params.page;
      const limit = 6;
      const offset = (pageNo - 1) * limit;
      const totalExpenses = await Expense.count({
        where: { userId: req.user.id },
      });
      const totalPages = Math.ceil(totalExpenses / limit);
      const expenses = await Expense.findAll({
        where: { userId: req.user.id },
        offset: offset,
        limit: limit,
      });
      res.json({ expenses: expenses, totalPages: totalPages });
    } catch (err) {
      console.log(err);
    }
  };
 

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    const t = await sequelize.transaction();

    try {
        const expense = await Expense.findByPk(id, { transaction: t });

        await User.update(
            { totalExpenses: req.user.totalExpenses - expense.amount },
            { where: { id: req.user.id }, transaction: t }
        );

        await Expense.destroy({
            where: { id, userId: req.user.id },
            transaction: t,
        });

        await t.commit();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

exports.editExpense = async (req, res, next) => {
    const id = req.params.id;
    const { category, description, amount } = req.body;
    const t = await sequelize.transaction();

    try {
        const expense = await Expense.findByPk(id, { transaction: t });

        await User.update(
            { totalExpenses: req.user.totalExpenses - expense.amount + Number(amount) },
            { where: { id: req.user.id }, transaction: t }
        );

        await Expense.update(
            { category, description, amount },
            { where: { id, userId: req.user.id }, transaction: t }
        );

        await t.commit();
        res.status(200).json({ message: "Expense edited successfully" });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

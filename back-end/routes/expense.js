const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const userAuthentication = require("../middleware/auth");
router.use(express.static("frontend"));


// router.get('/',expenseController.getHomePage);
router.get("/getAllExpenses", userAuthentication.authenticate,expenseController.getAllExpenses);
router.get("/getAllExpenses/:page",userAuthentication.authenticate,expenseController.getAllExpensesforPagination);
router.get("/deleteExpense/:id", userAuthentication.authenticate,expenseController.deleteExpense);
router.post("/addExpense", userAuthentication.authenticate,expenseController.addExpense);
router.post("/editExpense/:id", userAuthentication.authenticate,expenseController.editExpense);




module.exports = router;
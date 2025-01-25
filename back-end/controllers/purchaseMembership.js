const Razorpay = require("razorpay");
const Order = require("../models/orders");
const userController = require("./user");

exports.purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 50000;

    console.log("Entered in Controller");

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
       console.log(err);
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
            console.log( order.id ,' order id');

          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
            console.log(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};
exports.updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    console.log(payment_id , order_id ,' payment and order id');

    const order = await Order.findOne({ where: { orderid: order_id } });

    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ isPremiumUser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token: userController.generateAccessToken(userId, undefined, true),
        });
      })
      .catch((error) => {
        console.log(error ,'error in transaction');
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Sometghing went wrong" });
  }
};

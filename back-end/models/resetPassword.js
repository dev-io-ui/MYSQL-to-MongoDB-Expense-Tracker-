const mongoose = require('mongoose');

const resetPasswordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('ResetPassword', resetPasswordSchema);





// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");
// const ResetPassword = sequelize.define("ResetPassword", {
//   id: {
//     type: Sequelize.STRING,
//     primaryKey: true,
//     allowNull: false,
//   },
//   isActive: Sequelize.BOOLEAN,
// });
// module.exports = ResetPassword;
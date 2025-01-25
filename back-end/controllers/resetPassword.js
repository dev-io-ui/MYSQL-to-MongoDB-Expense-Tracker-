const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/resetPassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        console.log(email , 'got this email');
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
           Forgotpassword.create({ id , active: true })
                .catch(err => {
                    throw new Error(err)
                })

            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'devpuranik8990@gmail.com', // Change to your verified sender
                subject: 'Sending with DeV is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}






// const path = require("path");
// const User = require("../models/user");
// const ResetPassword = require("../models/resetPassword");
// const bcrypt = require("bcrypt");
// const Sib = require("sib-api-v3-sdk");
// const { v4: uuidv4 } = require("uuid");
// const saltRounds = 10;

// const hashPassword = async (password) => {
//   return await bcrypt.hash(password, saltRounds);
// };
// exports.forgotPasswordPage = async (req, res, next) => {
//   try {
//     res
//       .status(200)
//       .sendFile(
//         path.join(__dirname,"..","..","frontend", "views", "forgotPassword.html")
//       );
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.sendMail = async (req, res, next) => {
//   try {
//     const email = req.body.email;


//     const requestId = uuidv4();
//     const recepientEmail = await User.findOne({ where: { email: email } });

    
//     if (!recepientEmail) {
//       return res
//         .status(404)
//         .json({ message: "Please provide the registered email!" });
//     }
//     const resetRequest = await ResetPassword.create({
//       id: requestId,
//       isActive: true,
//       userId: recepientEmail.dataValues.id,
//     });
//     const client = Sib.ApiClient.instance;
//     const apiKey = client.authentications["api-key"];
//     apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;
//     console.log(process.env.RESET_PASSWORD_API_KEY); 
//     const transEmailApi = new Sib.TransactionalEmailsApi();
//     const sender = {
//       email: "dev8990@gmail.com",
//       name: "Dev",
//     };
//     const receivers = [
//       {
//         email: email,
//       },
//     ];
//     const emailResponse = await transEmailApi.sendTransacEmail({
//       sender,
//       To: receivers,
//       subject: "Expense Tracker Reset Password",
//       textContent: "Link Below",
//       htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
//       <a href="http://localhost:4000/password/resetPasswordPage/{{params.requestId}}"> Click Here</a>`,
//       params: {
//         requestId: requestId,
//       },
//     });
//     console.log(emailResponse);
//     return res.status(200).json({
//       message:
//         "Link for reset the password is successfully send on your Mail Id!",
//     });
//   } catch (error) {
//     console.log("error");
//     return res.status(409).json({ message: "failed changing password" });
//   }
// };
// exports.resetPasswordPage = async (req, res, next) => {
//   try {
//     res
//       .status(200)
//       .sendFile(
//         path.join(__dirname,"..","..","frontend", "views", "forgotPassword.html")
//       );
//   } catch (error) {
//     console.log(error);
//   }
// };
// exports.updatePassword = async (req, res, next) => {
//   try {
//     const requestId = req.headers.referer.split("/");
//     const password = req.body.password;
//     const checkResetRequest = await ResetPassword.findAll({
//       where: { id: requestId[requestId.length - 1], isActive: true },
//     });
    
//     if (checkResetRequest[0]) {
//       const userId = checkResetRequest[0].dataValues.userId;
//       const result = await ResetPassword.update(
//         { isActive: false },
//         { where: { id: requestId } }
//       );
//       const newPassword = await hashPassword(password);
//       const user = await User.update(
//         { password: newPassword },
//         { where: { id: userId } }
//       );
//       return res
//         .status(200)
//         .json({ message: "Successfully changed password!" });
//     } else {
//       return res
//         .status(409)
//         .json({ message: "Link is already Used Once, Request for new Link!" });
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(409).json({ message: "Failed to change password!" });
//   }
// };
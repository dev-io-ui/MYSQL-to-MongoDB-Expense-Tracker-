

function handleLogin(e) {
    e.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const LoginObj = {
        email,
        password
    };

    axios.post('http://localhost:4000/user/login', LoginObj)
        .then((result) => {

            localStorage.setItem("token", result.data.token);
            alert('Login successfully!');
            window.location.href = './homePage.html';
        })
        .catch((err) => {
            console.error('Error logging user:', err);
            alert('Error logging user. Please try again.',req.message);
            
        });

}

// async function  ForgotPassword(e)
// {
//     try {
//         e.preventDefault();
//         const email = document.getElementById("email").value;
//         const res = await axios.post("http://localhost:4000/password/sendMail", {
//           email: email,
//         });
//         alert(res.data.message);
//         window.location.href = "../views/login.html";
//       } catch (error) {
//         console.log(error);
//         alert(error.response.data.message);
//         window.location.reload();
//       }
// }


// document.getElementById('handleForgotPassword').addEventListener("click",ForgotPassword);
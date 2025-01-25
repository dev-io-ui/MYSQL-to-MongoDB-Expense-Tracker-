const resetPasswordLinkBtn = document.getElementById("resetPasswordLinkBtn");
async function sendMail() {
  try {
    const email = document.getElementById("email").value;
    const res = await axios.post("http://localhost:4000/password/forgotpassword", {
      email: email,
    });
    alert(res.data.message);
    window.location.href = "./login.html";
  } catch (error) {
    console.log(error);
    alert(error);
    window.location.reload();
  }
}
resetPasswordLinkBtn.addEventListener("click", sendMail);
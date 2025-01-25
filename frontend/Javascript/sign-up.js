

function handleFormSubmit(e) {
    e.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    console.log(name ,email ,phone,password);

    const signUpObj = {
        name,
        email,
        phone,
        password
    };

    axios.post('http://localhost:4000/user/sign-up', signUpObj)
        .then((result) => {
            console.log('User added successfully:', result);
            alert('User added successfully!');
            window.location.href = './login.html';
        })
        .catch((err) => {
            console.error('Error adding user:', err);
            alert('Error adding user. Please try again.');
        });
}

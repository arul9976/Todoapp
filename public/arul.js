const formData = document.querySelector('.form-login > .submit')
const msgEl = document.querySelector('.form-login > .msgLogin')
const inputEl = document.querySelectorAll('.form-control')
const formUser = document.querySelector('.form-control > .User')
const formPass = document.getElementById('Password')


console.log(msgEl);
const LoginData = []


formData.addEventListener('click', (e) => {
    e.preventDefault()
    let Email = formUser.value
    let Password = formPass.value

    const Formobject = {
        Email: Email,
        Password: Password
    }
    console.log(Email, Password);
    fetch(`/app/Login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({ Formobject }),

    })
        .then(response => response.json())
        .then(data => {
            const errorFunc = () => {
                msgEl.textContent = 'Username or password wrong'
                inputEl.forEach(input => {
                    input.classList.add('not')
                    input.addEventListener('click', () => {
                        inputEl.forEach(input_1 => {
                            input_1.classList.remove('not')
                        })
                        msgEl.textContent = ""
                    })
                })
            }
            if (data.error == 'User not exists') {
                console.log('yes')

                errorFunc()
            }
            if (data.error == 'Un/Ps wrong') {
                console.log('us')
                errorFunc()
            }
            else {
                data.forEach(Item => {
                    let jsonData = JSON.stringify(Item)
                    console.log('hio', jsonData);

                    localStorage.setItem('LoginData', jsonData)
                })

                window.location.href = '/Dashboard';
            }

        })
        .catch(err => {
            console.log('failed', err);
        })

});


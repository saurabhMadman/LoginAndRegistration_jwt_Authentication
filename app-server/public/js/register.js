<script src="http://code.jquery.com/jquery-1.11.0.min.js"> </script>
 
 $(document).ready(function() {  

    const form = document.getElementById('reg-form')
    form.addEventListener('submit', registerUser)
 })

 async function registerUser(event) {
    event.preventDefault()
    const username = document.getElementById('username').value
    const passwordinput = document.getElementById('passwordinput').value
    const userage = document.getElementById('userage').value
    const userphone = document.getElementById('userphone').value
    const useremail = document.getElementById('useremail').value

    const result = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            passwordinput,
            userage,
            userphone,
            useremail
        })
    }).then((res) => res.json())

    if (result.status === 'ok') {
        // everythign went fine
        alert('Success')
    } else {
        alert(result.error)
    }
}
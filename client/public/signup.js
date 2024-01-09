
const form = document.querySelector('form');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    var email = document.getElementsByName("mail")[0].value; 
    console.log(email);

    var response = await fetch("/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email })
    });

    var rs = await response.json(); 
    if(rs.msg == "ready to signup"){
        form.submit();
    }
    else{
        alert("This email is already exists try to login");
    }
});

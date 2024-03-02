var form = document.querySelector('form');
var button = document.querySelector('button');
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    button.disabled = true;
    var email = document.getElementsByName("mail")[0].value;
    var password = document.getElementsByName("pass")[0].value;
    console.log(email, password);

    var response = await fetch("/verifysignin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            pass: password
        })
    });
    if (response.ok) {
        var rs = await response.json();
        if (rs.msg == "true") {
            const header=response.headers
            const cookies=header.get('Set-Cookie');
            if(cookies){
                const cookiesArray=cookies.split(';');
                cookiesArray.forEach(element => {
                    document.cookie=element;
                });
            }
            form.submit();
            console.log(rs);
        } else {
            alert("Either username or password are incorrect");
            button.disabled = false;
        }
    }

})

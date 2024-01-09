var form = document.querySelector('form');
form.addEventListener('submit', async function (event) {
    event.preventDefault();
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

    var rs = await response.json();
    console.log(rs);
    if (rs.msg == "true") {
        form.submit();
    } else {
        alert("Either username or password are incorrect");
    }
})

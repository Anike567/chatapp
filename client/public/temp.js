//


                const response = await fetch('/getusers');
        const users = await response.json();
        let usrmail = document.getElementsByClassName('usr-mail')[0].innerHTML;
        await users.forEach(element => {
            console.log(element);
            if (usrmail != element.email) {

                let list=document.querySelector("."+element.email);
                if(toid === element.ioid){
                    toid=element.ioid;
                }
                list.id=element.ioid;
            }
            

        });
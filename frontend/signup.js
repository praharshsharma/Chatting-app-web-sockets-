let email = document.getElementById("email");
let text = document.getElementById("text");
let submit = document.getElementById("submit");

submit.addEventListener('click',()=>{
    if(email.value != "")
    {text.innerText = "Go to the verification link";}
});

console.log("js loaded");
let text = document.getElementById("text");
let submit = document.getElementById("submit");

submit.addEventListener('click',setTimeout(()=>{
    console.log("in event ")
    text.innerText = "Go to the verification link";
},8000));
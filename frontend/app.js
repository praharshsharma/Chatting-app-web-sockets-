let button = document.getElementById("submit");
var m;
button.addEventListener('click' , ()=> {
	console.log("function");
	m = document.getElementById("email").value;
})

module.exports = { m };
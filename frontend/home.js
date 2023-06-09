const socket = io('http://localhost:5001')

socket.emit('home-page-visited');

const left = document.querySelector(".left");

// form.addEventListener('submit' , (e)=>{
//     e.preventDefault();
// })

// form.addEventListener('submit' , ()=> {
//     const name = document.createElement('div');
//     name.innerText = document.getElementById("ns").value;
//     name.classList.add('usn');
//     left.append(name);

// })

function search(){
    console.log("in search");
    const data = document.getElementById("ns").value;
    console.log(data);
    if(data!="")
    {
       fetch('search' , {
        method: 'POST',
        headers: {'Content-Type': 'appliction/json ; charset=UTF-8'},
        body: JSON.stringify({payload:data}),
       })
    }
}






// $.ajax({
//     url:"/search",
//     method:"POST",
//     body :  JSON.stringify({data:data}),
//     success : function(result){
//         const name = document.createElement('div');
//         name.innerText = result;
//         name.classList.add('usn');
//         left.append(name);
//     }
// })

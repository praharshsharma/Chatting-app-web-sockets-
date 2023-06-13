const socket = io('http://localhost:5001')

socket.emit('home-page-visited');

const left = document.querySelector(".left");

// form.addEventListener('submit', (e) => {
//   e.preventDefault();
// })

// form.addEventListener('submit', () => {
//   const name = document.createElement('div');
//   name.innerText = document.getElementById("ns").value;
//   name.classList.add('usn');
//   left.append(name);

// })



function search() {
  const mail = document.getElementById("ns").value;
  const data = { name: mail };

  fetch('/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      // Handle the response
      if (result.message) {
        document.getElementById("dec").innerHTML = result.message;
      }
      else {
        document.getElementById("toname").innerHTML = result.receivername;
        const name = document.createElement('div');
        name.innerText =result.receivername;
        name.classList.add('usn');
        left.append(name);
      }


      console.log(result);
    })

}


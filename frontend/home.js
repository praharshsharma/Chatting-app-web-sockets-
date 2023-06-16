const socket = io("http://localhost:5001");

socket.emit("home-page-visited");

var left = document.querySelector(".left");
var allmsgs = document.getElementById("all-msgs");

var message = document.querySelectorAll(".textbox");
var button = document.querySelectorAll(".msgsend");
var usn = document.querySelectorAll(".usn");
var right = document.querySelectorAll(".right");



function handleKeyPress(event, nameofcurr) {
  if (event.keyCode === 13) { 
    event.preventDefault(); 
    button.forEach((currbutt)=>{
      if(currbutt.name==nameofcurr){
        currbutt.click();
      }
    })
  }
}

socket.on("receive-message", (textmsg, mailid, sendername , hour , minute) => {
  var container = document.getElementById(mailid);
  if (container) {
    if (container.classList.contains("hide")) {
      usn.forEach((currleft) => {
        if (currleft.classList[1] == mailid) {
          currleft.classList.add("bold");
        }
      })
    }

    const msg = document.createElement("div");
    const time = document.createElement("div");
    time.innerText = `${hour}:${minute}`;
    msg.classList.add("m");
    msg.classList.add("l");
    msg.innerText = textmsg;
    msg.append(time);
    container.querySelector(".chats").append(msg);

    container.querySelector(".chats").scrollTop = container.querySelector(".chats").scrollHeight;

  } else {
    //making right side
    const msgbox = document.createElement("div");

    var toname = document.createElement("div");
    toname.classList.add("toname");
    toname.innerText = sendername;
    msgbox.append(toname);

    var chats = document.createElement("div");
    chats.classList.add("chats");
    chats.scrollTop = chats.scrollHeight;
    msgbox.append(chats);

    var inputdiv = document.createElement("div");
    inputdiv.classList.add("msg-input-div");
    const label = document.createElement("label");
    label.innerText = "Type a message-";
    var input1 = document.createElement("input");
    var input2 = document.createElement("input");
    input1.setAttribute("type", "text");
    input2.setAttribute("type", "submit");
    input1.setAttribute("class", "textbox");
    input2.setAttribute("class", "msgsend");
    input1.setAttribute("name", mailid);
    input2.setAttribute("name", mailid);
    input2.setAttribute("value", "send");
    input1.setAttribute("onkeydown", "handleKeyPress(event, '" + mailid + "')");

    inputdiv.append(label);
    inputdiv.append(input1);
    inputdiv.append(input2);
    msgbox.append(inputdiv);

    msgbox.classList.add("right");
    msgbox.classList.add("hide");
    msgbox.setAttribute("id", mailid);

    allmsgs.append(msgbox);

    //making left side
    var uname = document.createElement("div");
    uname.innerText = sendername;
    uname.classList.add("usn");
    uname.classList.add(mailid);
    uname.classList.add("bold");
    left.append(uname);

    //displaying message
    const msg = document.createElement("div");
    const time = document.createElement("div");
    time.innerText = `${hour}:${minute}`;
    msg.classList.add("m");
    msg.classList.add("l");
    msg.innerText = textmsg;
    msg.append(time);
    msgbox.querySelector(".chats").append(msg);

    button = document.querySelectorAll(".msgsend");
    message.forEach((currElement)=>{
      currElement.removeAttribute("onkeydown");
    })
    message = document.querySelectorAll(".textbox");


    button.forEach((currElement) => {
      var nameofcurr = currElement.name;
      currElement.addEventListener("click", () => {
        var currmsg = null;
        for (var i = 0; i < message.length; i++) {
          if (message[i].name == nameofcurr) {
            currmsg = message[i].value;
            message[i].value = "";
            break;
          }
        }
        //displaying message
        if (currmsg) {
          const msg = document.createElement("div");
          let hour = new Date().getHours();
          let minute = new Date().getMinutes();
          const time = document.createElement("div");
          time.innerText = `${hour}:${minute}`;
          msg.classList.add("m");
          msg.classList.add("r");
          msg.innerText = currmsg;
          msg.append(time);
          
          var msgbox = document.getElementById(nameofcurr);
          msgbox.querySelector(".chats").append(msg);
          
          socket.emit("send-message", currmsg, nameofcurr , hour , minute);
         

        }

        chats.scrollTop = chats.scrollHeight;

      });
    });

    usn = document.querySelectorAll(".usn");
    right = document.querySelectorAll(".right");

    usn.forEach((currElement) => {
      currElement.addEventListener('click', () => {
        currElement.classList.remove("bold");
        var idforsearch = currElement.classList[1];
        right.forEach((curr) => {
          if (curr.id == idforsearch) {
            curr.classList.remove("hide");
          } else {
            curr.classList.add("hide");
          }
        });
      })
    });
  }
});

function search() {
  const mail = document.getElementById("ns").value;
  document.getElementById("ns").value = null;
  const data = { name: mail };

  fetch("/endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      // Handle the response
      if (result.message) {
        document.getElementById("dec").innerText = result.message;
      } else {
        document.getElementById("dec").innerText = "";
        var container = document.getElementById(mail);
        if (container) {
        } else {
          const msgbox = document.createElement("div");

          var toname = document.createElement("div");
          toname.classList.add("toname");
          toname.innerText = result.receivername;
          msgbox.append(toname);

          var chats = document.createElement("div");
          chats.classList.add("chats");
          chats.scrollTop = chats.scrollHeight;
          msgbox.append(chats);

          var inputdiv = document.createElement("div");
          inputdiv.classList.add("msg-input-div");
          const label = document.createElement("label");
          label.innerText = "Type a message-";
         
          var input1 = document.createElement("input");
          var input2 = document.createElement("input");
          input1.setAttribute("type", "text");
          input2.setAttribute("type", "submit");
          input1.setAttribute("class", "textbox");
          input2.setAttribute("class", "msgsend");
          input1.setAttribute("name", mail);
          input2.setAttribute("name", mail);
          input2.setAttribute("value", "send");
          input1.setAttribute("onkeydown", "handleKeyPress(event, '" + mail + "')");

          inputdiv.append(label);
          inputdiv.append(input1);
          inputdiv.append(input2);
          msgbox.append(inputdiv);

          msgbox.classList.add("right");
          msgbox.setAttribute("id", mail);

          allmsgs.append(msgbox);

          //making left side
          const name = document.createElement("div");
          name.innerText = result.receivername;
          name.classList.add("usn");
          name.classList.add(mail);
          left.append(name);

          button = document.querySelectorAll(".msgsend");
          message.forEach((currElement)=>{
            currElement.removeAttribute("onkeydown");
          })
          message = document.querySelectorAll(".textbox");

          button.forEach((currElement) => {
            var nameofcurr = currElement.name;
            currElement.addEventListener("click", () => {
              var currmsg = null;
              for (var i = 0; i < message.length; i++) {
                if (message[i].name == nameofcurr) {
                  currmsg = message[i].value;
                  message[i].value = "";
                  break;
                }
              }
              //displaying message

              if (currmsg) {
                const msg = document.createElement("div");
                let hour = new Date().getHours();
                let minute = new Date().getMinutes();
                const time = document.createElement("div");
                time.innerText = `${hour}:${minute}`;
                msg.classList.add("m");
                msg.classList.add("r");
                msg.innerText = currmsg;
                msg.append(time);
                var msgbox = document.getElementById(nameofcurr);
                msgbox.querySelector(".chats").append(msg);

                socket.emit("send-message", currmsg, nameofcurr , hour , minute);
              }

              chats.scrollTop = chats.scrollHeight;
            });
          });

          usn = document.querySelectorAll(".usn");
          right = document.querySelectorAll(".right");

          usn.forEach((currElement) => {
            currElement.addEventListener('click', () => {
              currElement.classList.remove("bold");
              var idforsearch = currElement.classList[1];
              right.forEach((curr) => {
                if (curr.id == idforsearch) {
                  curr.classList.remove("hide");
                } else {
                  curr.classList.add("hide");
                }
              });
            })
          });

          right.forEach((curr) => {
            curr.classList.add("hide");
          })
          msgbox.classList.remove("hide");
        }
      }

      console.log(result);
    });
}

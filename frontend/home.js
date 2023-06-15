const socket = io("http://localhost:5001");

socket.emit("home-page-visited");

var left = document.querySelector(".left");
var allmsgs = document.getElementById("all-msgs");

var message = document.querySelectorAll(".textbox");
var button = document.querySelectorAll(".msgsend");
var usn = document.querySelectorAll(".usn");
var right = document.querySelectorAll(".right");

socket.on("receive-message", (message, mailid, sendername) => {
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
    msg.classList.add("m");
    msg.classList.add("l");
    msg.innerText = message;
    container.querySelector(".chats").append(msg);

    //to make it to the bottom

    // var lastele = container.querySelector(".chats").lastElementChild;
    // lastele.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // container.querySelector(".chats").scrollTop = container.querySelector(".chats").scrollHeight - container.querySelector(".chats").clientHeight;
  } else {
    //making right side
    const msgbox = document.createElement("div");

    var toname = document.createElement("div");
    toname.classList.add("toname");
    toname.innerText = sendername;
    msgbox.append(toname);

    var chats = document.createElement("div");
    chats.classList.add("chats");
    msgbox.append(chats);

    var inputdiv = document.createElement("div");
    inputdiv.classList.add("msg-input-div");
    //var form = document.createElement("form");
    //form.classList.add("csmg");
    const label = document.createElement("label");
    label.innerText = "Type a message-";
    //form.append(label);
    var input1 = document.createElement("input");
    var input2 = document.createElement("input");
    input1.setAttribute("type", "text");
    input2.setAttribute("type", "submit");
    input1.setAttribute("class", "textbox");
    input2.setAttribute("class", "msgsend");
    input1.setAttribute("name", mailid);
    input2.setAttribute("name", mailid);
    input2.setAttribute("value", "send");
    //form.append(input1);
    //form.append(input2);
    //inputdiv.append(form);
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
    msg.classList.add("m");
    msg.classList.add("l");
    msg.innerText = message;
    msgbox.querySelector(".chats").append(msg);

    button = document.querySelectorAll(".msgsend");
    message = document.querySelectorAll(".textbox");

    //testing
    button.forEach((currElement) => {
      var nameofcurr = currElement.name;
      console.log("inside for each");
      currElement.addEventListener("click", () => {
        console.log("in button");
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
          msg.classList.add("m");
          msg.classList.add("r");
          msg.innerText = currmsg;
          var msgbox = document.getElementById(nameofcurr);
          msgbox.querySelector(".chats").append(msg);
          //To make it to bottom

          // var lastele = msgbox.querySelector(".chats").lastElementChild;
          // lastele.scrollIntoView({ behavior: 'smooth', block: 'end' });
          // msgbox.querySelector(".chats").scrollTop = msgbox.querySelector(".chats").scrollHeight - msgbox.querySelector(".chats").clientHeightHeight;
          socket.emit("send-message", currmsg, nameofcurr);
        }

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
        document.getElementById("dec").innerHTML = result.message;
      } else {
        //document.getElementById("toname").innerHTML = result.receivername;
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
          msgbox.append(chats);

          var inputdiv = document.createElement("div");
          inputdiv.classList.add("msg-input-div");
          //var form = document.createElement("form");
          //form.classList.add("csmg");
          const label = document.createElement("label");
          label.innerText = "Type a message-";
          //form.append(label);
          var input1 = document.createElement("input");
          var input2 = document.createElement("input");
          input1.setAttribute("type", "text");
          input2.setAttribute("type", "submit");
          input1.setAttribute("class", "textbox");
          input2.setAttribute("class", "msgsend");
          input1.setAttribute("name", mail);
          input2.setAttribute("name", mail);
          input2.setAttribute("value", "send");
          //form.append(input1);
          //form.append(input2);
          //inputdiv.append(form);
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
          message = document.querySelectorAll(".textbox");

          button.forEach((currElement) => {
            var nameofcurr = currElement.name;
            console.log("inside for each");
            currElement.addEventListener("click", () => {
              console.log("in button");
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
                msg.classList.add("m");
                msg.classList.add("r");
                msg.innerText = currmsg;
                var msgbox = document.getElementById(nameofcurr);
                msgbox.querySelector(".chats").append(msg);

                socket.emit("send-message", currmsg, nameofcurr);
              }
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

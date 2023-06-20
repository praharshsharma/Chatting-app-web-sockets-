const socket = io("http://localhost:5001");

socket.emit("home-page-visited");

var left = document.querySelector(".left");
var allmsgs = document.getElementById("all-msgs");

var message = document.querySelectorAll(".textbox");
var button = document.querySelectorAll(".msgsend");
var usn = document.querySelectorAll(".usn");
var right = document.querySelectorAll(".right");

var prof = document.querySelector('.profile');
var dbb = document.getElementsByClassName('dabba');
prof.addEventListener('click', () => {
  dbb[0].classList.toggle('hide');
})

// $('#textarea').emojioneArea({
//   pickerPosition: 'bottom'
// })

function handleKeyPress(event, nameofcurr) {
  if (event.keyCode === 13) {
    event.preventDefault();
    button.forEach((currbutt) => {
      if (currbutt.name == nameofcurr) {
        currbutt.click();
      }
    })
  }
}

socket.on("receive-message", (textmsg, mailid, sendername, hour, minute, profpic) => {
  var container = document.getElementById(mailid);
  if (container) {
    if (container.classList.contains("hide")) {
      usn.forEach((currleft) => {
        if (currleft.classList[1] == mailid) {
          currleft.classList.add("bold");
          left.innerText = "";
          left.append(currleft);
        }
      })
    }

    usn.forEach((currElement) => {
      if (currElement.classList[1] != mailid) {
        left.append(currElement);
      }
    })

    usn = document.querySelectorAll(".usn");

    const msg = document.createElement("div");
    const time = document.createElement("div");
    time.innerText = `${hour}:${minute}`;
    time.classList.add("time");
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
    // label.innerText = "Type a message-";
    var input1 = document.createElement("input");
    var input2 = document.createElement("input");
    input1.setAttribute("placeholder", "Type a message");
    input1.setAttribute("type", "text");
    input2.setAttribute("type", "submit");
    input1.setAttribute("class", "textbox");
    input2.setAttribute("class", "msgsend");
    input1.setAttribute("name", mailid);
    input2.setAttribute("name", mailid);
    input2.setAttribute("value", "send");
  

    inputdiv.append(label);
    inputdiv.append(input1);
    inputdiv.append(input2);
    msgbox.append(inputdiv);

    msgbox.classList.add("right");
    msgbox.classList.add("hide");
    msgbox.setAttribute("id", mailid);

    allmsgs.append(msgbox);

    // var script1 = document.createElement("script");
    // var script2 = document.createElement("script");
    // var script3 = document.createElement("script");
    // script1.src = 'https://code.jquery.com/jquery-3.7.0.min.js';
    // script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/emojionearea/3.4.2/emojionearea.min.js';
    // script3.innerHTML = "$('.textbox').emojioneArea({pickerPosition:'bottom'})";
    // document.body.appendChild(script1);
    // document.body.appendChild(script2);
    // document.body.appendChild(script3);

    //making left side
    var uname = document.createElement("div");
    var image = document.createElement("img");
    image.setAttribute("class", "leftimage");
    image.setAttribute("src", `./uploads/${profpic}`);
    let newdiv = document.createElement("div");
    newdiv.append(image);
    newdiv.classList.add("child");
    uname.append(newdiv);
    let newdiv2 = document.createElement("div");
    newdiv2.innerText = sendername;
    newdiv2.classList.add("child");
    uname.append(newdiv2);
    uname.classList.add("usn");
    uname.classList.add(mailid);
    uname.classList.add("bold");
    //left.append(uname);

    left.innerText = "";
    left.append(uname);

    usn.forEach((currElement) => {
      left.append(currElement);
    })

    usn = document.querySelectorAll(".usn");

    //displaying message
    const msg = document.createElement("div");
    const time = document.createElement("div");
    time.innerText = `${hour}:${minute}`;
    time.classList.add("time");
    msg.classList.add("m");
    msg.classList.add("l");
    msg.innerText = textmsg;
    msg.append(time);
    msgbox.querySelector(".chats").append(msg);

    button = document.querySelectorAll(".msgsend");
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
          time.classList.add("time");
          msg.classList.add("m");
          msg.classList.add("r");
          msg.innerText = currmsg;
          msg.append(time);

          var msgbox = document.getElementById(nameofcurr);
          msgbox.querySelector(".chats").append(msg);

          socket.emit("send-message", currmsg, nameofcurr, hour, minute);

          left.innerText = "";
          usn.forEach((curr) => {
            if (curr.classList[1] == nameofcurr) {
              left.append(curr);
            }
          })

          usn.forEach((curr) => {
            if (curr.classList[1] != nameofcurr) {
              left.append(curr);
            }
          })

          usn = document.querySelectorAll(".usn");
          message = document.querySelectorAll(".textbox");


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
            message.forEach((elem) => {
              if (elem.name == idforsearch) {
                elem.setAttribute("onkeydown", "handleKeyPress(event, '" + idforsearch + "')");
              }
              else {
                elem.removeAttribute("onkeydown");
              }
            })
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

          var input1 = document.createElement("input");
          var input2 = document.createElement("input");
          input1.setAttribute("placeholder", "Type a message");
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
          
          // var script1 = document.createElement("script");
          // var script2 = document.createElement("script");
          // var script3 = document.createElement("script");
          // script1.src = 'https://code.jquery.com/jquery-3.7.0.min.js';
          // script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/emojionearea/3.4.2/emojionearea.min.js';
          // script3.innerHTML = "$('.textbox').emojioneArea({pickerPosition:'bottom'})";
          // document.body.appendChild(script1);
          // document.body.appendChild(script2);
          // document.body.appendChild(script3);

          //making left side
          const name = document.createElement("div");
          var image = document.createElement("img");
          image.setAttribute("class", "leftimage");
          image.setAttribute("src", `./uploads/${result.profpic}`);
          let newdiv = document.createElement("div");
          newdiv.append(image);
          newdiv.classList.add("child");
          name.append(newdiv);
          let newdiv2 = document.createElement("div");
          newdiv2.innerText = result.receivername;
          newdiv2.classList.add("child");
          name.append(newdiv2);
          name.classList.add("usn");
          name.classList.add(mail);

          left.innerText = "";
          left.append(name);

          usn.forEach((currElement) => {
            left.append(currElement);
          })

          usn = document.querySelectorAll(".usn");

          button = document.querySelectorAll(".msgsend");
          message.forEach((currElement) => {
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
                time.classList.add("time");
                time.innerText = `${hour}:${minute}`;
                msg.classList.add("m");
                msg.classList.add("r");
                msg.innerText = currmsg;
                msg.append(time);
                var msgbox = document.getElementById(nameofcurr);
                msgbox.querySelector(".chats").append(msg);

                socket.emit("send-message", currmsg, nameofcurr, hour, minute);

                left.innerText = "";
                usn.forEach((curr) => {
                  if (curr.classList[1] == nameofcurr) {
                    left.append(curr);
                  }
                })

                usn.forEach((curr) => {
                  if (curr.classList[1] != nameofcurr) {
                    left.append(curr);
                  }
                })
              }

              chats.scrollTop = chats.scrollHeight;
              usn = document.querySelectorAll(".usn");
              right = document.querySelectorAll(".right");
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
                  message.forEach((elem) => {
                    if (elem.name == idforsearch) {
                      elem.setAttribute("onkeydown", "handleKeyPress(event, '" + idforsearch + "')");
                    }
                    else {
                      elem.removeAttribute("onkeydown");
                    }
                  })
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

    });
}


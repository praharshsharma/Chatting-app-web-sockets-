const socket = io('http://localhost:5001')

socket.emit('home-page-visited');
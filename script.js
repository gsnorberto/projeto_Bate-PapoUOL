//Scroll to last message
let lastMessage = document.querySelector('.msgs .msg:last-child');
lastMessage.scrollIntoView();

let userName = 'gsnorberto';

// Join the chat
axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: userName })
    .then(()=>{console.log("Conectado...");})
    .catch((e)=>{console.log("Error: ");})

// Stay online
let intervalStayOn = setInterval(stayOn, 5000);

function stayOn () {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: userName })
        .then(()=>{console.log("Conectado...");})
        .catch((e)=>{console.log("Error: ");})
}


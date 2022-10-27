let userName;
let allMessages = [];
let intervalStayOn;
let intervalFetchMessages;

function enterName(){
    userName = prompt('Digite um nome de usuário');
    joinChat();
}
enterName();
    
// Join the chat
function joinChat(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: userName })
        .then(()=>{
            console.log("Conctado...");
            intervalStayOn = setInterval(stayOn, 5000); // Keep User Online
            fetchMessages();
            intervalFetchMessages = setInterval(fetchMessages, 3000); // Fetch messages on the server
        })
        .catch((e) => {
            if(e.response.status === 400){
                alert('Nome de usuário já está em uso');
            }
            enterName();
        })
}

// Keep User Online
function stayOn () {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: userName })
        .then(() => {console.log("Conectado...");})
        .catch((e) => {console.log("Error: ", e.response.status);})
}

//Fetch Message
function fetchMessages () {
    allMessages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then((response) => {
            allMessages = response.data;
            //console.log(allMessages);
            insertMessage();
        })
        .catch((e) => {console.log("Error: ", e.response.status);})
}

// Insert Messages
function insertMessage () {
    document.querySelector('.msgs').innerHTML = '';

    for(let i = 0 ; i < allMessages.length ; i++){
        document.querySelector('.msgs').innerHTML += `
            <div class="msg ${allMessages[i].type == 'status' ? 'status-msg' : ''} ${allMessages[i].from == userName ? 'reserved-msg' : ''}">
                <div class="send-time">
                    ${allMessages[i].time}
                </div>
                <div class="text">
                    <span>${allMessages[i].from}</span> ${allMessages[i].text}...
                </div>
            </div>
        `
    }
    
    //Scroll to last message
    let lastMessage = document.querySelector('.msgs .msg:last-child');
    lastMessage.scrollIntoView();
}

//Send Message
function sendMessage () {
    let text = document.querySelector('.input-text').value;

    if(text !== ''){
        let message = {
            from: userName,
            to: 'Todos',
            text: text,
            type: 'message'
        }
        axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", message)
            .then(() => {
                console.log('mensagem enviada');
                fetchMessages();
            })
            .catch((e) => console.log(e.response.status))
        
        //clear input text
        document.querySelector('.input-text').value = '';
    }
}

// Send Message with 'enter' key
let inputElement = document.querySelector('.input-text');
inputElement.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        sendMessage();
    }
})


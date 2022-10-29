let userName;
let allMessages = [];
let intervalStayOn;
let intervalFetchMessages;

function enterName(){
    userName = document.querySelector('.login-area input').value;

    if(userName.trim() !== ''){
        joinChat();
    }
}
enterName();
    
// Join the chat
function joinChat(){
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: userName })
        .then(()=>{
            console.log("Conctado...");
            document.querySelector('.login').style.display = 'none';
            intervalStayOn = setInterval(stayOn, 5000); // Keep User Online
            fetchMessages();
            intervalFetchMessages = setInterval(fetchMessages, 3000); // Fetch messages on the server
        })
        .catch((e) => {
            if(e.response.status === 400){
                document.querySelector('.login-area input').value = '';
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

// Insert Messages  in chat
function insertMessage () {
    document.querySelector('.msgs').innerHTML = '';

    for(let i = 0 ; i < allMessages.length ; i++){
        document.querySelector('.msgs').innerHTML += `
            <div class="msg ${allMessages[i].type == 'status' ? 'status-msg' : ''} ${allMessages[i].from == userName ? 'reserved-msg' : ''}">
                <div class="text">
                    <span class="send-time">${allMessages[i].time}</span><span class="name-user">${allMessages[i].from}</span> ${allMessages[i].text}...
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
            .catch((e) => {
                console.log(e.response.status);
                alert('Você não está mais na sala!')
                window.location.reload();
            })
        
        //clear input text
        document.querySelector('.input-text').value = '';
    }
}

// Send with 'enter' key
let inputLogin = document.querySelector('.login input');
inputLogin.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        enterName();
    }
})
let inputMsg = document.querySelector('.input-text');
inputMsg.addEventListener('keyup', (e) => {
    if(e.keyCode === 13){
        sendMessage();
    }
})

// close navBar - click outside navBar
document.querySelector('.navBar-area').addEventListener('click', (e) => {
    if(!(document.querySelector('.navBar-contentArea').contains(e.target))){
        document.querySelector('.navBar').style.display = 'none';
    }
})

//open navBar
function openNavBar(){
    document.querySelector('.navBar').style.display = 'flex';
}
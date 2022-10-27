const userName = 'gsnorberto';
let allMessages = [];



// Join the chat
axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: userName })
    .then(()=>{console.log("Conectado...");})
    .catch((e) => {console.log("Error: ", e.response.status);})


// Keep User Online
let intervalStayOn = setInterval(stayOn, 5000);
function stayOn () {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: userName })
        .then(() => {console.log("Conectado...");})
        .catch((e) => {console.log("Error: ", e.response.status);})
}

//Fetch Message
function fetchMessage () {
    allMessages = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then((response) => {
            allMessages = response.data;
            console.log(allMessages);
            insertMessage();
        })
        .catch((e) => {console.log("Error: ", e.response.status);})
}
fetchMessage();

// Insert Messages
function insertMessage () {
    for(let i = 0 ; i < allMessages.length ; i++){
        document.querySelector('.msgs').innerHTML += `
            <div class="msg">
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


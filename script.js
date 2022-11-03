let userName;
let allMessages = [];
let intervalStayOn;
let intervalFetchMessages;
let intervalOnlineUsers;
let onlineUsers = [];
let contactSelected = 'Todos'; // user from chat list

function enterName() {
    userName = document.querySelector('.login-area input').value;

    if (userName.trim() !== '') {
        joinChat();
    }
}

// Join the chat
function joinChat() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", { name: userName })
        .then(() => {
            //console.log("Conctado...");
            document.querySelector('.login').style.display = 'none'; // hide login
            intervalStayOn = setInterval(stayOn, 5000); // Keep User Online
            fetchMessages();
            intervalFetchMessages = setInterval(fetchMessages, 3000); // Fetch messages on the server
            checkOnlineUsers();
            intervalOnlineUsers = setInterval(checkOnlineUsers, 10000);
        })
        .catch((e) => {
            if (e.response.status === 400) {
                document.querySelector('.login-area input').value = '';
                alert('Nome de usuário já está em uso');
            }
            enterName();
        })
}

// Keep User Online
function stayOn() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: userName })
        .then(() => { console.log("Conectado..."); })
        .catch((e) => {
            console.log("Error: ", e.response.status);
            document.querySelector('.login').style.display = 'flex';
        })
}

// check online userrs
function checkOnlineUsers() {
    axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
        .then((response) => {
            onlineUsers = response.data;
            console.log("onlineUsers: ", onlineUsers);
            insertUsers();
        })
        .catch((e) => { console.log("Nenhum usuário online"); })
}
// Insert online users in the navBar
function insertUsers() {
    document.querySelector('.contacts').innerHTML = '';

    // check if te contact is online. If not, set "Todos" in contact selected
    let cont = onlineUsers.find((user) => user.name == contactSelected)
    if (!cont) {
        contactSelected = 'Todos';
        changeVisibility('public');
        removeSelectedContact();
    }

    document.querySelector('.contacts').innerHTML = `
        <div data-identifier="participant" class="contact">
            <div onclick="changeUser('Todos')" data-test="all">
                <ion-icon name="people-sharp"></ion-icon>
                <div class="contact-name">Todos</div>
            </div>
            ${contactSelected == 'Todos' ? '<ion-icon class="chek-icon" name="checkmark-sharp"></ion-icon>' : ''}
        </div>
    `

    for (let i = 0; i < onlineUsers.length; i++) {
        if (onlineUsers[i].name !== userName) {
            document.querySelector('.contacts').innerHTML += `
            <div data-identifier="participant" id=${i + 2} class="contact">
                <div onclick="changeUser('${onlineUsers[i].name}', ${i + 2})" data-test="participant">
                    <ion-icon name="person-circle"></ion-icon>
                    <div class="contact-name">${onlineUsers[i].name}</div>
                </div>
                ${contactSelected == onlineUsers[i].name ? '<ion-icon data-test="check" class="chek-icon" name="checkmark-sharp"></ion-icon>' : ''}
            </div>
        `
        }
    }

}

//Fetch Message
function fetchMessages() {
    axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
        .then((response) => {
            allMessages = response.data;
            //console.log(allMessages);
            insertMessage();
        })
        .catch((e) => { console.log("Error: ", e.response.status); })
}

// Insert Messages  in chat
function insertMessage() {
    document.querySelector('.msgs').innerHTML = '';

    for (let i = 0; i < allMessages.length; i++) {
        document.querySelector('.msgs').innerHTML += `
            <div data-test="message" class="msg ${allMessages[i].type == 'status' ? 'status-msg' : ''} ${allMessages[i].from == userName ? 'reserved-msg' : ''}">
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
function sendMessage() {
    let text = document.querySelector('.input-text').value;

    if (text !== '') {
        console.log(contactSelected);
        let message = {
            from: userName,
            to: contactSelected,
            text: text,
            type: contactSelected == 'Todos' ? 'message' : 'private_message'
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
    if (e.keyCode === 13) {
        enterName();
    }
})

let inputMsg = document.querySelector('.input-text');
inputMsg.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        sendMessage();
    }
})

// close navBar - click outside navBar
document.querySelector('.navBar-area').addEventListener('click', (e) => {
    if (!(document.querySelector('.navBar-contentArea').contains(e.target))) {
        document.querySelector('.navBar').style.display = 'none';
    }
})

//open navBar
function openNavBar() {
    document.querySelector('.navBar').style.display = 'flex';
}

function changeVisibility(visibility) {
    //Public
    if (visibility === 'public') {
        document.querySelector('.visibility > ion-icon').remove();
        document.querySelector('.visibilities .visibility:nth-child(1)').innerHTML += `
            <ion-icon data-test="check" class="chek-icon" name="checkmark-sharp"></ion-icon>
        `;
    }
    //Private
    else if (visibility === 'private') {
        document.querySelector('.visibility > ion-icon').remove();
        document.querySelector('.visibilities .visibility:nth-child(2)').innerHTML += `
            <ion-icon data-test="check" class="chek-icon" name="checkmark-sharp"></ion-icon>
        `;
    }
}

// Change selected contact
function changeUser(contactName, id) {
    if (contactName === 'Todos') {
        document.querySelector('.contact > ion-icon').remove();

        document.querySelector(`.contacts .contact:nth-child(1)`).innerHTML += `
            <ion-icon class="chek-icon" name="checkmark-sharp"></ion-icon>
        `

        removeSelectedContact();
        changeVisibility('public');
        contactSelected = 'Todos';
    } else {
        document.querySelector('.contact > ion-icon').remove();
        document.getElementById(id).innerHTML += `
            <ion-icon class="chek-icon" name="checkmark-sharp"></ion-icon>
        `

        removeSelectedContact();

        // select a contact
        document.querySelector('footer').innerHTML += `
        <div class="contact-selected">
            Enviando para ${contactName} (Reservadamente)
        </div>
        `
        changeVisibility('private');
        
        contactSelected = contactName;
    }
}

// Remove selected contact 
function removeSelectedContact() {
    let verif = document.querySelector('footer .contact-selected');
    if (verif) {
        verif.remove();
    }
}
const logout_btn     = document.querySelector('.logout');
const chatList       = document.querySelector('.chat-list');
const chatScreen     = document.querySelector('.chat-screen');
const chat_wrapper   = document.querySelector('.whole-chat-wrapper');
const nochat_wrapper = document.querySelector('.no-chat')
const send_chat      = document.getElementById('send-msg')
const chat_input     = document.getElementById('msg-input')
const token = localStorage.getItem("authToken");
let typingTimeout;
const chatUserId    = localStorage.getItem('selectedClientId');
function autoLogoutOnTokenExpiry() {
  if (!token){
    window.location.href = "user/signin";
    return;
  };

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    console.log(expirationTime);
    console.log(currentTime);
    
    if (expirationTime > currentTime) {
      setTimeout(() => {
        console.log("Token expired. Logging out...");
        localStorage.removeItem("authToken");
        window.location.href = "user/signin";
      }, expirationTime - currentTime);
    }else
      window.location.href = "user/signin";
  } catch (error) {
    console.error("Error decoding token:", error);
  }
}
document.addEventListener("DOMContentLoaded", () => autoLogoutOnTokenExpiry())
const scrollToBottom = ()=>{
  if (chatScreen) {
      chatScreen.scrollTop = chatScreen.scrollHeight;
  }
}
function showPage(page) {
    const pages = document.querySelectorAll('.content');
    pages.forEach(p => p.style.display = 'none');
    document.getElementById(page).style.display = 'flex';
}
 function removeDotLoader(){
  const receivedDivs = document.querySelectorAll('.recieved-msg-wrapper');
    receivedDivs.forEach(Element=>{
      if (Element.id == 'dot-loader') {
        Element.remove();
      }
    })
 }
const ChatListComp = (props) => {
    // console.log("props",props)
    return `
    <li class="chat-item" data-id='${props.id}'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="chat-avatar">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-8h2a3 3 0 0 0 6 0h2a5 5 0 0 1-10 0z" />
        </svg>
        <div class="chat-preview-wrapper">
            <div class="chat-name-wraapper">
                <p class="chat-name">${props.username}</p>
            </div>
        </div>
    </li>
    `;
};

const SendBubbleComp = (props) => {
  return `<div class="send-msg-wrapper" data-id="${props.id}">
  <div class="avatar">
  </div>
  <div class="send-message-body-wrapper">
      <p class="send-message-body">${props.message}</p>
  </div>
</div>`;
};

const ReceiveBubbleComp = (props) => {
  return `<div class="recieved-msg-wrapper" data-id="${props.id}">
  <div class="avatar">
  </div>
  <div class="recieved-message-body-wrapper">
      <p class="message-body">${props.message}</p>
  </div>
</div>`;
}
const dotLoader = () => {
  return `<div class="recieved-msg-wrapper" id='dot-loader'>
  <div class="avatar">
  </div>
  <div class="recieved-message-body-wrapper">
      <div class='dot-loading'></div>
  </div>
</div>`;
}

const getClientList = async ()=>{
  try{
    let Lis = '';
    const clients = await fetch('chats/clientList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
    });
    const response = await clients.json();
    const Email = localStorage.getItem('email');
    const currentClient = response.find(client => client.email === Email);
    localStorage.setItem('userId',currentClient.id);
    const remainingClients = response.filter(client => client.email !== Email);
    console.log("currentClient: ",currentClient);
    console.log("remainingClients: ",remainingClients);
    remainingClients.forEach(Element=>{
      Lis += ChatListComp(Element);
    })
    chatList.innerHTML = Lis;
    scrollToBottom();
    }catch (error) {
        console.error('Error:', error);
  }
  const chatItems = chatList.querySelectorAll('.chat-item');
  chatItems.forEach(item => {
    item.addEventListener('click', async(event) => {
      const liItem = event.target.closest('.chat-item');
      chatItems.forEach(item => {
        item.classList.remove('click-active');
      });
      liItem.classList.add('click-active');
        // Get the data-id attribute of the clicked <li>
      const id = liItem.getAttribute('data-id');
      nochat_wrapper.style.display = 'none';
      chat_wrapper.style.display = 'flex';
      localStorage.setItem('selectedClientId',id);
      
      try {
        const response = await fetch('chats/getChats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ currentUserId:currentUserId,chatUserId:id }),
        });
    
        const result = await response.json();
        console.log(result);
        let chatElem = '';
        result.forEach(Element=>{
          if (Element.user_id == currentUserId)
            chatElem += SendBubbleComp(Element);
          else
            chatElem += ReceiveBubbleComp(Element);
        })
        chatScreen.innerHTML = chatElem;
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while log out.');
      }
    });
  });
}

getClientList();

logout_btn.addEventListener('click',async()=>{
    let userResponse = confirm("Are you sure want to log out?");
    if (userResponse) {
        try {
          const token = localStorage.getItem("authToken");
            const response = await fetch('user/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                 "Authorization": `Bearer ${token}`
              }
            });
        
            const result = await response.json();
            console.log(result);
        
            if (response.ok) {
              localStorage.removeItem("authToken"); 
              window.location.href = 'user/signin';
            }
          } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while log out.');
          }
    }
})

send_chat.addEventListener('click',async()=>{
  try {
    const chatUserId    = localStorage.getItem('selectedClientId');
    const chatInputVal  = chat_input.value;
    const response = await fetch('chats/sendChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ currentUserId:currentUserId,chatUserId:chatUserId,chatInputVal:chatInputVal }),

    });

    const result = await response.json();
    if (result.status == 'success') {
      chat_input.value = '';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while log out.');
  }
})

chat_input.addEventListener('input',async ()=>{
  if (chat_input.value.trim() !== '') {
    socket.emit('typing', { from: currentUserId, to: chatUserId });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', { from: currentUserId, to: chatUserId });
    }, 2000);
  } else {
    socket.emit('stopTyping', { from: currentUserId, to: chatUserId });
  }    
  
})
socket.on('sendMessage', (data) => {
  console.log("data: ",data);
  
  if (data[0]!= 'undefined') {
    chatElem = '';
    if (data.chatUserId == currentUserId){
      console.log("entered here");
      chatElem += ReceiveBubbleComp(data);
    }else
      chatElem += SendBubbleComp(data);
    chatScreen.innerHTML += chatElem;
    scrollToBottom();
    removeDotLoader();
  }
})
socket.on('typing', (data) => {
  if (data.to === currentUserId) {
    const receivedDivs = document.querySelectorAll('.recieved-msg-wrapper');
    let found = false;
    receivedDivs.forEach(Element=>{
      if (Element.id == 'dot-loader') {
        found = true;
      }
    })
    if (!found){
      chatScreen.innerHTML += dotLoader();
      scrollToBottom();
    }
  }
});

socket.on('stopTyping', (data) => {
  if (data.to === currentUserId) {
    removeDotLoader();
  }
});
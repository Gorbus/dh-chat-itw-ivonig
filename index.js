const socket = io("http://35.157.80.184:8080");

const chatWindowMessagesEl = document.querySelector(".chatWindow__messages");
const msgInputEl = document.querySelector(".chatWindow__msgInput");
const sendButton = document.querySelector(".sendButton");
const usernameInputEl = document.querySelector(".chatWindow__nameInput");

usernameInputEl.value = "Guest";

// Send on enter
msgInputEl.addEventListener("keypress", (e) => {
  if (e.keyCode === 13 || e.which === 13) {
    e.preventDefault();
    sendMessage();
  }
});

// Send on click button
sendButton.addEventListener(
  "click",
  (e) => {
    sendMessage();
  },
  false
);

// automatize element creation
const createAndAppendTextNode = (content, className) => {
  const parentElement = document.createElement("div");
  const textNode = document.createTextNode(content);
  parentElement.classList.add(className);
  parentElement.appendChild(textNode);
  return parentElement;
};

// render receveived or sent messages
const createChatElement = ({ message, user }) => {
  const divChatEl = document.createElement("div");
  const currentUser = usernameInputEl.value.trim();

  if (user !== currentUser) {
    // Create text node to avoid XSS
    const divChatReceivedMsgUserEl = createAndAppendTextNode(
      user + ": ",
      "chatWindow__receivedMsgUser"
    );
    const divChatReceivedMsgContentEl = createAndAppendTextNode(
      message,
      "chatWindow__receivedMsgContent"
    );
    divChatEl.classList.add("chatWindow__receivedMsg");
    divChatEl.appendChild(divChatReceivedMsgUserEl);
    divChatEl.appendChild(divChatReceivedMsgContentEl);
  } else {
    const divChatSentMsgContentEl = createAndAppendTextNode(
      message,
      "chatWindow__sentMsgContent"
    );
    divChatEl.classList.add("chatWindow__sentMsg");
    divChatEl.appendChild(divChatSentMsgContentEl);
  }

  chatWindowMessagesEl.appendChild(divChatEl);
  chatWindowMessagesEl.scrollBy(0, chatWindowMessagesEl.scrollHeight);
};

// listen to messages
socket.on("message", function (data) {
  createChatElement(data);
});

const sendMessage = () => {
  const message = msgInputEl.value.trim();
  const user = usernameInputEl.value.trim();
  if (message && user) {
    socket.emit("message", { message, user });
    msgInputEl.value = "";
  }
};

import { useState, useEffect } from 'react';
import avatar from './assets/avatar.png';
import bot from './assets/bot.png';

import './App.css';
import './normalize.css';

function App() {

  // Use effect run once when app loads
  useEffect(() => {
    getEngines();
  }, []);

  // Add state for input and chat log
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [chatLog, setChatLog] = useState([]);

  // Clear chats
  const clearChat  = () => {
    setChatLog([]);
  }

  function getEngines(){
    fetch("https://botcode-b3v4.onrender.com/models")
    .then(res => res.json())
    .then(data => setModels(data.models));
  }

  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}`}];
    setInput("");
    setChatLog(chatLogNew);

    /*
     * Fetch response to the apicombining the chat log array 
     * of messages and seinding it as a message to localhost:3000 as a post
     */
    const messages = chatLogNew.map((message) => message.message).join("\n");

    const response = await fetch("https://botcode-b3v4.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
      })
    });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}`}]);

  }

  return (
    <div className="App">
      
      <aside className="sideMenu">
        <div className="sideMenu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="models">
          <label htmlFor="model">Model</label>
          <select id="model" onChange={(e) => {
            setCurrentModel(e.target.value)
          }}>
           {models.map((model, index) => (
            <option key={model.id} value={model.id}>{model.id}</option>
           ))}
          </select>
          <div className="modelInfo">
            The model parameter controls the engine used to generate the response. 
            Davinci produces best results
          </div>
        </div>
      </aside>

      <section className="chatBox">
        <div className="chatLog">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
      
        <div className="chatInput-holder">
          <form onSubmit={handleSubmit}>
            <input 
              className="chatInput-textarea" 
              rows="1" 
              value={input}
              onChange = {(e) => setInput(e.target.value)}
            ></input>
          </form>
        </div>
      </section>

    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chatMessage ${message.user === "gpt" && "chatbot"}`}>
      <div className="chatMessage-center">
        <div className={`avatar ${message.user === "gpt" && "chatbot"}`}>
        {message.user === "me" && <img src={avatar} alt="avatar" />}
        {message.user === "gpt" && <img src={bot} alt="bot" />}
          
        </div>
        <div className="message">
          {message.message}
        </div>
      </div>
    </div>
  );
}

export default App;

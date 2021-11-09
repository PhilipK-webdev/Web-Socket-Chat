

import './App.css'
import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';

const client = new W3CWebSocket('ws://127.0.0.1:8000');

function App() {
  const { Search } = Input;
  const { Text } = Typography;
  const { Meta } = Card;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    client.onopen = () => {
      console.log('Websocket Client Connected');
    }
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer);
      if (dataFromServer.type === "message") {
        setMessages((prevFeatures) => ([...prevFeatures,
        {
          msg: dataFromServer.msg,
          user: dataFromServer.user
        }]))
      }

    };
  }, [])

  const onButtonClicked = (value) => {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: user
    }));
    setValue("");
    console.log(messages);
  }
  return (
    <div className="App">
      {isLoggedIn ?
        <div>
          <div className="title">
            <Text id="main-heading" type="secondary" style={{ fontSize: '36px' }}>Websocket Chat: {user}</Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
            {messages.map(message =>
              <Card key={message.msg} style={{ width: 300, margin: '16px 4px 0 4px', alignSelf: user === message.user ? 'flex-end' : 'flex-start' }} loading={false}>
                <Meta
                  avatar={
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{message.user[0].toUpperCase()}</Avatar>
                  }
                  title={message.user + ":"}
                  description={message.msg}
                />
              </Card>
            )}
          </div>
          <div className="bottom">
            <Search
              placeholder="input message and send"
              enterButton="Send"
              value={value}
              size="large"
              onChange={(e) => setValue(e.target.value)}
              onSearch={value => onButtonClicked(value)}
            />
          </div>
        </div>

        : <Search
          placeholder="Enter Username"
          enterButton="Login"
          size="large"
          onSearch={value => {
            setIsLoggedIn(true);
            setUser(value)
          }}
        />}
    </div>
  );
}

export default App;

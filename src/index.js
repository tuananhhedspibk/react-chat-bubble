import React, { Component } from "react";
import ReactDOM from "react-dom";
import ChatBubble from "./components/ChatBubble";

const image = 'http://www.bradfordwhite.com/sites/default/files/images/corporate_imgs/iStock_000012107870XSmall.jpg';

let messages = [
  {
    type: 0,
    image,
    text: "Hello! Good Morning!",
    time: '15:00'
  },
  {
    type: 1,
    image,
    text: "Hello! Good Afternoon!",
    time: '14:00'
  }
];

ReactDOM.render(
  <ChatBubble messages={messages}/>,
  document.getElementById('root')
);

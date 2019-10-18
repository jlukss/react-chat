import React from 'react';
import io from "socket.io-client";
import Login from "./components/Login";
import Chat from "./components/Chat";
import './App.css';

const SOCKET_URL = process.env.CHAT_SOCKET_URL || 'localhost:3000'

class App extends React.Component {
  socket = null;

  state = {
    nickname: '',
    flash: '',
    requestedNickname: '',
    messages: []
  }

  constructor(props) {
    super(props);

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
  }

  initSocketConnection(nickname) {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = io.connect(SOCKET_URL, { 
      query: {
        nickname: nickname
      } 
    });
  }

  setupSocketListeners() {
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('connect_error', this.onConnectError.bind(this));
    this.socket.on('connect', this.onConnected.bind(this));
    this.socket.on('disconnect', this.onDisconnected.bind(this));
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.on('chat event', this.onEvent.bind(this));
    this.socket.on('reason', this.onReason.bind(this));
  }

  onError(err) {
    console.error(err);
    this.setState({
      flash: err,
      requestedNickname: ''
    });
  }

  onConnectError(err) {
    console.error(err);
    this.setState({
      flash: 'Server not available',
      requestedNickname: ''
    });
  }

  onReason(message) {
    this.setState({
      flash: message
    });
  }

  onDisconnected(err) {
    console.log(err);
    if (!this.state.flash) {
      this.setState({
        nickname: '',
        flash: err
      });
    } else {
      this.setState({
        nickname: ''
      });
    }
  }

  onConnected() {
    console.log('Connected...', this.state);
    this.setState({
      nickname: this.state.requestedNickname,
      requestedNickname: '',
      flash: '',
      messages: []
    });
  }

  onMessage(message) {
    this.setState({
      messages: [...this.state.messages, {type: 'message', text: message }],
    });
  }
  onEvent(message) {
    this.setState({
      messages: [...this.state.messages, {type: 'event', text: message }],
    });
  }

  sendMessage(message, callback) {
    this.socket.emit('message', message, callback);
  }

  connect(nickname) {
    console.log('Connecting as ' + nickname);

    this.setState({
      requestedNickname: nickname,
      flash: ''
    });

    this.initSocketConnection(nickname);
    this.setupSocketListeners();
  }

  disconnect() {
    console.log('Leaving chat');

    this.socket.close();

    this.setState({
      nickname: '',
      flash: 'You left the chat'
    });
  }

  render() {
    const { nickname, flash } =  this.state;
    let flashMessage = '';

    if (flash) {
      flashMessage = <div className="flash">{flash}</div>
    }

    if (nickname !== '') {
      return (
        <div className="App">
          {flashMessage}
          <Chat nickname={nickname} messages={this.state.messages} sendMessage={this.sendMessage} disconnect={this.disconnect}></Chat>
        </div>
      );
    }

    return (
      <div className="App">
          {flashMessage}
          <Login connect={this.connect}></Login>
      </div>
    );
  }
}

export default App;

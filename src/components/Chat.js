import React, { Component } from 'react';


class Chat extends Component {
    state = {
        message: '',
        sending: false
    }

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidUpdate() {
        let element = document.getElementById("messages");
        element.scrollTop = element.scrollHeight;
    }

    handleChange(event) {
        this.setState({
          [event.target.id]: event.target.value
        });
    }

    handleLogout() {
        this.props.disconnect();
    }

    handleClick(event) {
        event.preventDefault();

        this.setState({
            sending: true
        });

        this.props.sendMessage(this.state.message, (result) => {
            if (result !== false) {
                this.setState({
                    message: '',
                    sending: false
                })
            }
        });
    }

    renderMessages() {
        return this.props.messages.map((message, i) => {
            return <div key={i} className={message.type}>{message.text}</div>
        });
    }

    render() {
        const { nickname } = this.props;
        return (
            <div className="chat">
                <div id="messages" className="messages">{this.renderMessages()}</div>
                <div className="send">
                    <form onSubmit={this.handleClick}>
                        <div className="field">
                            <label htmlFor="message">{nickname}:</label>
                            <input onChange={this.handleChange} disabled={this.state.sending} id="message" type="text" value={this.state.message}></input>
                            <button type="submit" disabled={this.state.sending}>Send</button>
                            <button onClick={this.handleLogout} type="button">Disconnect</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Chat;
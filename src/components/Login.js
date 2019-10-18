import React, { Component } from 'react';

class Login extends Component {
    state = {
        nickname: ''
    }

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.connect(this.state.nickname);
    }

    handleChange(event) {
        this.setState({
          [event.target.id]: event.target.value
        });
    }

    render() {

        return (
            <div className="login">
                <form className="form" onSubmit={this.handleSubmit}>
                    <div>
                        <div className="field">
                            <label htmlFor="nickname">Your nickname:</label>
                            <input onChange={this.handleChange} id="nickname" type="text" value={this.state.nickname}></input>
                        </div>
                        <button type="submit">Connect</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login;
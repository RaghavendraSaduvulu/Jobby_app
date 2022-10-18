import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errMsg: ''}

  componentDidMount() {
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      const {history} = this.props
      history.replace('/')
    }
  }

  onSubmitSuccess = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = error => {
    this.setState({showErrorMsg: true, errMsg: error})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsernameInput = event => {
    this.setState({username: event.target.value})
  }

  onChangePasswordInput = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameInput = () => {
    const {username} = this.state

    return (
      <>
        <label htmlFor="username" className="username-label">
          USERNAME
        </label>
        <input
          className="username-input"
          type="text"
          id="username"
          value={username}
          onChange={this.onChangeUsernameInput}
          placeholder="Username"
        />
      </>
    )
  }

  renderPasswordInput = () => {
    const {password} = this.state

    return (
      <>
        <label htmlFor="password" className="password-label">
          PASSWORD
        </label>
        <input
          className="password-input"
          type="password"
          id="password"
          value={password}
          onChange={this.onChangePasswordInput}
          placeholder="Password"
        />
      </>
    )
  }

  render() {
    const {showErrorMsg, errMsg} = this.state

    return (
      <div className="login-container">
        <form className="login-content" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />
          {this.renderUsernameInput()}
          {this.renderPasswordInput()}
          <button type="submit" className="login-btn">
            Login
          </button>
          {showErrorMsg && <p className="error-msg">*{errMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login

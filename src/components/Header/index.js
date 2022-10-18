import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="nav-bar">
      <div className="nav-content">
        <Link to="/" className="nav-link">
          <img
            className="home-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="desktop-sections-container">
          <Link to="/" className="nav-link">
            <li className="section-item">Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li className="section-item">Jobs</li>
          </Link>
        </ul>
        <button onClick={onClickLogout} className="logout-btn" type="button">
          Logout
        </button>
        <ul className="mobile-sections-container">
          <li>
            <Link to="/" className="nav-link">
              <AiFillHome className="header-icons" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              <BsBriefcaseFill className="header-icons" />
            </Link>
          </li>
          <li>
            <FiLogOut className="header-icons" onClick={onClickLogout} />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default withRouter(Header)

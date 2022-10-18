import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsApiStatus: apiStatusConstants.initial,
    salaryRange: '',
    searchInput: '',
    typeList: [],
    jobs: [],
  }

  componentDidMount() {
    this.getProfileApis()
    this.getJobsApis()
  }

  getProfileApis = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inprogress})
    const token = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, options)
    const data = await response.json()
    const profile = data.profile_details
    if (response.ok === true) {
      const formattedData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileDetails: formattedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  // Job api methods

  getJobsApis = async () => {
    const token = Cookies.get('jwt_token')
    this.setState({jobsApiStatus: apiStatusConstants.inprogress})
    const {typeList, salaryRange, searchInput} = this.state
    const types = typeList.join(',')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${types}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobs: formattedData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickFailureViewBtn = () => {
    this.setState({jobsApiStatus: apiStatusConstants.initial}, this.getJobsApis)
  }

  returnJobsList = () => {
    const {jobs} = this.state
    return (
      <ul className="jobs-list">
        {jobs.map(job => (
          <JobItem key={job.id} job={job} />
        ))}
      </ul>
    )
  }

  renderNoJobsView = () => (
    <div className="no-jobs-view">
      <img
        className="no-jobs-image"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobs} = this.state
    const isEmpty = jobs.length === 0

    if (isEmpty) {
      return this.renderNoJobsView()
    }
    return this.returnJobsList()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view">
      <img
        className="job-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="failure-view-retry-btn"
        type="button"
        onClick={this.onClickFailureViewBtn}
      >
        Retry
      </button>
    </div>
  )

  renderJobsApiView = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.inprogress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  //   user profile methods

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="user-profile">
        <img className="profile-avatar" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  reCheckProfileApi = () => {
    this.setState(
      {profileApiStatus: apiStatusConstants.initial},
      this.getProfileApis,
    )
  }

  renderProfileFailureView = () => (
    <button
      className="retry-btn"
      type="button"
      onClick={this.reCheckProfileApi}
    >
      Retry
    </button>
  )

  renderProfileApi = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.inprogress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onChangeRadioButton = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsApis)
  }

  onChangeCheckbox = event => {
    if (event.target.checked === true) {
      this.setState(
        prevState => ({typeList: [...prevState.typeList, event.target.value]}),
        this.getJobsApis,
      )
    } else {
      this.setState(prevState => {
        const newList = prevState.typeList.filter(
          type => type !== event.target.value,
        )
        return {typeList: newList}
      }, this.getJobsApis)
    }
  }

  renderProfileWithFiltersView = () => {
    const {salaryRange, typeList} = this.state
    return (
      <div className="profile-api-with-filters">
        <div className="profile-api">{this.renderProfileApi()}</div>
        <hr className="line" />
        <h1 className="sub-heading">Type of Employment</h1>
        <ul className="employment-types-list">
          {employmentTypesList.map(eachItem => (
            <li key={eachItem.employmentTypeId} className="list-item">
              <input
                className="checkbox"
                id={eachItem.employmentTypeId}
                type="checkbox"
                value={eachItem.employmentTypeId}
                checked={typeList.includes(eachItem.employmentTypeId)}
                onChange={this.onChangeCheckbox}
              />
              <label
                className="checkbox-label"
                htmlFor={eachItem.employmentTypeId}
              >
                {eachItem.label}
              </label>
            </li>
          ))}
        </ul>
        <hr className="line" />
        <h1 className="sub-heading">Salary Range</h1>
        <ul className="salary-ranges-list">
          {salaryRangesList.map(eachItem => (
            <li key={eachItem.salaryRangeId} className="list-item">
              <input
                className="radio-input"
                id={`${eachItem.salaryRangeId}`}
                type="radio"
                value={eachItem.salaryRangeId}
                checked={eachItem.salaryRangeId === salaryRange}
                name="salary"
                onChange={this.onChangeRadioButton}
              />
              <label
                className="radio-label"
                htmlFor={`${eachItem.salaryRangeId}`}
              >
                {eachItem.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    this.setState({jobsApiStatus: apiStatusConstants.initial}, this.getJobsApis)
  }

  renderSearchBox = () => {
    const {searchInput} = this.state

    return (
      <div className="search-container">
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          value={searchInput}
        />
        <button
          className="search-btn"
          testid="searchButton"
          type="button"
          onClick={this.onClickSearchButton}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="desktop-profile-with-filters">
            {this.renderProfileWithFiltersView()}
          </div>
          <div className="jobs-content">
            {this.renderSearchBox()}
            <div className="mobile-profile-with-filters">
              {this.renderProfileWithFiltersView()}
            </div>
            <div className="job-profiles-container">
              {this.renderJobsApiView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

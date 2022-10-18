import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {HiOutlineExternalLink} from 'react-icons/hi'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetailsApiStatus: apiStatusConstants.initial,
    jobItemDetailsData: {},
  }

  componentDidMount() {
    this.getJobItemDetailsApi()
  }

  getJobItemDetailsApi = async () => {
    this.setState({jobItemDetailsApiStatus: apiStatusConstants.inprogress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jobApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobApiUrl, options)
    const data = await response.json()
    const profile = data.job_details
    const similarJobs = data.similar_jobs
    if (response.ok === true) {
      const formattedData = {
        jobDetails: {
          companyLogoUrl: profile.company_logo_url,
          companyWebsiteUrl: profile.company_website_url,
          employmentType: profile.employment_type,
          id: profile.id,
          jobDescription: profile.job_description,
          skills: profile.skills.map(eachItem => ({
            skillImageUrl: eachItem.image_url,
            skillName: eachItem.name,
          })),
          title: profile.title,
          lifeAtCompany: {
            description: profile.life_at_company.description,
            imageUrl: profile.life_at_company.image_url,
          },
          location: profile.location,
          packagePerAnnum: profile.package_per_annum,
          rating: profile.rating,
        },
        similarJobs: similarJobs.map(eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        })),
      }
      this.setState({
        jobItemDetailsData: formattedData,
        jobItemDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobItemDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSimilarJobDetailsCard = () => {
    const {jobItemDetailsData} = this.state
    const {similarJobs} = jobItemDetailsData

    return (
      <ul className="similar-jobs-list">
        {similarJobs.map(eachItem => (
          <li key={eachItem.id} className="job-card">
            <div className="job-logo-type-rating-container">
              <img
                className="job-logo"
                src={eachItem.companyLogoUrl}
                alt="similar job company logo"
              />
              <div className="type-with-rating">
                <h1 className="type">{eachItem.title}</h1>
                <p className="rating-container">
                  <AiFillStar className="star-icon" />
                  {eachItem.rating}
                </p>
              </div>
            </div>
            <h1 className="card-heading">Description</h1>
            <p className="description">{eachItem.jobDescription}</p>
            <div className="location-with-role">
              <p className="location">
                <MdLocationOn className="location-icon" />
                {eachItem.location}
              </p>
              <p className="role">
                <BsBriefcaseFill className="job-icon" />
                {eachItem.employmentType}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderJobApiSuccessView = () => {
    const {jobItemDetailsData} = this.state
    const {jobDetails} = jobItemDetailsData
    return (
      <div className="job-details-container">
        <div className="job-details">
          <div className="job-logo-type-rating-container">
            <img
              className="job-logo"
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
            />
            <div className="type-with-rating">
              <h1 className="type">{jobDetails.title}</h1>
              <p className="rating-container">
                <AiFillStar className="star-icon" />
                {jobDetails.rating}
              </p>
            </div>
          </div>
          <div className="location-role-with-salary">
            <div className="location-with-role">
              <p className="location">
                <MdLocationOn className="location-icon" />
                {jobDetails.location}
              </p>
              <p className="role">
                <BsBriefcaseFill className="job-icon" />
                {jobDetails.employmentType}
              </p>
            </div>
            <p className="salary">{jobDetails.packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="heading-with-website">
            <h1 className="heading">Description</h1>
            <a href={jobDetails.companyWebsiteUrl} className="website-url">
              Visit
              <HiOutlineExternalLink className="visit-icon" />
            </a>
          </div>
          <p className="description">{jobDetails.jobDescription}</p>
          <div className="skills-container">
            <h1 className="skill-heading">Skills</h1>
            <ul className="skill-list-container">
              {jobDetails.skills.map(eachItem => (
                <li key={eachItem.skillName} className="skill-list-item">
                  <img
                    className="skill-image"
                    src={eachItem.skillImageUrl}
                    alt={eachItem.skillName}
                  />
                  <p className="skill-name">{eachItem.skillName}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company">
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="life-image-with-description">
              <p className="life-description">
                {jobDetails.lifeAtCompany.description}
              </p>
              <img
                className="life-image"
                src={jobDetails.lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <h1 className="heading">Similar Jobs</h1>
        {this.renderSimilarJobDetailsCard()}
      </div>
    )
  }

  onClickRetryButton = () => {
    this.setState(
      {jobItemDetailsApiStatus: apiStatusConstants.initial},
      this.getJobItemDetailsApi,
    )
  }

  renderJobApiFailureView = () => (
    <div className="job-failure-view">
      <img
        className="job-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="job-failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="job-failure-retry-btn"
        type="button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsApi = () => {
    const {jobItemDetailsApiStatus} = this.state

    switch (jobItemDetailsApiStatus) {
      case apiStatusConstants.inprogress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobApiSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-card-details-container">
          {this.renderJobDetailsApi()}
        </div>
      </>
    )
  }
}

export default JobItemDetails

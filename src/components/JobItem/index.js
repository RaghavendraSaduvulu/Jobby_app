import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobItem = props => {
  const {job} = props

  return (
    <Link to={`/jobs/${job.id}`} className="link-item">
      <li key={job.id} className="job-list-item">
        <div className="job-logo-title-rating-container">
          <img
            className="company-logo"
            src={job.companyLogoUrl}
            alt="company logo"
          />
          <div className="job-title-with-rating">
            <h1 className="title">{job.title}</h1>
            <p className="rating">
              <AiFillStar className="star-icon" />
              {job.rating}
            </p>
          </div>
        </div>
        <div className="job-location-role-salary-container">
          <div className="job-location-with-role">
            <p className="location">
              <MdLocationOn className="location-icon" />
              {job.location}
            </p>
            <p className="role">
              <BsBriefcaseFill className="job-icon" />
              {job.employmentType}
            </p>
          </div>
          <p className="salary">{job.packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h1 className="job-description-heading">Description</h1>
        <p className="job-description">{job.jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem

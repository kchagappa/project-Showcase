import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    categoryList: [],
    categoryId: categoriesList[0].id,
    apiStatus: apiStatusConstraints.initial,
  }

  componentDidMount() {
    this.getMakeApiCall()
  }

  getMakeApiCall = async () => {
    this.setState({apiStatus: apiStatusConstraints.inprogress})
    const {categoryId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${categoryId}`
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      const updateData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({
        categoryList: updateData,
        apiStatus: apiStatusConstraints.success,
      })
      console.log(updateData)
    } else {
      this.setState({apiStatus: apiStatusConstraints.failure})
    }
  }

  onClickRetry = () => {
    this.getMakeApiCall()
  }

  onChangeCategoryId = event => {
    this.setState({categoryId: event.target.value}, this.getMakeApiCall)
  }

  onRenderProjects = () => {
    const {categoryList} = this.state

    return (
      <ul className="all-projects">
        {categoryList.map(project => (
          <li key={project.id} className="project">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="project-image"
            />
            <p className="name">{project.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderInProgress = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#328af2" height="40" width="40" />
    </div>
  )

  onFailureDisplayCourses = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="oops-error">Oops! Something Went Wrong</h1>
      <p className="failure-error-msg">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  onDisplayAllDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstraints.inprogress:
        return this.renderInProgress()
      case apiStatusConstraints.success:
        return this.onRenderProjects()
      case apiStatusConstraints.failure:
        return this.onFailureDisplayCourses()

      default:
        return null
    }
  }

  render() {
    const {categoryId} = this.state
    return (
      <div>
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <div className="details-container">
          <select
            value={categoryId}
            className="input"
            onChange={this.onChangeCategoryId}
          >
            {categoriesList.map(item => (
              <option value={item.id} key={item.id}>
                {item.displayText}
              </option>
            ))}
          </select>

          {this.onDisplayAllDetails()}
        </div>
      </div>
    )
  }
}

export default App
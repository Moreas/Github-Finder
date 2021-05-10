import React, { Component } from 'react'
import Navbar from './components/layout/Navbar'
import Alert from './components/layout/Alert'
import Search from './components/users/Search'
import Users from './components/users/Users'
import About from './components/pages/About'
import User from './components/users/User'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Axios from 'axios'
import './App.css'

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  }

  // Search GitHub users
  searchUsers = async text => {
    this.setState({ loading: true })
    const res = await Axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    this.setState({ users: res.data.items, loading: false })
  }

  // Get a Single User
  getUser = async username => {
    this.setState({ loading: true })
    const res = await Axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    this.setState({ user: res.data, loading: false })
  }

  // Get  User Repos
  getUserRepos = async username => {
    this.setState({ loading: true })
    const res = await Axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    this.setState({ repos: res.data, loading: false })
  }

  // Clear users from state
  clearUsers = () => {
    this.setState({ loading: false, users: [] })
  }

  // Set Alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } })
    setTimeout(() => this.setState({ alert: null }), 3000)
  }

  render() {
    const { users, user, repos, loading } = this.state
    return (
      <Router>
        <div className='App'>
          <Navbar />
          <div className='container'>
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path='/'
                render={props => (
                  <>
                    <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} showClear={users.length ? true : false} setAlert={this.setAlert} />
                    <Users loading={loading} users={users} />
                  </>
                )}
              />
              <Route exact path='/about' component={About} />
              <Route exact path='/user/:login' render={props => <User {...props} getUser={this.getUser} getUserRepos={this.getUserRepos} user={user} repos={repos} loading={loading} />} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App

import React, { Component } from 'react'
import api from '../../services/api'
import moment from 'moment'
import { Container, Form } from './styles'
import logo from '../../assets/logo.png'
import CompareList from '../../components/CompareList'

export default class Main extends Component {
  state = {
    repositoryError: false,
    repositoryInput: '',
    repositories: []
  }

  handleAddRepository = async (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    try {
      const { data: repository } = await api.get(`/repos/${this.state.repositoryInput}`)
      repository.lastCommit = moment(repository.pushed_at).fromNow()

      this.setState({
        loading: false,
        repositoryInput: '',
        repositories: [...this.state.repositories, repository],
        repositoryError: false
      })
    } catch (e) {
      this.setState({ repositoryError: true })
    } finally {
      this.setState({ loading: false })
    }
  }

  render () {
    return (
      <Container>
        <img src={logo} alt="Git Compare"/>
        <Form whitError={this.state.repositoryError} onSubmit={this.handleAddRepository}>
          <input type="text"
                 placeholder="Usuario/Repositorio"
                 value={this.state.repositoryInput}
                 onChange={event => this.setState({ repositoryInput: event.target.value })}
          />
          <button type="submit">{this.state.loading ? <i className="fa fa-spinner fa-pulse"/> : 'ok'}</button>
        </Form>
        <CompareList repositories={this.state.repositories}/>
      </Container>
    )
  }
}
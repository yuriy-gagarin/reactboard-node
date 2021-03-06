import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from '../utils/timeout';

import Form from './Form';
import Loading from './Loading';
import ThreadPreview from './ThreadPreview';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      loading: false,
      error: false,
      form: false
    }
  }

  componentWillMount() {
    this.setState({ loading: true });
    fetch(`/api/threads`)
    .then(res => res.json())
    .then(res => this.setState({ threads: res.data, loading: false, form: true }))
    .catch(error => {
      console.error(error);
      this.setState({error: true});
    });
  }

  addThread(data) {
    const request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(data)
    }
    this.setState({ loading: true });
    return fetch(`/api/threads`, request)
    .then(res => res.json())
    .then(res => {
      if(res.success === false) throw Error('Request failed');
      this.setState({ threads: [res.thread, ...this.state.threads], loading: false },
        () => window.scrollTo(0, 0));
    })
    .catch(error => {
      setTimeout(() => this.setState({error: true}));
    });
  }

  render() {
    const form = this.state.form && <Form id={this.state.id} submit={this.addThread.bind(this)} threadForm={true}/>;
    const loading = (this.state.loading || this.state.error) && <Loading error={this.state.error} />;
    const threads = this.state.threads.map((thread, index) => {
      return (
        <li key={thread._id}>
          <ThreadPreview
            id={thread.op._id}
            humanId={thread.op.humanId}
            text={thread.op.text}
            createdAt={thread.op.createdAt}
            linkTo={thread._id}
            threadUpdatedAt={thread.updatedAt}
            posts={thread.posts}
            postCount={thread.postCount}
            images={thread.op.images[0]} />
        </li>
      );
    });
    return (
      <>
        <ul className='unstyled posts'>
          {threads}
        </ul>
        {form}
        {loading}
      </>
    );
  }
}

export default Board;
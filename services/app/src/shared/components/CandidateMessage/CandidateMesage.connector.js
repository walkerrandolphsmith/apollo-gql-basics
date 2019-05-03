import React, { PureComponent, Fragment } from 'react';
import { Mutation } from 'react-apollo';

import mutation from './CandidateMesage.mutation';
import refetchQuery from './../Messages/Messages.query';

export default class CandidateMesage extends PureComponent {
  constructor() {
    super();
    this.state = { text: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    const { text } = this.state;
    return (
      <Fragment>
        <input type="text" onBlur={this.handleChange} />
        <Mutation
          mutation={mutation}
          variables={{ text }}
          onCompleted={data => {
            debugger;
          }}
          refetchQueries={() => [
            {
              query: refetchQuery,
              variables: { cursor: 0, limit: 0 },
            },
          ]}
        >
          {mutate => {
            return <button onClick={mutate}>Post</button>;
          }}
        </Mutation>
      </Fragment>
    );
  }
}

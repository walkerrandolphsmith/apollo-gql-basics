import React, { PureComponent, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import mutation from './SignUp.mutation';

class SignUpForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      email: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(field) {
    return event => this.setState({ [field]: event.target.value });
  }

  render() {
    const { username, email, password } = this.state;
    console.log(username, password, email);
    return (
      <Fragment>
        <input type="text" onBlur={this.handleChange('username')} />
        <input type="text" onBlur={this.handleChange('password')} />
        <input type="text" onBlur={this.handleChange('email')} />
        <Mutation
          mutation={mutation}
          variables={{ username, password, email }}
          onCompleted={data => {
            debugger;
          }}
        >
          {mutate => {
            return <button handleSignUp={mutate}>Sign Up</button>;
          }}
        </Mutation>
      </Fragment>
    );
  }
}

export default () => <SignUpForm />;

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SignUp from './SignUp.component';

describe('<SignUp/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<SignUp />);
    expect(wrapper).to.not.be.null;
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SignIn from './SignIn.component';

describe('<SignIn/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<SignIn />);
    expect(wrapper).to.not.be.null;
  });
});

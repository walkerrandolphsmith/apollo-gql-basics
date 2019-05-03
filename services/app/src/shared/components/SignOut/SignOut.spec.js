import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import SignOut from './SignOut.component';

describe('<SignOut/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<SignOut />);
    expect(wrapper).to.not.be.null;
  });
});

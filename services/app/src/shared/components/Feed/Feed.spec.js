import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Feed from './Feed.component';

describe('<Feed/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<Feed />);
    expect(wrapper).to.not.be.null;
  });
});

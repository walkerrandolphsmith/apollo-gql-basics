import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Navigation from './Navigation.component';

describe('<Navigation/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<Navigation />);
    expect(wrapper).to.not.be.null;
  });
});

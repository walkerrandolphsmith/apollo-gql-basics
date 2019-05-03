import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Messages from './Messages.component';

describe('<Messages/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<Messages />);
    expect(wrapper).to.not.be.null;
  });
});

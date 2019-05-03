import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import App from './App.component';

describe('<App/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<App />);
    expect(wrapper).to.not.be.null;
  });
});

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Routes from './Routes.component';

describe('<Routes/>', function() {
  it('renders without crashing', function() {
    const wrapper = shallow(<Routes />);
    expect(wrapper).to.not.be.null;
  });
});

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const propTypes = {
  title: PropTypes.string,
  charSet: PropTypes.string,
  viewport: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
  favicon: PropTypes.shape({
    type: PropTypes.string,
    href: PropTypes.string,
  }),
  themeColor: PropTypes.string,
};

const defaultProps = {
  title: 'Titlezzz',
  charSet: 'utf-8',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  description: 'Description of the page less than 150 characters',
  canonical: 'https://localhost',
  favicon: {
    type: 'image/png',
    href: '/static/icons/favicon.ico',
  },
  themeColor: '#000000',
};

const Head = props => (
  <Helmet>
    <meta charSet={props.charSet} />
    <title>{props.title}</title>
    <meta name="viewport" content={props.viewport} />
    <meta name="description" content={props.description} />
    <meta name="theme-color" content={props.themeColor} />
    <link
      rel="shortcut icon"
      type={props.favicon.type}
      href={props.favicon.href}
    />
    <link rel="canonical" href={props.canonical} />
  </Helmet>
);

Head.propTypes = propTypes;
Head.defaultProps = defaultProps;

export default Head;

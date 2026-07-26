import React from 'react';
import ErrorPage from 'next/error';
import { notifyHandledError } from '../services/ErrorMonitoring';

export default class Error extends React.Component {
  static async getInitialProps(ctx) {
    if (ctx.err) notifyHandledError(ctx.err);
    return ErrorPage.getInitialProps(ctx);
  }

  render() {
    return (
      <ErrorPage
        statusCode={this.props.statusCode || 'Something went wrong'}
        title={
          !this.props.statusCode &&
          'An unexpected error has occurred. We have reported it to our team and will be fixed soon'
        }
      />
    );
  }
}

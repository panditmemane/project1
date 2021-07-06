import React from 'react';
import App from 'next/app';
import { Provider } from 'react-redux';
import { AuthProvider } from '../src/components/auth/provider';
import apiClient from '../src/apiClient';
import withRedux from 'next-redux-wrapper';
import ThemeProvider from '../containers/ThemeProvider';
import initStore from '../redux/store';
import 'antd/dist/antd.css';

class CustomApp extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    const client = apiClient();
    return (
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider client={client}>
            <Component {...pageProps} />
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default withRedux(initStore)(CustomApp);

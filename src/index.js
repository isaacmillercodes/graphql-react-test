import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: 'localhost:5000/graphql'
})

const client = new ApolloClient({
  networkInterface
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  , document.getElementById('root')
)
registerServiceWorker()

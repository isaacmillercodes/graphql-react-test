import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom'

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:5000/graphql'
})

const client = new ApolloClient({
  networkInterface
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)
registerServiceWorker()

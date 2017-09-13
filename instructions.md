# Step 1 - Project Set Up

1. create-react-app 'project name'
1. npm i -S react-apollo
1. import bootswatch cdn in public/index.html
1. add styles and components folders inside src, move App.js into components, move App.css and index.css into styles
1. update import paths in App.js and index.js

Then, in index.js

1. import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo' in App.js
1. point network interface to endpoint
1. instantiate client
1. Wrap App in ApolloProvider with client
1. test with npm start to see dummy page rendered

# Step 2 - Home page with recent pet images
1. Create a file called PetImageList.js inside components
1. Add imports from react and react-apollo
1. Add query as a constant using gql
1. declare components
1. add loading and error handling
1. prepare array from query
1. write template for components
1. export graphql higher order component and add to App.
1. Create a file called SplashPage.js inside components
1. import react, component, and PetImageList
1. Render divs with app classes, wrapping the PetImageList and adding a header and login button
1. Change App.js to just render the SplashPage component

# Step 3 - Routing
1. npm i -S react-router and react-router-dom
1. Create a file inside components called Auth.js
1. Add a simple component that just renders a header
1. In index.js, import { BrowserRouter } from 'react-router-dom' and wrap apollo client with BrowserRouter
1. In App.js, import { Switch, Route } from 'react-router-dom'
1. Register routes with components for '/'(SplashPage) and '/auth'(Auth)
1. In SplashPage, import { Link } from 'react-router-dom' and import { withRouter } from 'react-router'
1. Wrap button in Link and export new SplashPage component withRouter

# Step 4 - Logging in/registering
1. Inside Auth.js, import { gql, graphql, compose } from 'react-apollo'
1. Create state object for register user fields, add a key of login and set it to true
1. Create two mutations, one for registering and one for logging in
1. Create a function called sendAuthRequest that logs in or registers based on the state of login
1. Create a saveUserInfo function that stores the user id and token in sessionStorage
1. Write markup with conditionals for register-only fields
1. Wrap two higher order components inside compose, one for registering and one for logging in
1. Change the home page to check for id/token and change the button's text on successfuly log in

# Step 5 - User Profile
1. Create a component called UserProfile

# Step 6 - Pet Profile

# Step 7 - Add a new Pet

# Step 8 - Add a new image for an existing pet

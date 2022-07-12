import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

/*
Warning: componentWillMount has been renamed, and is not recommended for use. 
See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. 
In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, 
you can run `npx react-codemod rename-unsafe-lifecycles` in your project source folder.
*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as api from './api';
import TodoList from './TodoList';
api.readTodos(todos => {
    console.log(todos);
});
const app = React.createElement(TodoList, { data: "hello!" });
ReactDOM.render(app, document.getElementById('react-root'));

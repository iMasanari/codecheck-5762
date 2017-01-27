import * as fetch from 'isomorphic-fetch';
const url = 'http://localhost:8080/api/1/todo/';
var fetch;
export function readTodo(name, callback) {
    fetch(url + name).then(function (response) {
        return response.json();
    }).then(function (json) {
        callback(json);
    });
}
export function readTodos(callback) {
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (json) {
        callback(json);
    });
}

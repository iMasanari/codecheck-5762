(function (React,ReactDOM) {
'use strict';

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        var _this = _super.apply(this, arguments) || this;
        _this.completedStyle = {
            textDecoration: 'line-through',
            color: 'gray'
        };
        _this.toggleDone = function () {
            var todo = _this.props.todo;
            _this.props.update(__assign({}, todo, { done: !todo.done }));
        };
        _this.toggleStar = function () {
            var todo = _this.props.todo;
            _this.props.update(__assign({}, todo, { star: !todo.star }));
        };
        _this.remove = function () {
            _this.props.remove(_this.props.todo.id);
        };
        return _this;
    }
    Todo.prototype.Time = function (time_limit) {
        var _a = time_limit.split('-'), year = _a[0], month = _a[1], date = _a[2];
        return React.createElement("span", null,
            '（',
            React.createElement("time", { dateTime: time_limit, title: time_limit },
                month,
                "/",
                date),
            '）');
    };
    Todo.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    };
    Todo.prototype.render = function () {
        var todo = this.props.todo;
        return React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", checked: todo.done, onChange: this.toggleDone }),
                React.createElement("span", { style: todo.done ? this.completedStyle : undefined },
                    todo.title,
                    todo.time_limit ? this.Time(todo.time_limit) : undefined),
                React.createElement("span", { onClick: this.toggleStar }, todo.star ? '⭐️' : '☆'),
                React.createElement("button", { onClick: this.remove }, "remove")));
    };
    return Todo;
}(React.Component));

var TodoForm = (function (_super) {
    __extends(TodoForm, _super);
    function TodoForm() {
        var _this = _super.apply(this, arguments) || this;
        _this.state = {
            title: ''
        };
        _this.titleChangeHandler = function (e) {
            _this.setState(__assign({}, _this.state, { title: e.currentTarget.value }));
        };
        _this.titleKeyDownHandler = function (e) {
            if (e.keyCode !== 13 || _this.state.title === '')
                return;
            _this.props.addTodo({ "title": _this.state.title });
            _this.setState({ title: '' });
        };
        return _this;
    }
    TodoForm.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    };
    TodoForm.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("input", { type: "text", placeholder: "Add Todo...", value: this.state.title, onChange: this.titleChangeHandler, onKeyDown: this.titleKeyDownHandler }));
    };
    return TodoForm;
}(React.Component));

// import 'whatwg-fetch'
var url = 'http://localhost:8080/api/1/todo/';
var fetchOption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
};

function readTodos() {
    return fetch(url).then(function (response) { return response.json(); });
}
function addTodo(todo) {
    var option = __assign({}, fetchOption, { body: JSON.stringify(todo) });
    return fetch(url, option).then(function (response) { return response.json(); });
}
function removeTodo(id) {
    return fetch(url + id, { method: 'DELETE' });
}
function updateTodo(todo) {
    var option = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    };
    return fetch(url + todo.id, option).then(function (response) { return response.json(); });
}

var TodoList = (function (_super) {
    __extends(TodoList, _super);
    function TodoList() {
        var _this = _super.call(this) || this;
        _this.state = {
            todoDict: {},
            todoDictIndex: []
        };
        _this.addTodo = function (todo) {
            addTodo(todo).then(function (todo) {
                _this.setState({
                    todoDictIndex: _this.state.todoDictIndex.concat([todo.id]),
                    todoDict: __assign({}, _this.state.todoDict, (_a = {}, _a[todo.id] = todo, _a))
                });
                var _a;
            });
        };
        _this.updateTodo = function (todo) {
            updateTodo(todo);
            _this.setState({ todoDict: __assign({}, _this.state.todoDict, (_a = {}, _a[todo.id] = todo, _a)) });
            var _a;
        };
        _this.removeTodo = function (id) {
            // if (!confirm('削除しますか？')) return
            removeTodo(id);
            var todoDict = __assign({}, _this.state.todoDict);
            delete todoDict[id];
            _this.setState({
                todoDict: todoDict,
                todoDictIndex: _this.state.todoDictIndex.filter(function (v) { return v !== id; })
            });
        };
        readTodos().then(function (todos) {
            _this.setState({
                todoDictIndex: todos.map(function (todo) { return todo.id; }),
                todoDict: todos.reduce(function (hash, todo) { return (hash[todo.id] = todo, hash); }, {}),
            });
        });
        return _this;
    }
    TodoList.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    };
    TodoList.prototype.render = function () {
        var _this = this;
        var Todos = this.state.todoDictIndex.map(function (id) {
            return React.createElement(Todo, { key: id, todo: _this.state.todoDict[id], update: _this.updateTodo, remove: _this.removeTodo });
        });
        return React.createElement("div", null,
            React.createElement(TodoForm, { addTodo: this.addTodo }),
            Todos);
    };
    return TodoList;
}(React.Component));

ReactDOM.render(React.createElement(TodoList, null), document.getElementById('react-root'));

}(React,ReactDOM));

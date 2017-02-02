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

var EditableText = (function (_super) {
    __extends(EditableText, _super);
    function EditableText() {
        var _this = _super.apply(this, arguments) || this;
        _this.state = { editValue: null };
        _this.editStart = function () {
            var editValue = _this.props.defaultValue != null && _this.props.value === '' ?
                _this.props.defaultValue : _this.props.value;
            _this.setState({ editValue: editValue }, function () {
                _this.refs.input.focus();
                _this.refs.input.select();
            });
        };
        _this.editEnd = function () {
            var editValue = _this.state.editValue;
            if (editValue != null && editValue !== _this.props.value) {
                _this.props.update(editValue);
            }
            _this.setState({ editValue: null });
        };
        _this.onChange = function (e) {
            _this.setState({ editValue: e.currentTarget.value });
        };
        _this.onKeyDown = function (e) {
            switch (e.keyCode) {
                case 13:
                    _this.editEnd();
                    break;
                case 27:
                    _this.setState({ editValue: null });
                    break;
            }
        };
        return _this;
    }
    EditableText.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    };
    EditableText.prototype.render = function () {
        return React.createElement("label", { className: "EditableText" }, this.state.editValue == null ?
            React.createElement("span", { onDoubleClick: this.editStart }, this.props.children || this.props.value)
            :
                React.createElement("span", { className: "EditableText-popup" },
                    React.createElement("input", { className: "EditableText-input", ref: "input", type: this.props.type, value: this.state.editValue, onChange: this.onChange, onBlur: this.editEnd, onKeyDown: this.onKeyDown })));
    };
    return EditableText;
}(React.Component));

var paddingZero = function (num) { return ('0' + num).slice(-2); };
function checkDate(time_limit) {
    var _a = time_limit.split('-'), year = _a[0], month = _a[1], date = _a[2];
    if (year.length !== 4) {
        return false;
    }
    var time = new Date(+year, +month - 1, +date);
    var checkTime_limit = getTimeFormat(time.getFullYear(), time.getMonth() + 1, time.getDate());
    return time_limit === checkTime_limit;
}
function getTimeFormat(year, month, date) {
    return year + "-" + paddingZero(month) + "-" + paddingZero(date);
}

var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        var _this = _super.apply(this, arguments) || this;
        _this.state = {
            editTitle: null
        };
        _this.toggleDone = function () {
            var todo = _this.props.todo;
            _this.props.update(__assign({}, todo, { done: !todo.done }));
        };
        _this.toggleStar = function () {
            var todo = _this.props.todo;
            _this.props.update(__assign({}, todo, { star: !todo.star }));
        };
        _this.updateTitle = function (title) {
            if (title === '')
                return;
            _this.props.update(__assign({}, _this.props.todo, { title: title }));
        };
        _this.updateTimeLimit = function (time_limit) {
            if (!time_limit) {
                _this.props.update(__assign({}, _this.props.todo, { time_limit: null }));
                return;
            }
            if (!checkDate(time_limit)) {
                alert(time_limit + "\u306F\u7121\u52B9\u306A\u65E5\u4ED8\u3067\u3059\n" + (_this.props.todo.time_limit || '[未設定]') + "\u306B\u623B\u3057\u307E\u3057\u305F");
                time_limit = _this.props.todo.time_limit;
            }
            _this.props.update(__assign({}, _this.props.todo, { time_limit: time_limit }));
        };
        _this.remove = function () {
            _this.props.remove(_this.props.todo.id);
        };
        return _this;
    }
    Todo.prototype.Time = function (time_limit) {
        var _a = time_limit.split('-'), year = _a[0], month = _a[1], date = _a[2];
        return React.createElement("time", { dateTime: time_limit, title: time_limit },
            month,
            "/",
            date);
    };
    Todo.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    };
    Todo.prototype.render = function () {
        var todo = this.props.todo;
        return React.createElement("div", { className: "Todo" },
            React.createElement("div", { className: "Todo-checkbox" },
                React.createElement("input", { type: "checkbox", checked: todo.done, onChange: this.toggleDone })),
            React.createElement("div", { className: 'Todo-contents' + (todo.done ? ' Todo-done' : '') },
                React.createElement("div", { className: "Todo-header" },
                    React.createElement(EditableText, { type: "date", value: todo.time_limit || '', defaultValue: '2017-01-01', update: this.updateTimeLimit },
                        "\uD83D\uDDD3",
                        todo.time_limit),
                    React.createElement("span", { className: "Todo-remove", onClick: this.remove }, "\u274C")),
                React.createElement("div", { className: "Todo-title" },
                    React.createElement("span", { className: "Todo-star", onClick: this.toggleStar }, todo.star ? '⭐️' : '☆'),
                    React.createElement(EditableText, { value: todo.title, update: this.updateTitle }))));
    };
    return Todo;
}(React.Component));

var TodoForm = (function (_super) {
    __extends(TodoForm, _super);
    function TodoForm() {
        var _this = _super.apply(this, arguments) || this;
        _this.state = {
            title: '',
            limit_time: null
        };
        _this.titleChangeHandler = function (e) {
            _this.setState({ title: e.currentTarget.value });
        };
        _this.titleKeyDownHandler = function (e) {
            if (e.keyCode !== 13 || _this.state.title === '')
                return;
            _this.props.addTodo({
                title: _this.state.title,
                time_limit: _this.state.limit_time
            });
            _this.setState({
                title: '',
                limit_time: null
            });
        };
        _this.updateLimit_time = function (limit_time) {
            if (limit_time && !checkDate(limit_time)) {
                alert(limit_time + "\u306F\u7121\u52B9\u306A\u65E5\u4ED8\u3067\u3059\n" + (_this.state.limit_time || '[未設定]') + "\u306B\u623B\u3057\u307E\u3057\u305F");
                limit_time = null;
            }
            _this.setState({ limit_time: limit_time });
        };
        return _this;
    }
    TodoForm.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    };
    TodoForm.prototype.render = function () {
        return React.createElement("div", { className: "TodoForm" },
            React.createElement(EditableText, { value: this.state.limit_time || '', update: this.updateLimit_time, defaultValue: '2017-01-01' },
                "\uD83D\uDDD3",
                this.state.limit_time || '----/--/--'),
            React.createElement("br", null),
            React.createElement("input", { className: "TodoForm-input", type: "text", placeholder: "Write task and press Enter!", value: this.state.title, onChange: this.titleChangeHandler, onKeyDown: this.titleKeyDownHandler }));
    };
    return TodoForm;
}(React.Component));

var Filter;
(function (Filter) {
    Filter[Filter["all"] = 0] = "all";
    Filter[Filter["active"] = 1] = "active";
    Filter[Filter["completed"] = 2] = "completed";
})(Filter || (Filter = {}));
var list = [
    ['All', Filter.all],
    ['Active', Filter.active],
    ['Completed', Filter.completed]
];
var TodoFilter = function (props) {
    return React.createElement("ul", { className: "TodoFilter" }, list.map(function (_a) {
        var text = _a[0], filter = _a[1];
        return React.createElement("li", { className: filter === props.filter ? 'TodoFilter-selected' : undefined, onClick: function (_) { props.setFilter(filter); } }, text);
    }));
};

var Calender = (function (_super) {
    __extends(Calender, _super);
    function Calender() {
        var _this = _super.call(this) || this;
        _this.setNextMonth = function () {
            var _a = _this.state.date, year = _a[0], month = _a[1];
            if (11 < month) {
                _this.setState({ date: [year + 1, month - 11] });
            }
            else {
                _this.setState({ date: [year, month + 1] });
            }
        };
        _this.setPrevMonth = function () {
            var _a = _this.state.date, year = _a[0], month = _a[1];
            if (month < 2) {
                _this.setState({ date: [year - 1, month + 11] });
            }
            else {
                _this.setState({ date: [year, month - 1] });
            }
        };
        var today = new Date();
        _this.state = ({
            today: today,
            date: [today.getFullYear(), today.getMonth() + 1]
        });
        return _this;
    }
    Calender.prototype.eachDateContent = function (year, month, date) {
        return date;
    };
    // shouldComponentUpdate(nextProps: Props, nextState: State) {
    //     return this.props !== nextProps || this.state !== nextState
    // }
    Calender.prototype.render = function () {
        var _a = this.state.date, year = _a[0], month = _a[1];
        var firstDay = new Date(year, month - 1, 1).getDay();
        var lastDate = new Date(year, month, 0).getDate();
        var eachDateContent = this.props.eachDateContent || this.eachDateContent;
        var tr = [];
        for (var i = 1 - firstDay; i <= lastDate; i += 7) {
            var td = new Array(7);
            for (var j = 0; j < 7; ++j) {
                var date = i + j;
                var content = (date <= 0 || lastDate < date) ? undefined : eachDateContent(year, month, date);
                td.push(React.createElement("td", { key: "td-" + date }, content));
            }
            tr.push(React.createElement("tr", { key: "tr-" + i }, td));
        }
        return React.createElement("div", { className: "Calender" },
            React.createElement("div", { className: "Calender-header", style: { textAlign: 'center' } },
                React.createElement("button", { onClick: this.setPrevMonth }, "-"),
                React.createElement("span", null,
                    year,
                    "\u5E74",
                    month,
                    "\u6708"),
                React.createElement("button", { onClick: this.setNextMonth }, "+")),
            React.createElement("table", { className: "Calender-table" }, tr));
    };
    return Calender;
}(React.Component));

// import 'whatwg-fetch'
var url = 'http://localhost:8080/api/1/todo/';

function readTodos() {
    return fetch(url)
        .then(toJson)
        .catch(function (e) { return alert(e.message); });
}
function addTodo(todo) {
    var option = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    };
    return fetch(url, option)
        .then(toJson)
        .catch(function (e) { return alert(e.message); });
}
function removeTodo(id) {
    return fetch(url + id, { method: 'DELETE' })
        .then(toJson)
        .catch(function (e) { return alert(e.message); });
}
function updateTodo(todo) {
    var option = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    };
    return fetch(url + todo.id, option)
        .then(toJson)
        .catch(function (e) { return alert(e.message); });
}
function toJson(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    if (response.headers.get('content-type') === 'application/json;charset=UTF-8') {
        return response.json();
    }
    return response.text();
}

var TodoList = (function (_super) {
    __extends(TodoList, _super);
    function TodoList() {
        var _this = _super.call(this) || this;
        _this.state = {
            todoDict: {},
            todoDictIndex: [],
            filter: Filter.all
        };
        _this.addTodo = function (todo) {
            addTodo(todo).then(function (todo) {
                if (!todo)
                    return;
                var _a = _this.state, todoDictIndex = _a.todoDictIndex, todoDict = _a.todoDict;
                _this.setState({
                    todoDictIndex: _this.checkFilter(todo) ? todoDictIndex.concat([todo.id]) : todoDictIndex,
                    todoDict: __assign({}, todoDict, (_b = {}, _b[todo.id] = todo, _b))
                });
                var _b;
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
        _this.setFilter = function (filter) {
            var todoDictIndex = Object.keys(_this.state.todoDict).map(function (v) { return +v; }).filter(function (id) {
                return _this.checkFilter(_this.state.todoDict[id], filter);
            });
            _this.setState({ filter: filter, todoDictIndex: todoDictIndex });
        };
        _this.calenderContent = function (year, month, date) {
            var time = getTimeFormat(year, month, date);
            var Todos = _this.state.todoDictIndex
                .filter(function (id) { return time === _this.state.todoDict[id].time_limit; })
                .map(function (id) {
                return React.createElement(Todo, { key: id, todo: _this.state.todoDict[id], update: _this.updateTodo, remove: _this.removeTodo });
            });
            return React.createElement("div", { className: "calenderContent" },
                React.createElement("div", { style: { textAlign: 'right' } }, date),
                Todos);
        };
        readTodos().then(function (todos) {
            if (!todos)
                return;
            _this.setState({
                todoDictIndex: todos.map(function (todo) { return todo.id; }),
                todoDict: todos.reduce(function (hash, todo) { return (hash[todo.id] = todo, hash); }, {}),
            });
        });
        return _this;
    }
    TodoList.prototype.checkFilter = function (todo, filter) {
        if (filter === void 0) { filter = this.state.filter; }
        if (filter === Filter.all)
            return true;
        return todo.done === (filter === Filter.completed);
    };
    TodoList.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    };
    TodoList.prototype.render = function () {
        var _this = this;
        var Todos = this.state.todoDictIndex.map(function (id) {
            return React.createElement("li", null,
                React.createElement(Todo, { key: id, todo: _this.state.todoDict[id], update: _this.updateTodo, remove: _this.removeTodo }));
        });
        return React.createElement("div", null,
            React.createElement("h1", { className: "title" }, "Todo Calender"),
            React.createElement("hr", null),
            React.createElement("div", { className: "App" },
                React.createElement("div", null,
                    React.createElement(Calender, { eachDateContent: this.calenderContent })),
                React.createElement("div", null,
                    React.createElement(TodoForm, { addTodo: this.addTodo }),
                    React.createElement(TodoFilter, { filter: this.state.filter, setFilter: this.setFilter }),
                    React.createElement("ul", { className: "TodoList" }, Todos))));
    };
    return TodoList;
}(React.Component));

ReactDOM.render(React.createElement(TodoList, null), document.getElementById('react-root'));

}(React,ReactDOM));

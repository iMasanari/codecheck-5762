import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Todo from './Todo'
import TodoForm from './TodoForm'
import TodoFilter, { Filter } from './TodoFilter'
import Calender from './Calender'
import { getTimeFormat } from './checkDate'
import * as api from './api'

interface Props extends React.ClassAttributes<TodoList> {
}
interface State {
    todoDict: { [key: number]: api.Todo }
    todoDictIndex: number[]
    filter: Filter
}

export default class TodoList extends React.Component<Props, State> {
    state: State = {
        todoDict: {},
        todoDictIndex: [],
        filter: Filter.all
    }

    constructor() {
        super()

        api.readTodos().then(todos => {
            if (!todos) return

            this.setState({
                todoDictIndex: todos.map(todo => todo.id),
                todoDict: todos.reduce((hash, todo) => (hash[todo.id] = todo, hash), {} as State['todoDict']),
            })
        })
    }

    addTodo = (todo: Partial<api.Todo>) => {
        api.addTodo(todo).then(todo => {
            if (!todo) return

            const {todoDictIndex, todoDict} = this.state

            this.setState({
                todoDictIndex: this.checkFilter(todo) ? [...todoDictIndex, todo.id] : todoDictIndex,
                todoDict: { ...todoDict, [todo.id]: todo }
            })
        })
    }
    updateTodo = (todo: api.Todo) => {
        api.updateTodo(todo)
        this.setState({ todoDict: { ...this.state.todoDict, [todo.id]: todo } })
    }

    removeTodo = (id: number) => {
        // if (!confirm('削除しますか？')) return
        api.removeTodo(id)

        const todoDict = { ...this.state.todoDict }
        delete todoDict[id]

        this.setState({
            todoDict,
            todoDictIndex: this.state.todoDictIndex.filter(v => v !== id)
        })
    }
    checkFilter(todo: api.Todo, filter = this.state.filter) {
        if (filter === Filter.all) return true

        return todo.done === (filter === Filter.completed)
    }
    setFilter = (filter: Filter) => {
        const todoDictIndex = Object.keys(this.state.todoDict).map(v => +v).filter(id =>
            this.checkFilter(this.state.todoDict[id], filter)
        )

        this.setState({ filter, todoDictIndex })
    }
    calenderContent = (year: number, month: number, date: number) => {
        const time = getTimeFormat(year, month, date)
        const Todos = this.state.todoDictIndex
            .filter(id => time === this.state.todoDict[id].time_limit)
            .map(id =>
                <Todo key={id}
                    todo={this.state.todoDict[id]}
                    update={this.updateTodo}
                    remove={this.removeTodo} />
            )

        return <div className="calenderContent">
            <div style={{ textAlign: 'right' }}>{date}</div>
            {Todos}
        </div>
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.props !== nextProps || this.state !== nextState
    }
    render() {
        const Todos = this.state.todoDictIndex.map(id =>
            <li>
                <Todo key={id}
                    todo={this.state.todoDict[id]}
                    update={this.updateTodo}
                    remove={this.removeTodo} />
            </li>
        )

        return <div>
            <h1 className="title">Todo Calender</h1>
            <hr />
            <div className="App">
                <div>
                    <Calender eachDateContent={this.calenderContent} />
                </div>
                <div>
                    <TodoForm addTodo={this.addTodo} />
                    <TodoFilter filter={this.state.filter} setFilter={this.setFilter} />
                    <ul className="TodoList">{Todos}</ul>
                </div>
            </div>
        </div>
    }
}

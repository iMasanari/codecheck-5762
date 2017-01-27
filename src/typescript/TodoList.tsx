import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Todo from './Todo'
import TodoForm from './TodoForm'
import * as api from './api'

interface Props extends React.ClassAttributes<TodoList> {
}
interface State {
    todoDict: { [key: number]: api.Todo }
    todoDictIndex: number[]
}

export default class TodoList extends React.Component<Props, State> {
    state: State = {
        todoDict: {},
        todoDictIndex: []
    }

    constructor() {
        super()

        api.readTodos().then(todos => {
            this.setState({
                todoDictIndex: todos.map(todo => todo.id),
                todoDict: todos.reduce((hash, todo) => (hash[todo.id] = todo, hash), {} as State['todoDict']),
            })
        })
    }

    addTodo = (todo: Partial<api.Todo>) => {
        api.addTodo(todo).then(todo => {
            this.setState({
                todoDictIndex: [...this.state.todoDictIndex, todo.id],
                todoDict: { ...this.state.todoDict, [todo.id]: todo }
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
    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.props !== nextProps || this.state !== nextState
    }
    render() {
        const Todos = this.state.todoDictIndex.map(id =>
            <Todo key={id}
                todo={this.state.todoDict[id]}
                update={this.updateTodo}
                remove={this.removeTodo} />
        )

        return <div>
            <TodoForm addTodo={this.addTodo} />
            {Todos}
        </div>
    }
}

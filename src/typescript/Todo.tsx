import * as React from 'react'
import * as ReactDOM from 'react-dom'

import TodoList from './TodoList'
import * as api from './api'

interface Props extends React.ClassAttributes<Todo> {
    todo: api.Todo
    update: typeof TodoList.prototype.updateTodo
    remove: typeof TodoList.prototype.removeTodo
}
interface State {
}

export default class Todo extends React.Component<Props, State> {
    completedStyle = {
        textDecoration: 'line-through',
        color: 'gray'
    }
    toggleDone = () => {
        const {todo} = this.props
        this.props.update({ ...todo, done: !todo.done })
    }
    toggleStar = () => {
        const {todo} = this.props
        this.props.update({ ...todo, star: !todo.star })
    }
    remove = () => {
        this.props.remove(this.props.todo.id)
    }
    Time(time_limit: string) {
        const [year, month, date] = time_limit.split('-')

        return <span>
            {'（'}
            <time dateTime={time_limit} title={time_limit}>{month}/{date}</time>
            {'）'}
        </span>
    }
    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.props !== nextProps || this.state !== nextState
    }
    render() {
        const {todo} = this.props

        return <div>
            <div>
                <input type="checkbox"
                    checked={todo.done}
                    onChange={this.toggleDone}
                    />
                <span style={todo.done ? this.completedStyle : undefined}>
                    {todo.title}
                    {todo.time_limit ? this.Time(todo.time_limit) : undefined}
                </span>
                <span onClick={this.toggleStar}>
                    {todo.star ? '⭐️' : '☆'}
                </span>
                <button onClick={this.remove}>remove</button>
            </div>
        </div>
    }
}

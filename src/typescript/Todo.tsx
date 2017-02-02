import * as React from 'react'
import * as ReactDOM from 'react-dom'

import TodoList from './TodoList'
import EditableText from './EditableText'
import { checkDate } from './checkDate'
import * as api from './api'

interface Props extends React.ClassAttributes<Todo> {
    todo: api.Todo
    update: typeof TodoList.prototype.updateTodo
    remove: typeof TodoList.prototype.removeTodo
}
interface State {
    editTitle: string | null
}

export default class Todo extends React.Component<Props, State> {
    state: State = {
        editTitle: null
    }
    refs: {
        title: HTMLInputElement
    }

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
    updateTitle = (title: string) => {
        if (title === '') return
        this.props.update({ ...this.props.todo, title })
    }
    updateTimeLimit = (time_limit: string | null) => {
        if (!time_limit) {
            this.props.update({ ...this.props.todo, time_limit: null })
            return
        }

        if (!checkDate(time_limit)) {
            alert(`${time_limit}は無効な日付です\n${this.props.todo.time_limit || '[未設定]'}に戻しました`)
            time_limit = this.props.todo.time_limit
        }

        this.props.update({ ...this.props.todo, time_limit })
    }
    remove = () => {
        this.props.remove(this.props.todo.id)
    }
    Time(time_limit: string) {
        const [year, month, date] = time_limit.split('-')

        return <time dateTime={time_limit} title={time_limit}>{month}/{date}</time>
    }
    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.props !== nextProps || this.state !== nextState
    }
    render() {
        const {todo} = this.props

        return <div className="Todo">
                <input type="checkbox"
                    checked={todo.done}
                    onChange={this.toggleDone}
                    />
                <span style={todo.done ? this.completedStyle : undefined}>
                    <EditableText value={todo.title} update={this.updateTitle} />
                    <EditableText type="date"
                        value={todo.time_limit || ''}
                        defaultValue={'2017-01-01'}
                        update={this.updateTimeLimit}
                        >
                        🗓{todo.time_limit}
                    </EditableText>
                </span>
                <span onClick={this.toggleStar}>
                    {todo.star ? '⭐️' : '☆'}
                </span>
                <button onClick={this.remove}>remove</button>
        </div>
    }
}

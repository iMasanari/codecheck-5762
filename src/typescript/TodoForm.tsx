import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Todo from './Todo'
import * as api from './api'

interface Props extends React.ClassAttributes<TodoForm> {
    addTodo: (todo: Partial<api.Todo>) => void
}
interface State {
    title: string
}

export default class TodoForm extends React.Component<Props, State> {
    state: State = {
        title: ''
    }
    titleChangeHandler: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = e => {
        this.setState({ ...this.state, title: e.currentTarget.value })
    }
    titleKeyDownHandler: React.EventHandler<React.KeyboardEvent<HTMLInputElement>> = e => {
        if (e.keyCode !== 13 || this.state.title === '') return

        this.props.addTodo({ "title": this.state.title })
        this.setState({ title: '' })
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.props !== nextProps || this.state !== nextState
    }
    render() {
        return <div>
            <input type="text" placeholder="Add Todo..."
                value={this.state.title}
                onChange={this.titleChangeHandler}
                onKeyDown={this.titleKeyDownHandler}
                />
        </div>
    }
}
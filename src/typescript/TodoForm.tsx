import * as React from 'react'
import * as ReactDOM from 'react-dom'

import EditableText from './EditableText'
import * as api from './api'

interface Props extends React.ClassAttributes<TodoForm> {
    addTodo: (todo: Partial<api.Todo>) => void
}
interface State {
    title: string
    limit_time: string | null
}

export default class TodoForm extends React.Component<Props, State> {
    state: State = {
        title: '',
        limit_time: null
    }
    titleChangeHandler: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = e => {
        this.setState({ title: e.currentTarget.value })
    }
    titleKeyDownHandler: React.EventHandler<React.KeyboardEvent<HTMLInputElement>> = e => {
        if (e.keyCode !== 13 || this.state.title === '') return

        this.props.addTodo({ "title": this.state.title })
        this.setState({
            title: '',
            limit_time: null
        })
    }
    updateLimit_time = (limit_time: string) => {
        this.setState({ limit_time })
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
            <EditableText
                value={this.state.limit_time || ''}
                update={this.updateLimit_time}
                defaultValue={'2017-01-01'}
                >
                🗓{this.state.limit_time}
            </EditableText>
        </div>
    }
}
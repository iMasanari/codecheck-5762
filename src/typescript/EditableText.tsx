import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface Props extends React.ClassAttributes<EditableText> {
    value: string
    type?: string
    defaultValue?: string
    update: (value: string) => any
}
interface State {
    editValue: string | null
}

export default class EditableText extends React.Component<Props, State> {
    state: State = { editValue: null }
    refs: { input: HTMLInputElement }

    editStart = () => {
        const editValue = this.props.defaultValue != null && this.props.value === '' ?
            this.props.defaultValue : this.props.value
        this.setState({ editValue }, () => {
            this.refs.input.focus()
            this.refs.input.select()
        })
    }
    editEnd = () => {
        const {editValue} = this.state

        if (editValue != null && editValue !== this.props.value) {
            this.props.update(editValue!)
        }
        this.setState({ editValue: null })
    }
    onChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> = e => {
        this.setState({ editValue: e.currentTarget.value })
    }
    onKeyDown: React.EventHandler<React.KeyboardEvent<HTMLInputElement>> = e => {
        switch (e.keyCode) {
            case 13: // Enter
                this.editEnd()
                break
            case 27: // Esc 
                this.setState({ editValue: null })
                break
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return this.props !== nextProps || this.state !== nextState
    }
    render() {
        return <label>
            {this.state.editValue == null ?
                <span onDoubleClick={this.editStart}>
                    {this.props.children != null ? this.props.children : this.props.value}
                </span>
                :
                <input ref="input"
                    type={this.props.type}
                    value={this.state.editValue}
                    onChange={this.onChange}
                    onBlur={this.editEnd}
                    onKeyDown={this.onKeyDown}
                    />
            }
        </label>
    }
}
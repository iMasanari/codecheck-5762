import * as React from 'react'
import { State as TodoListState } from './TodoList'
import { getTimeFormat } from './checkDate'

interface Props extends React.ClassAttributes<CalenderCell> {
    year: number
    month: number
    date: number
    todoDict: TodoListState['todoDict']
    todoDictIndex: TodoListState['todoDictIndex']
    hoverCallback: (time_limit: string | null) => any
}

interface State {
    isHover: boolean
}
export default class CalenderCell extends React.Component<Props, State> {
    time_limitLog: string | null = null

    onMouseOver = () => {
        const {year, month, date} = this.props
        const time_limit = getTimeFormat(year, month, date)
        if (this.time_limitLog !== time_limit) {
            this.props.hoverCallback(time_limit)
            this.time_limitLog = time_limit
        }
    }
    onMouseOut = () => {
        if (this.time_limitLog !== null) {
            this.props.hoverCallback(null)
            this.time_limitLog = null
        }
    }

    render() {
        const {year, month, date} = this.props
        const time = getTimeFormat(year, month, date)
        const todos = this.props.todoDictIndex
            .filter(id => time === this.props.todoDict[id].time_limit)
            .map(id => this.props.todoDict[id])

        const len = todos.length
        const star = todos.filter(todo => todo.star).length
        const unstar = len - star

        return <div className="calenderContent" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
            <div style={{ textAlign: 'right', fontSize: '20px' }}>{date}</div>
            <div style={{ textAlign: 'center' }}>
                {star ? `⭐️${star === 1 ? '' : star}` : undefined}
            </div>
            <div style={{ textAlign: 'center' }}>
                {unstar ? `☆${unstar === 1 ? '' : unstar}` : undefined}
            </div>
        </div>
    }
}
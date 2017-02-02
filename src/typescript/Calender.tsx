import * as React from 'react'
import * as ReactDOM from 'react-dom'

import * as api from './api'

interface Props extends React.ClassAttributes<Calender> {
    eachDateContent?: (year: number, month: number, date: number) => any
}
interface State {
    today: Date
    date: [number, number]
}

export default class Calender extends React.Component<Props, State> {
    constructor() {
        super()
        const today = new Date()

        this.state = ({
            today,
            date: [today.getFullYear(), today.getMonth() + 1]
        })
    }
    setNextMonth = () => {
        const [year, month] = this.state.date

        if (11 < month) {
            this.setState({ date: [year + 1, month - 11] })
        }
        else {
            this.setState({ date: [year, month + 1] })
        }
    }
    setPrevMonth = () => {
        const [year, month] = this.state.date

        if (month < 2) {
            this.setState({ date: [year - 1, month + 11] })
        }
        else {
            this.setState({ date: [year, month - 1] })
        }
    }
    eachDateContent(year: number, month: number, date: number) {
        return date
    }

    // shouldComponentUpdate(nextProps: Props, nextState: State) {
    //     return this.props !== nextProps || this.state !== nextState
    // }
    render() {
        const [year, month] = this.state.date
        const firstDay = new Date(year, month - 1, 1).getDay()
        const lastDate = new Date(year, month, 0).getDate()
        const eachDateContent = this.props.eachDateContent || this.eachDateContent

        const tr = []
        for (let i = 1 - firstDay; i <= lastDate; i += 7) {
            const td = new Array(7)

            for (let j = 0; j < 7; ++j) {
                const date = i + j
                const content = (date <= 0 || lastDate < date) ? undefined : eachDateContent(year, month, date)
                td.push(<td key={`td-${date}`}>{content}</td>)
            }

            tr.push(<tr key={`tr-${i}`}>{td}</tr>)
        }

        return <div className="Calender">
            <div style={{ textAlign: 'center' }}>
                <button onClick={this.setPrevMonth}>-</button>
                <span>{year}年{month}月</span>
                <button onClick={this.setNextMonth}>+</button>
            </div>
            <table className="Calender-table">{tr}</table>
        </div>
    }
}
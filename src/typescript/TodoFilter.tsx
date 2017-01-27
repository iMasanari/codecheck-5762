import * as React from 'react'
import * as ReactDOM from 'react-dom'

import TodoList from './TodoList'

export const enum Filter {
    all, active, completed
}

const list: [string, Filter][] = [
    ['All', Filter.all],
    ['Active', Filter.active],
    ['Completed', Filter.completed]
]
const liStyle: React.CSSProperties = {
    display: 'inline-block',
    width: '80px',
    textAlign: 'center'
}
const selectedStyle: React.CSSProperties = {
    ...liStyle,
    background: '#eee'
}

interface Props extends React.ClassAttributes<null> {
    filter: Filter
    setFilter: typeof TodoList.prototype.setFilter
}

export default (props: Props) =>
    <ul>
        {list.map(([text, filter]) =>
            <li style={filter === props.filter ? selectedStyle : liStyle}
                onClick={_ => { props.setFilter(filter) } }
                >
                {text}
            </li>
        )}
    </ul>

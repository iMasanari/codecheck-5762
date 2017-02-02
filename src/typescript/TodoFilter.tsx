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

interface Props extends React.ClassAttributes<null> {
    filter: Filter
    setFilter: typeof TodoList.prototype.setFilter
}

export default (props: Props) =>
    <ul className="TodoFilter">
        {list.map(([text, filter]) =>
            <li className={filter === props.filter ? 'TodoFilter-selected' : undefined}
                onClick={_ => { props.setFilter(filter) } }
                >
                {text}
            </li>
        )}
    </ul>

export default TodoList;
import * as React from 'react';
class TodoList extends React.Component {
    render() {
        return React.createElement("div", null, this.props.data);
    }
}

// import 'whatwg-fetch'

export interface Tag {
    id: number
    name: string
}

export interface Todo {
    done: boolean
    id: number
    star: boolean
    tags: Tag[]
    time_limit: string | null
    title: string
}

const url = 'http://localhost:8080/api/1/todo/'

const fetchOption: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
}
export function readTodo(id: number) {
    return fetch(url + id)
        .then<Todo>(toJson)
        .catch(e => alert(e.message))
}

export function readTodos() {
    return fetch(url)
        .then<Todo[]>(toJson)
        .catch(e => alert(e.message))
}
export function addTodo(todo: Partial<Todo>) {
    const option = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    }
    return fetch(url, option)
        .then<Todo>(toJson)
        .catch(e => alert(e.message))
}
export function removeTodo(id: number) {
    return fetch(url + id, { method: 'DELETE' })
        .then<''>(toJson)
        .catch(e => alert(e.message))
}
export function updateTodo(todo: Partial<Todo>) {
    const option = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    }
    return fetch(url + todo.id, option)
        .then<Todo>(toJson)
        .catch(e => alert(e.message))
}

function toJson(response: Response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    
    if (response.headers.get('content-type') === 'application/json;charset=UTF-8') {
        return response.json()
    }

    return response.text() as Promise<any>
}
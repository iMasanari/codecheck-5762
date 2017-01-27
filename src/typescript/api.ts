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
    return fetch(url + id).then(response => response.json() as Promise<Todo>)
}

export function readTodos() {
    return fetch(url).then(response => response.json() as Promise<Todo[]>)
}
export function addTodo(todo: Partial<Todo>) {
    const option = { ...fetchOption, body: JSON.stringify(todo) }
    return fetch(url, option).then(response => response.json() as Promise<Todo>)
}
export function removeTodo(id: number) {
    return fetch(url + id, { method: 'DELETE' })
}
export function updateTodo(todo: Partial<Todo>) {
    const option = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
    }
    return fetch(url + todo.id, option).then(response => response.json() as Promise<Todo>)
}
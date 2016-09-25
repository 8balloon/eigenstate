import { Provider, logVerbosely } from '../../src'

const stateDef = {
  todos: [{
    text: "make Todo list",
    complete: false
  }],
  addTodo: (todo, state) => ({
    todos: [].concat(state.todos, todo)
  }),
  deleteTodo: (index, state) => {

    var newTodos = state.todos.slice()
    newTodos.splice(index, 1)

    return { todos: newTodos }
  },
  editTodo: (payload, state) => {
    const { index, text } = payload

    var newTodos = state.todos.slice()
    newTodos[index] = Object.assign({}, newTodos[index], { text })

    return { todos: newTodos }
  },
  completeTodo: (index, state) => {

    var newTodos = state.todos.slice()
    newTodos[index].complete = true

    return { todos: newTodos }
  },
  completeAll: (payload, state) => ({
    todos: state.todos.map(todo => Object.assign({}, todo, {complete: true}))
  }),
  clearCompleted: (payload, state) => ({
    todos: state.todos.filter(todo => !todo.complete)
  })
}

const TodoList = (props) => {

  console.log("PROPS.todos.length:", props.todos.length)

  return (
    <div>
      <div>TO DO:</div>
      <div>
        {
          props.todos.map((todo, index) => (
            <div>
              <div>
                {
                  todo.text
                }
              </div>
              <div onClick={() => todo.completed ? props.completeTodo(index) : props.deleteTodo(index)}>
                {
                  todo.completed
                }
              </div>
            </div>
          ))
        }
      </div>
      <div>
        <input>
          New Todo
        </input>
        <div>
          Add Todo
        </div>
      </div>
    </div>
  )
}

export default function Todos() {
  return (
    <Provider stateDef={stateDef}>
      <TodoList />
    </Provider>
  )
}

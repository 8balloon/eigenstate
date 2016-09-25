import { Provider, logVerbosely } from '../../src'

const newTodo = "new todo"

const stateDef = {

  todos: [{
    text: "make Todo list",
    complete: false
  }],
  potentialTodo: newTodo,

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
  }),
  setPotentialTodo: (text, state) => ({
    potentialTodo: text
  }),
  considerTodo: (text, state) => ({
    potentialTodo: text
  }),
  acceptTodo: (_, state) => {
    state.addTodo({
      text: state.potentialTodo,
      complete: false
    })
    // state.resetPotentialTodo()
  },
  resetPotentialTodo: (_, state) => ({
    potentialTodo: newTodo
  })
}

const TodoList = (props) => (
  <div>
    <div>TO DO:</div>
    <div>
      {
        props.todos.map((todo, index) => (
          <div key={index}>
            <div>
              { todo.text }
            </div>
            <div onClick={() => todo.completed ? props.completeTodo(index) : props.deleteTodo(index)}>
              { todo.completed }
            </div>
          </div>
        ))
      }
    </div>
    <div>
      <input id="todoInput" value={props.potentialTodo} onChange={(event) => props.setPotentialTodo(event.target.value)} />
      <div onClick={props.acceptTodo}>
        Add Todo
      </div>
    </div>
  </div>
)

export default function Todos() {
  return (
    <Provider stateDef={stateDef} onChange={logVerbosely}>
      <TodoList />
    </Provider>
  )
}

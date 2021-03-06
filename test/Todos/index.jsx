import { Provider, Store, verboseLogger } from '../../src'

const newTodo = "new todo"

const todoStore = Store({

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
  editTodo: ({ index, text }, state) => {

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
  acceptPotentialTodo: (_, state) => {
    state.addTodo({
      text: state.potentialTodo,
      complete: false
    })
    state.resetPotentialTodo()
  },
  resetPotentialTodo: (_, state) => ({
    potentialTodo: newTodo
  })
})
todoStore.subscribe(verboseLogger)

const TodoList = (props) => (
  <div className="todoList">
    <div>TO DO LIST</div>
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
      <input className="todoInput" value={props.potentialTodo} onChange={(event) => props.setPotentialTodo(event.target.value)} />
      <div onClick={props.acceptPotentialTodo}>
        Add Todo
      </div>
    </div>
  </div>
)

export default function Todos() {
  return (
    <Provider store={todoStore}>
      <TodoList />
    </Provider>
  )
}

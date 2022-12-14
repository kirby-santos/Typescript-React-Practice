import React, {useCallback, useState, useEffect, useReducer, useRef} from 'react';
import './App.css';

const Heading = ({ title }: { title: string }) => 
  <h2>{title}</h2>;

const Box = ({ children }: { children : React.ReactNode }) => (
  <div style = {{
    padding: "1rem",
    fontWeight: "bold",
  }}>
    {children}
  </div>
);

const List: React.FunctionComponent<{
  items: string[];
  onClick?: (item: string) => void
}> = ({ items, onClick }) => (
  <ul>
    {items.map((item, index) => (
      <li key = {index} onClick={() => onClick?.(item)}>{item}</li>
    ))}
  </ul>
);

interface Payload {
  text: string;
}

interface Todo {
  id: number;
  done: boolean;
  text: string;
}

const Button: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({title, children, style, ...rest}) => (
  <button {...rest} style={{
    ...style,
    backgroundColor: "red",
    color: "white",
    fontSize: "xx-large",
  }}
  >{title ?? children}</button>
);

type ActionType = 
  | {type: "ADD", text: string}
  | {type: "REMOVE", id: number}

const Incrementer: React.FunctionComponent<{
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>
}> = ({value, setValue}) => (
  <Button onClick={() => setValue(value + 1)} title={`Add - ${value}`}/>
);

function App() {
  const onListClick = useCallback((item: string) => {
    alert(item)
  }, []);

  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    fetch("/data.json")
    .then(resp => resp.json())
    .then(data => {
      setPayload(data);
    });
  }, []);

  const [todos, dispatch] = useReducer((state: Todo[], action: ActionType) => {
    switch(action.type) {
      case "ADD":
        return [
          ...state,
          {
            id: state.length,
            text: action.text,
            done: false,
          }
        ];
        case "REMOVE":
          return state.filter(({id}) => id !== action.id);
        default:
          throw new Error();
    }
  }, []);

  const newTodoRef = useRef<HTMLInputElement>(null);

  const onAddTodo = useCallback(() => {
    if (newTodoRef.current) {
        dispatch({
        type: "ADD",
        text: newTodoRef.current.value,
      });
      newTodoRef.current.value = "";
    }
  }, []);

const [value, setValue] = useState(0);

  return (
    <div>
      <Heading title="Introduction"/>
      <Box>
        Hello there
      </Box>
      <List items={["one", "two", "three"]} onClick={onListClick}/>
      <Box>
        {JSON.stringify(payload)}
      </Box>
      <Incrementer value={value} setValue={setValue} />

      <Heading title="Todos" />
      {todos.map((todo) => (
        <div key={todo.id}>
          {todo.text}
          <button onClick={() => dispatch({
            type: "REMOVE",
            id: todo.id,
          })} >
            Remove
          </button>
        </div>
      ))}
      <div>
        <input type = "text" ref={newTodoRef} />
        <button onClick={onAddTodo}>Add Todo</button>
      </div>
    </div>
  );
}

export default App;

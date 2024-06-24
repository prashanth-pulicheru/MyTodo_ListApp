import { useEffect, useState } from 'react';
import './App.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState("");
  const [completeTodos, setCompleteTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [currentEditedItem, setCurrentEditedItem] = useState({});

  const handleTitleOnChange = (e) => {
    setNewTitle(e.target.value);
  }

  const handleDescriptionOnChange = (e) => {
    setNewDescription(e.target.value);
  }

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTitle && newDescription) {
      let newTodoItem = {
        title: newTitle,
        description: newDescription
      }

      let updatedTodoArr = [...allTodos, newTodoItem];
      setTodos(updatedTodoArr);
      localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
      setNewTitle('');
      setNewDescription('');
    }
  }

  const handleDeleteTodo = (index) => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);
  }

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = `${dd}-${mm}-${yyyy} at ${h}:${m}:${s}`;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn
    };

    let updatedCompletedArr = [...completeTodos, filteredItem];
    setCompleteTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  }

  const handleToDeleteCompleted = (index) => {
    let reducedCompletedTodo = [...completeTodos];
    reducedCompletedTodo.splice(index, 1);
    localStorage.setItem('completedTodos', JSON.stringify(reducedCompletedTodo));
    setCompleteTodos(reducedCompletedTodo);
  }

  useEffect(() => {
    let savedTodoList = JSON.parse(localStorage.getItem("todolist"));
    let saveCompletedTodoList = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodoList) {
      setTodos(savedTodoList);
    }
    if (saveCompletedTodoList) {
      setCompleteTodos(saveCompletedTodoList);
    }
  }, [])

  const handleEdit = (ind, item) => {
    setCurrentEdit(ind);
    setCurrentEditedItem(item);
  }

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => ({
      ...prev, title: value
    }));
  }

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => ({
      ...prev, description: value
    }));
  }

  const handleUpdateToDo = () => {
    let newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setTodos(newTodo);
    localStorage.setItem('todolist', JSON.stringify(newTodo));
    setCurrentEdit(null);
  }

  return (
    <div className="App">
      <h1>My_Todo_List</h1>
      <div className="todo_wrapper">
        <div className="todo_input">
          <div className="todo_input_item">
            <label>Title:</label>
            <input type="text" placeholder="What's the task title?" value={newTitle} onChange={handleTitleOnChange} />
          </div>
          <div className="todo_input_item">
            <label>Description:</label>
            <input value={newDescription} placeholder="What's the task description?" onChange={handleDescriptionOnChange} type="text" />
          </div>
          <div className="todo_input_item">
            <button type='button' className='primaryBtn' onClick={handleAddTodo}>Add</button>
          </div>
        </div>

        <div className="btn-area">
          <button className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}>Completed</button>
        </div>

        <div className="todo_list">
          {isCompleteScreen === false && allTodos.map((item, index) => {
            if (currentEdit === index) {
              return (
                <div className='edit__wrapper' key={index}>
                  <input placeholder='Updated Title'
                    onChange={(e) => handleUpdateTitle(e.target.value)}
                    value={currentEditedItem.title} />
                  <input placeholder='Updated Description'
                    onChange={(e) => handleUpdateDescription(e.target.value)}
                    value={currentEditedItem.description} />
                  <button
                    type="button"
                    onClick={handleUpdateToDo}
                    className="primaryBtn"
                  >
                    Update
                  </button>
                </div>
              )
            } else {
              return (
                <div className="todo_list_item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <DeleteOutlineIcon className='icon' onClick={() => handleDeleteTodo(index)} title="Delete?" />
                    <CheckIcon className='check-icon' onClick={() => handleComplete(index)} title="Complete?" />
                    <EditIcon className='check-icon' onClick={() => handleEdit(index, item)} title='Edit?' />
                  </div>
                </div>
              )
            }
          })}
          {isCompleteScreen === true && completeTodos.map((item, index) => {
            return (
              <div className="todo_list_item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed on: {item.completedOn}</small></p>
                </div>
                <div>
                  <DeleteOutlineIcon className='icon' onClick={() => handleToDeleteCompleted(index)} title="Delete?" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;

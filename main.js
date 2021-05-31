
class Task {
  constructor(task, completed, dateCompleted) {
    this.uuid = UUID.generate();
    this.name = task;
    this.completed = completed;
    this.dateCompleted = dateCompleted;
  }
}


class StorageService {
  constructor() {
    this.tasks = [];
    this.populateTasks();
  }

  populateTasks() {
    let tasks = [];
    let tasksAsString = localStorage.getItem('tasks');
    if (tasksAsString) {
      const taskObjects = JSON.parse(tasksAsString);
      tasks = taskObjects.map(t => new Task(t.name, t.completed, t.dateCompleted));
    }

    this.tasks = tasks;
  }

  addTask(task) {
    this.tasks.push(task);

    const tasksAsString = JSON.stringify(this.tasks);
    localStorage.setItem('tasks', tasksAsString);
  }

  updateTask(row) {
    let updatedTask = undefined; 
    for (const task of this.tasks) {
      if (task.uuid == row.id) {
        task.completed= true;
        task.dateCompleted = formatDate(task);
        updatedTask = task;
        console.log(updatedTask);
      }
    }
    
    this.removeTask(row.id);
    this.addTask(updatedTask);

  }

  removeTask(uuid) {
    this.tasks = this.tasks.filter(tasks => tasks.uuid != uuid);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

class UserInterface {
  constructor() {
    this.storage = new StorageService();
    this.table = document.getElementById('table-body');
    this.taskInput = document.getElementById('task-input');
  }

  initialize() {
    this.initializeFormSubmitListener();
    this.populateTasksTable();
  }

  initializeFormSubmitListener() {
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();

      this.createTaskFromInput();
      this.clearFormInputs();
      this.populateTasksTable();
      this.taskInput.value = '';
    });
  }

  createTaskFromInput() {
    const taskName = this.taskInput.value;

    const task = new Task(taskName, false, null);

    this.storage.addTask(task);
  }

  populateTasksTable() {
    this.clearTable();

    for (const task of this.storage.tasks) {
      this.addTaskToTable(task);
    }
  }

  clearTable() {
    let length = this.table.children.length;
    for (let i = 0; i < length; i++) {
      const row = this.table.children[0];
      row.remove();
    }
  }

  addTaskToTable(task) {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${task.name}</td>
      <td>${this.getCompleteIconHtml(task.completed)}</td>
      <td>${formatDate(task)}</td>
      <td>
        <div class="pointer" uuid="${task.uuid}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
        </div>
      </td>`;

    
    row.id = task.uuid;
    this.table.append(row);
    this.addCompleteTaskListenerToRow(row);
    this.addDeleteListenerToRow(row);
  }

  getCompleteIconHtml(completed) {
     if (completed) {
      return `<div class="form-check">
      <input class="form-check" type="radio" checked>
      </div>`;
     }
      return `<div class="form-check">
              <input class="form-check" type="radio">
              </div>`;
   
  }

 

  addCompleteTaskListenerToRow(row) {
    row.children[1].children[0].addEventListener('click', (e) => {
      this.storage.updateTask(row);
      this.populateTasksTable();
    });
  }

  addDeleteListenerToRow(row) {
      row.children[3].children[0].addEventListener('click', (e) => {
      e.preventDefault();
      this.storage.removeTask(row.id);
      this.populateTasksTable();
    });
  }

  clearFormInputs() {
    this.uuid = '';
    this.name = '';
    this.completed = '';
    this.dateCompleted = '';
  }
}

function formatDate(task) {
  if (task.completed == true) {
    var today = new Date();
    var month = today.getMonth()+1;
    var day = today.getDate();
    var year = today.getFullYear()
    return month + '/' + day + '/' + year;
  } else {
    return 'Not completed';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UserInterface();
  ui.initialize();
});

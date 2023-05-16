"use strict";

const mainContainer = document.createElement("div");
mainContainer.classList.add("maincontainer");
document.body.appendChild(mainContainer);

const mainHeader = document.createElement("h1");
mainHeader.classList.add("mainHeader");
mainHeader.textContent = "TO DO LIST";
mainContainer.appendChild(mainHeader);

const todoContainer = document.createElement("div");
todoContainer.classList.add("todoContainer");
mainContainer.appendChild(todoContainer);

const addTaskInput = document.createElement("input");
addTaskInput.setAttribute("type", "text");
addTaskInput.setAttribute("id", "add-task-input"); // Create the container and the elements for the landing page
addTaskInput.setAttribute("placeholder", "Add Task!");
todoContainer.appendChild(addTaskInput);

const add_Task_Btn = document.createElement("input");
add_Task_Btn.setAttribute("type", "button");
add_Task_Btn.setAttribute("id", "add_Task_Btn");
add_Task_Btn.setAttribute("value", "+");
add_Task_Btn.setAttribute("title", "Add Task!");
todoContainer.appendChild(add_Task_Btn);

const newTasksContainer = document.createElement("div");
newTasksContainer.setAttribute("id", "newTasksContainer");
mainContainer.appendChild(newTasksContainer);

let todos = localStorage.data ? JSON.parse(localStorage.data) : []; // Defined an array to be held the task and objects

function loadData() {
  // This is the function to be used to create and load the data/s that in localstorage.

  const newTasksContainer = document.getElementById("newTasksContainer");
  newTasksContainer.innerHTML = "";

  for (let data in todos) {
    //Iterate the array and create the following elements per value of an each object. All task raw elements have different class so the class is unique for each
    const newTask = document.createElement("div");

    const checkbox = document.createElement("input"); //Create Checkbox
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", todos[data].class);
    checkbox.checked = todos[data].checked;

    const taskToDo = document.createElement("span"); //The element holds the task
    taskToDo.setAttribute("name", "addedTask");
    taskToDo.setAttribute("id", todos[data].id);
    taskToDo.setAttribute("contenteditable", todos[data].contenteditable);
    taskToDo.innerHTML = todos[data].task;

    const remove_Btn = document.createElement("input"); //Create remove button
    remove_Btn.setAttribute("type", "button");
    remove_Btn.setAttribute("value", "-");
    remove_Btn.setAttribute("class", todos[data].class);

    const edit_Btn = document.createElement("img"); //Create edit button (img used as button)
    edit_Btn.setAttribute("src", "pencil.png");
    edit_Btn.setAttribute("alt", "Edit Task");
    edit_Btn.setAttribute("class", todos[data].class);

    newTasksContainer.appendChild(newTask); //Append each child to the parent
    newTask.appendChild(checkbox);
    newTask.appendChild(taskToDo);
    newTask.appendChild(edit_Btn);
    newTask.appendChild(remove_Btn);
  }
}

function updateData() {
  // Updating the data/s when user intaracted.
  const checks = document.querySelectorAll('input[type="checkbox"]'); //Select checkboxes
  const edits = document.querySelectorAll('img[alt="Edit Task"]'); //Select edit buttons
  const removes = document.querySelectorAll('input[type="button"][value="-"]'); //Select remove buttons
  checks.forEach((checkbox) => {
    checkbox.addEventListener("click", (event) => {
      const targetObject = todos.find(
        (obj) => obj.class === event.target.className
      ); //Get the object by target class
      targetObject.checked = !targetObject.checked; //Update the value for the specific key
      localStorage.data = JSON.stringify(todos); //Update localstorage
    });
  });
  edits.forEach((editBtn) => {
    editBtn.addEventListener("click", (event) => {
      const targetObject = todos.find(
        (obj) => obj.class === event.target.className
      ); //Get the object by target class
      const targetElement = document.getElementById(event.target.className); //Get the task span
      targetElement.contentEditable == "true"
        ? (targetElement.contentEditable = "false")
        : (targetElement.contentEditable = "true"); //Make changable when clicked
      targetObject.task = targetElement.innerHTML; //Update task value of the target object for the specified span
      targetElement.classList.contains("span_edit")
        ? targetElement.classList.remove("span_edit")
        : targetElement.classList.add("span_edit"); //Add border so that user can get the element is editable
      localStorage.data = JSON.stringify(todos); //Update localstorage
    });
  });
  removes.forEach((removeBtn) => {
    removeBtn.addEventListener("click", (event) => {
      const targetObject = todos.find(
        (obj) => obj.class === event.target.className
      ); //Get the object by target class
      todos = todos.filter((obj) => obj !== targetObject); //Remove object
      event.target.parentElement.remove(); //Remove the line
      localStorage.data = JSON.stringify(todos); //Update localstorage
    });
  });
}

function checkData(task) {
  //This is the fuction checks the task existance in localstorage
  let isDataExist = JSON.parse(localStorage.data).some(
    (obj) => obj.task === task
  ); //If task exist already, return true
  if (isDataExist) {
    return true;
  }
}

function operate() {
  //This is the main function which operates
  add_Task_Btn.addEventListener("click", () => {
    if (addTaskInput.value === "") {
      //Do not allow user to add anything without populating the text field
      alert("You should add task!"); //Warn!
    } else {
      if (localStorage.data == undefined) {
        //If no data in storage, add object and task
        todos.push({
          id: addTaskInput.value.trim(), //This is the key holds id of each span
          class: addTaskInput.value.trim(), //Class to be assigned to the checboxes,edits and remove buttons
          task: addTaskInput.value.trim(), //This key holds the task
          checked: false, //A boolean to control checkbox status
          contentEditable: "false", //An attiribute to control the changes on span/s
        });
      } else {
        if (checkData(addTaskInput.value.trim())) {
          //If there is data in localstorage, check whether the task to be added in the store. Do not allow user to add the task which has been added already
          alert("Task has been added already!"); //Warn
        } else {
          todos.push({
            //If the task has not been added before, add to the list
            id: addTaskInput.value.trim(),
            class: addTaskInput.value.trim(),
            task: addTaskInput.value.trim(),
            checked: false,
            contentEditable: "false",
          });
        }
      }
    }
    addTaskInput.value = ""; //Make the text field empty upon adding task
    localStorage.data = JSON.stringify(todos); //Update localstorage once a new task added
    loadData(); //Load the data
    updateData(); //Update data
  });
  loadData(); //Load the data
  updateData(); //Update data
}

operate();

// localStorage.clear  //If you want to clear the storage

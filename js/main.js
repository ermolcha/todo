const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

form.addEventListener('submit', addTask)
tasksList.addEventListener('click', deleteTask)
tasksList.addEventListener('click', doneTask)

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach( (task) => renderTask(task))
}

checkEmptyList()

function addTask(event) {
    event.preventDefault() //отмена отправки формы

    const taskText = taskInput.value

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    tasks.push(newTask)

    saveToLocalStorage()

    renderTask(newTask)

    //очистить поле ввода и оставить на нем фокус
    taskInput.value = ''
    taskInput.focus()

    checkEmptyList()
}

function deleteTask(event) {
    if (event.target.dataset.action === 'delete') {
        const parenNode = event.target.closest('.list-group-item')

        const id = Number(parenNode.id)

        // const index = tasks.findIndex((task) => task.id === id)
        //
        // tasks.splice(index, 1)

        tasks = tasks.filter((task) => task.id !== id)

        saveToLocalStorage()

        parenNode.remove()
    }

    checkEmptyList()
}

function doneTask(event) {
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.list-group-item')

        const id = Number(parentNode.id)

        const task = tasks.find(function (task) {
            if (task.id === id) {
                return true
            }
        })

        task.done = !task.done

        saveToLocalStorage()

        const taskTitle = parentNode.querySelector('.task-title')
        taskTitle.classList.toggle('task-title--done')
    }

}


function checkEmptyList() {
    console.log()
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
\t\t\t\t\t<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
\t\t\t\t\t<div class="empty-list__title">Список дел пуст</div>
\t\t\t\t</li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector("#emptyList")
        emptyListEl ?  emptyListEl.remove() : null
    }
}


function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title'


    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
<span class="${cssClass}">${task.text}</span>
<div class="task-item__buttons">
\t\t\t\t\t\t<button type="button" data-action="done" class="btn-action">
\t\t\t\t\t\t\t<img src="./img/tick.svg" alt="Done" width="18" height="18">
\t\t\t\t\t\t</button>
\t\t\t\t\t\t<button type="button" data-action="delete" class="btn-action">
\t\t\t\t\t\t\t<img src="./img/cross.svg" alt="Done" width="18" height="18">
\t\t\t\t\t\t</button>
\t\t\t\t\t</div>
\t\t\t\t</li>`

    //добавление задачи на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
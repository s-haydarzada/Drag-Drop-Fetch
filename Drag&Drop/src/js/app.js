document.addEventListener('DOMContentLoaded', function() {
    const openDiv = document.getElementById('open');
    const inProgressDiv = document.getElementById('inProgress');
    const completedDiv = document.getElementById('completed');
    const createButton = document.getElementById('createTask');

    function createTaskElement(name, id, status) {
        const taskElement = document.createElement('div');
        taskElement.textContent = name;
        taskElement.setAttribute('draggable', true);
        taskElement.dataset.id = id;
        taskElement.dataset.status = status;
        taskElement.classList.add('task');
        return taskElement;
    }

    function addToStatusDiv(taskElement, status) {
        switch (status) {
            case 'open':
                openDiv.appendChild(taskElement);
                break;
            case 'inProgress':
                inProgressDiv.appendChild(taskElement);
                break;
            case 'completed':
                completedDiv.appendChild(taskElement);
                break;
            default:
                break;
        }
    }

    createButton.addEventListener('click', function() {
        const taskName = document.getElementById('taskName').value;
        const taskId = Date.now(); // Unique ID
        const taskStatus = 'open'; // Initial status is open

        const taskElement = createTaskElement(taskName, taskId, taskStatus);
        addToStatusDiv(taskElement, taskStatus);

        // Send data to server (save to JSON file)
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: taskId,
                name: taskName,
                status: taskStatus,
            }),
        });
    });

    // Drag and Drop functionality
    let draggedElement = null;

    document.addEventListener('dragstart', function(event) {
        draggedElement = event.target;
    });

    document.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    document.addEventListener('drop', function(event) {
        const target = event.target.closest('.status');
        const status = target.id;

        if (target && draggedElement.dataset.status !== status) {
            target.appendChild(draggedElement);

            // Update status in dataset
            draggedElement.dataset.status = status;

            // Send data to server (update JSON file)
            const taskId = draggedElement.dataset.id;
            const taskName = draggedElement.textContent;

            fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: taskName,
                    status: status,
                }),
            });
        }

        draggedElement = null;
    });
});



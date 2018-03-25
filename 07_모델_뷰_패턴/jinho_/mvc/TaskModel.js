var TaskModel = function () {
  this.tasks = [];
  this.selectedTasks = [];
  this.addTaskEvent = new Event(this);
  this.removeTaskEvent = new Event(this);
  this.setTasksAsCompletedEvent = new Event(this);
  this.deleteTasksEvent = new Event(this);
};

TaskModel.prototype = {

  addTask (task) {
    this.tasks.push({
      taskName: task,
      taskStatus: 'uncompleted'
    });
    this.addTaskEvent.notify();
  },

  getTasks () {
    return this.tasks;
  },

  setSelectedTask (taskIndex) {
    this.selectedTasks.push(taskIndex);
  },

  unselectTask (taskIndex) {
    this.selectedTasks.splice(taskIndex, 1);
  },

  setTasksAsCompleted () {
    var selectedTasks = this.selectedTasks;
    for (var index in selectedTasks) {
      this.tasks[selectedTasks[index]].taskStatus = 'completed';
    }

    this.setTasksAsCompletedEvent.notify();
    this.initializeSelectedTasks();
  },

  deleteTasks () {
    var selectedTasks = this.selectedTasks.sort();

    for (var i = selectedTasks.length - 1; i >= 0; i--) {
      this.tasks.splice(this.selectedTasks[i], 1);
    }

    this.deleteTasksEvent.notify();
    this.initializeSelectedTasks();
  },

  initializeSelectedTasks() {
    this.selectedTasks = [];
  }
};

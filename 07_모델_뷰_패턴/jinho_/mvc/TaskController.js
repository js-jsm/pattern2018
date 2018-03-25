var TaskController = function (model, view) {
  this.model = model;
  this.view = view;

  this.init();
};

TaskController.prototype = {
  init() {
    this.view.addTaskEvent.attach(this.addTask.bind(this));
    this.view.completeTaskEvent.attach(this.completeTask.bind(this));
    this.view.deleteTaskEvent.attach(this.deleteTask.bind(this));
    this.view.selectTaskEvent.attach(this.selectTask.bind(this));
    this.view.unselectTaskEvent.attach(this.unselectTask.bind(this));
  },

  addTask(sender, args) {
    this.model.addTask(args.task);
  },

  selectTask(sender, args) {
    this.model.setSelectedTask(args.taskIndex);
  },

  unselectTask(sender, args) {
    this.model.unselectTask(args.taskIndex);
  },

  completeTask() {
    this.model.setTasksAsCompleted();
  },

  deleteTask() {
    this.model.deleteTasks();
  }
};

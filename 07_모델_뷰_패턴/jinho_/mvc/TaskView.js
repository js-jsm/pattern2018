var TaskView = function (model) {
  this.model = model;
  this.addTaskEvent = new Event(this);
  this.selectTaskEvent = new Event(this);
  this.unselectTaskEvent = new Event(this);
  this.completeTaskEvent = new Event(this);
  this.deleteTaskEvent = new Event(this);

  this.init();
};

TaskView.prototype = {

  init() {
    this.$container = $('.js-container');
    this.$addTaskButton = this.$container.find('.js-add-task-button');
    this.$taskTextBox = this.$container.find('.js-task-textbox');
    this.$tasksContainer = this.$container.find('.js-tasks-container');

    this.$addTaskButton.click(this.addTaskButton.bind(this));
    this.$container.on('click', '.js-task', this.selectOrUnselectTask.bind(this));
    this.$container.on('click', '.js-complete-task-button', this.completeTaskButton.bind(this));
    this.$container.on('click', '.js-delete-task-button', this.deleteTaskButton.bind(this));

    this.model.addTaskEvent.attach(this.addTask.bind(this));
    this.model.addTaskEvent.attach(this.clearTaskTextBox.bind(this));
    this.model.setTasksAsCompletedEvent.attach(this.setTasksAsCompleted.bind(this));
    this.model.deleteTasksEvent.attach(this.deleteTasks.bind(this));
  },

  addTaskButton() {
    this.addTaskEvent.notify({
      task: this.$taskTextBox.val()
    });
  },

  completeTaskButton() {
    this.completeTaskEvent.notify();
  },

  deleteTaskButton() {
    this.deleteTaskEvent.notify();
  },

  selectOrUnselectTask() {
    var taskIndex = $(event.target).attr("data-index");

    if ($(event.target).attr('data-task-selected') == 'false') {
      $(event.target).attr('data-task-selected', true);
      this.selectTaskEvent.notify({
        taskIndex: taskIndex
      });
    } else {
      $(event.target).attr('data-task-selected', false);
      this.unselectTaskEvent.notify({
        taskIndex: taskIndex
      });
    }
  },

  buildList() {
    var tasks = this.model.getTasks();
    var html = "";
    var $tasksContainer = this.$tasksContainer;

    $tasksContainer.html('');

    var index = 0;
    for (var task in tasks) {
      if (tasks[task].taskStatus == 'completed') {
        html += '<div style="text-decoration:line-through;">';
      } else {
        html += "<div>";
      }
      $tasksContainer.append(`${html}<label><input type="checkbox" class="js-task" data-index="${index}" data-task-selected="false">${tasks[task].taskName}</label></div>`);
      index++;
    }
  },

  clearTaskTextBox() {
    this.$taskTextBox.val('');
  },

  addTask() {
    this.buildList();
  },

  setTasksAsCompleted() {
    this.buildList();
  },

  deleteTasks() {
    this.buildList();
  }
};

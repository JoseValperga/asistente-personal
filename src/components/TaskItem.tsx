import { Task } from "@/utils/interfaces";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  console.log("Task", task);
  return (
    <div className="task-item">
      <div>--------------------</div>
      <div>{task.message}</div>
      <div>{task.what.join(", ")}</div>
      <div>{task.who.join(", ")}</div>
      <div>{task.when}</div>
      <div>{task.since}</div>
      <div>{task.until}</div>
      <div>{task.about.join(", ")}</div>
      <div>{task.duration}</div>
    </div>
  );
};

export default TaskItem;

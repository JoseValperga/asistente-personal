import TaskItem from "./TaskItem";
import { Task } from "@/utils/interfaces";

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks = [] }: TaskListProps) => {
  console.log("Tasks", tasks);

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} />
      ))}
    </div>
  );
};
export default TaskList;

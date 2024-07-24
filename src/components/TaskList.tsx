import TaskItem from "./TaskItem";

interface Task {
  message: string;
  what: string[];
  who: string[];
  when: string;
  since: string;
  until: string;
  about: string[];
  duration: string;
}

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

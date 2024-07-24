import { useState } from "react";
import { Task } from "@/utils/interfaces";
interface TaskFormProps {
  fetchTasks: (data: Task[]) => void;
}

const TaskForm = ({ fetchTasks }: TaskFormProps) => {
  const [task, setTask] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task.trim()) {
      try {
        const response = await fetch("/api/tasks/analizeTask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Task[] = await response.json();
        console.log("AI Response:", data);

        fetchTasks(data);
      } catch (error) {
        console.error("Error submitting task:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative p-4 border border-gray-200 rounded-lg task-form"
    >
      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
        className="w-full p-2 mb-10 border border-gray-300 rounded-md task-textarea"
        rows={4}
        cols={50}
      ></textarea>
      <button
        type="submit"
        className="absolute px-4 py-2 text-white bg-blue-500 rounded-md task-button bottom-2 left-4"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;

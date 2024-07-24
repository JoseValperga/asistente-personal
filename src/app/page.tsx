"use client";
import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

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

const HomePage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async (data: Task[]) => {
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks([]);
  }, []);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">My Productivity Assistant</h1>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskList tasks={tasks} />
    </div>
  );
};

export default HomePage;

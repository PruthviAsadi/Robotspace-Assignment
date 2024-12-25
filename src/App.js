import React, { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from './api';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import ConfirmationDialog from './ConfirmationDialog';

import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await getTasks();
    setTasks(data);
  };

  const handleAddTask = async (task) => {
    await addTask(task);
    fetchTasks();
    setShowForm(false);
  };

  const handleUpdateTask = async (id, task) => {
    await updateTask(id, task);
    fetchTasks();
    setShowForm(false);
  };

  const handleDeleteTask = async () => {
    if (deleteTaskId) {
      await deleteTask(deleteTaskId);
      fetchTasks();
      setDeleteTaskId(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">
      <h1>Task Tracker</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={() => setShowForm(true)}>Add Task</button>
      </div>

      <TaskList
        tasks={filteredTasks}
        onEdit={(task) => {
          setEditingTask(task);
          setShowForm(true);
        }}
        onDelete={(id) => setDeleteTaskId(id)}
      />

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={(task) => {
            editingTask ? handleUpdateTask(editingTask.id, task) : handleAddTask(task);
            setEditingTask(null);
          }}
          onClose={() => {
            setEditingTask(null);
            setShowForm(false);
          }}
        />
      )}

      {deleteTaskId && (
        <ConfirmationDialog
          isOpen={!!deleteTaskId}
          onConfirm={handleDeleteTask}
          onCancel={() => setDeleteTaskId(null)}
          message="Are you sure you want to delete this task?"
        />
      )}
    </div>
  );
}

export default App;

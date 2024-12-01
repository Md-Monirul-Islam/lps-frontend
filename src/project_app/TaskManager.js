import React, { useEffect } from "react";
import axios from "axios";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { baseUrl } from "../Variable";

const TaskManager = () => {
  useEffect(() => {
    // Initialize Gantt chart
    gantt.init("gantt_chart");

    // Set up dataProcessor for REST updates
    const dp = new gantt.dataProcessor(`${baseUrl}/tasks/`);
    dp.init(gantt);
    dp.setTransactionMode("REST");

    // Fetch tasks from the server
    fetchTasks();

    // Attach event to handle task creation
    gantt.attachEvent("onTaskCreated", (task) => handleTaskCreate(task));

    // Cleanup on component unmount
    return () => gantt.clearAll();
  }, []);

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(`${baseUrl}/tasks/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Format tasks for Gantt
      const formattedTasks = {
        data: response.data.map((task) => ({
          id: task.id,
          text: task.title,
          start_date: task.start_date,
          duration: calculateDuration(task.start_date, task.end_date),
          description: task.description,
          status: task.status,
        })),
      };

      gantt.parse(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Function to calculate task duration in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Convert ms to days
  };

  // Utility function to format dates to YYYY-MM-DD
  const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return null; // Invalid date
    }
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Function to handle task creation
  const handleTaskCreate = async (task) => {
    const authToken = localStorage.getItem("authToken");

    // Set default dates if missing
    const defaultStartDate = new Date();
    const defaultEndDate = new Date(defaultStartDate);
    defaultEndDate.setDate(defaultEndDate.getDate() + 1);

    task.start_date = formatDateForBackend(task.start_date || defaultStartDate);
    task.end_date = formatDateForBackend(task.end_date || defaultEndDate);

    // Validate dates
    if (!task.start_date || !task.end_date) {
      alert(
        "Start Date and End Date are required. Please ensure they are valid and in the format YYYY-MM-DD."
      );
      return false; // Cancel task creation
    }

    // Prepare the payload
    const payload = {
      title: task.text || "New Task",
      description: task.description || "",
      start_date: task.start_date,
      end_date: task.end_date,
      status: "planned",
    };

    try {
      // POST request to save task
      const response = await axios.post(`${baseUrl}/tasks/`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      // Update task ID in Gantt
      gantt.changeTaskId(task.id, response.data.id);
      gantt.refreshData();
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      alert("Failed to save the task. Please try again.");
    }
    return true; // Allow task creation
  };

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      <div id="gantt_chart" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default TaskManager;

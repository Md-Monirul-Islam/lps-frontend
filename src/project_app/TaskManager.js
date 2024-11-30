import React, { useEffect } from "react";
import axios from "axios";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { baseUrl } from "../Variable";

const TaskManager = () => {
  useEffect(() => {
    // Initialize Gantt
    gantt.init("gantt_chart");
  
    // Fetch and load tasks
    fetchTasks();
  
    // Initialize DataProcessor
    const dp = new gantt.dataProcessor(baseUrl + "/tasks/");
    dp.init(gantt);
    dp.setTransactionMode("REST");

    // Safely parse a date string into YYYY-MM-DD format
const formatDateForBackend = (dateString) => {
  const date = new Date(dateString); // Attempt to parse the date
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return null; // Return null for invalid dates
  }
  return date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
};

  
    dp.attachEvent("onBeforeUpdate", (id, state, data) => {
      const authToken = localStorage.getItem("authToken");
    
      // Prepare request payload with safe date formatting
      const payload = {
        title: data.text || "Untitled Task",
        description: data.description || "",
        start_date: formatDateForBackend(data.start_date), // Safely format start_date
        end_date: formatDateForBackend(data.end_date), // Safely format end_date
        status: data.status || "planned",
      };
    
      if (!payload.start_date || !payload.end_date) {
        console.error("Invalid date detected in payload:", payload);
        dp.setUpdated(id, false); // Mark as failed
        return false; // Stop further processing
      }
    
      // Determine HTTP method and URL
      let method, url;
      if (state === "inserted") {
        method = "POST";
        url = `${baseUrl}/tasks/`;
      } else if (state === "updated") {
        method = "PUT";
        url = `${baseUrl}/tasks/${id}/`;
      } else if (state === "deleted") {
        method = "DELETE";
        url = `${baseUrl}/tasks/${id}/`;
      }
    
      // Send the request using Axios
      axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        data: state !== "deleted" ? payload : null, // Include payload only for POST and PUT
      })
        .then((response) => {
          if (state === "inserted") {
            gantt.changeTaskId(id, response.data.id); // Sync task ID with the server
          }
          dp.setUpdated(id, true); // Mark as successful
        })
        .catch((error) => {
          console.error("Error syncing data:", error.response?.data || error.message);
          dp.setUpdated(id, false); // Mark as failed
        });
    
      return false; // Prevent Gantt's default behavior
    });
    
    
  
    return () => gantt.clearAll(); // Cleanup on unmount
  }, []);
  

  const fetchTasks = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(baseUrl + "/tasks/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      // Format tasks for Gantt
      const formattedTasks = {
        data: response.data.map((task) => {
          const startDate = new Date(task.start_date);
          const endDate = new Date(task.end_date);
          const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Duration in days
  
          return {
            id: task.id,
            text: task.title,
            start_date: task.start_date,
            duration: duration,
            description: task.description,
            status: task.status,
          };
        }),
      };
  
      // Load tasks into Gantt
      gantt.parse(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      <div id="gantt_chart" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default TaskManager;

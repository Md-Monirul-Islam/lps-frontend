import React, { useEffect } from 'react';
import gantt from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

const GanttChart = ({ teamId }) => {
    useEffect(() => {
        // Initialize Gantt
        gantt.init('gantt_chart');

        // Fetch task data from the Django backend
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/tasks/?team_id=${teamId}`);
                const data = await response.json();

                // Parse data for Gantt
                const tasks = {
                    data: data.map(task => ({
                        id: task.id,
                        text: task.title,
                        start_date: task.start_date,
                        duration: Math.ceil((new Date(task.end_date) - new Date(task.start_date)) / (1000 * 60 * 60 * 24)),
                        progress: task.status === 'completed' ? 1 : 0.5,
                    })),
                    links: data
                        .filter(task => task.depends_on)
                        .map(task => ({
                            id: task.id,
                            source: task.depends_on,
                            target: task.id,
                            type: '0', // Finish-to-start relationship
                        })),
                };

                gantt.clearAll();
                gantt.parse(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [teamId]);

    return (
        <div>
            <div id="gantt_chart" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default GanttChart;

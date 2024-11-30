import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../Variable';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(baseUrl+'/activities/');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id) => {
    try {
      const activityToUpdate = activities.find(activity => activity.id === id);
      await axios.put(`${baseUrl}/activities/${id}/`, activityToUpdate);
      setEditingId(null);
      fetchActivities();
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleChange = (id, field, value) => {
    setActivities(activities.map(activity => 
      activity.id === id ? { ...activity, [field]: value } : activity
    ));
  };

  return (
    <div className="activity-list">
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Actions</th>
            <th>Start</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity.id}>
              <td>
                {editingId === activity.id ? (
                  <input
                    value={activity.name}
                    onChange={(e) => handleChange(activity.id, 'name', e.target.value)}
                  />
                ) : (
                  activity.name
                )}
              </td>
              <td>
                {editingId === activity.id ? (
                  <button onClick={() => handleSave(activity.id)}>Save</button>
                ) : (
                  <button onClick={() => handleEdit(activity.id)}>Edit</button>
                )}
              </td>
              <td>
                {editingId === activity.id ? (
                  <input
                    type="date"
                    value={activity.start_date}
                    onChange={(e) => handleChange(activity.id, 'start_date', e.target.value)}
                  />
                ) : (
                  activity.start_date
                )}
              </td>
              <td>
                {editingId === activity.id ? (
                  <input
                    type="number"
                    value={activity.duration}
                    onChange={(e) => handleChange(activity.id, 'duration', e.target.value)}
                  />
                ) : (
                  `${activity.duration} days`
                )}
              </td>
              <td>
                {editingId === activity.id ? (
                  <select
                    value={activity.status}
                    onChange={(e) => handleChange(activity.id, 'status', e.target.value)}
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                  </select>
                ) : (
                  activity.status
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityList;
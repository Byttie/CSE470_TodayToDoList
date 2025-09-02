# Enhanced Task Management Feature

## Overview
This feature adds advanced task management capabilities with time tracking and priority management based on remaining hours until the next day.

## New Features

### 1. Modal-Based Task Creation
- Click "Add New Task" to open a modal popup
- Clean, user-friendly interface for task creation
- Form validation to ensure data integrity

### 2. Enhanced Task Fields
- **Task Name**: Required field for task identification
- **Description**: Detailed description of the task
- **Priority**: Low, Medium, High priority levels with color coding
- **Estimated Time**: Time required in hours (with decimal support)

### 3. Time Management System
- **Remaining Hours Calculation**: Automatically calculates hours left until next day
- **Time Validation**: Prevents creating tasks that exceed available time
- **Daily Reset**: Time resets to 24 hours at midnight
- **Multiple Tasks**: Can create multiple tasks as long as total time doesn't exceed remaining hours

### 4. Enhanced Task Display
- **Priority Color Coding**: 
  - High: Red (#dc2626)
  - Medium: Orange (#d97706)
  - Low: Green (#16a34a)
- **Time Display**: Shows estimated time for each task
- **Creation Date**: Displays when the task was created
- **Improved Layout**: Better visual hierarchy and spacing

## Database Schema Updates

The following columns have been added to the `tasks` table:
- `desc` (TEXT): Task description
- `priority` (VARCHAR): Priority level (low, medium, high)
- `time` (DECIMAL): Estimated time in hours
- `created_at` (TIMESTAMP): Creation timestamp

## Setup Instructions

1. **Update Database Schema**:
   ```bash
   psql -d your_database -f database_update.sql
   ```

2. **Frontend Dependencies**:
   - No additional dependencies required
   - Uses existing React components and CSS

3. **Backend Updates**:
   - Updated Models/Tasks.js to handle new fields
   - Updated Controller/addTaskController.js for new API structure

## Usage

### Adding a Task
1. Navigate to the Tasks page
2. Check remaining hours display
3. Click "Add New Task" button
4. Fill in the modal form:
   - Enter task name (required)
   - Add description (required)
   - Select priority (default: medium)
   - Set estimated time (cannot exceed remaining hours)
5. Click "Add Task" to save

### Time Management Rules
- Each user starts with 24 hours at the beginning of each day
- Tasks cannot be created if their time exceeds remaining hours
- Time resets to 24 hours at midnight local time
- Multiple tasks can be created as long as total doesn't exceed limit

### Visual Indicators
- Blue info box shows remaining hours
- Red warning appears when no time is remaining
- Priority colors help identify task importance
- Time badges show estimated duration

## Technical Implementation

### Frontend Components
- `AddTaskModal.jsx`: Modal component for task creation
- `AddTaskModal.css`: Styling for the modal
- Updated `tasks.jsx`: Enhanced task management logic
- Enhanced `dashboard.css`: New styles for improved UI

### Backend Changes
- Enhanced `addTask()` function to accept new parameters
- Updated `listTasks()` to return all task fields
- Improved error handling and validation

### Time Calculation Logic
```javascript
const calculateRemainingHours = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diffMs = tomorrow.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return Math.max(0, Math.round(diffHours * 10) / 10);
};
```

## Future Enhancements
- Task completion tracking
- Time spent vs estimated time analysis
- Task scheduling and reminders
- Weekly/monthly time management reports
- Task categories and tags
- Drag-and-drop task reordering

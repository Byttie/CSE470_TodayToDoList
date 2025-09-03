# Reward System Feature

## Overview
The reward system feature adds gamification to the TodayToDoList application, encouraging users to complete their tasks on time by awarding points and ranks based on their performance.

## Features

### Point System
- **1:1 Relationship**: Users earn points equal to the task duration in minutes
- **Success Reward**: Complete a task before the timer ends → earn points
- **Failure Penalty**: Let the timer run out → lose points
- **Minimum Cap**: Points cannot go below 0

### Rank System
- **Bronze**: 0-100 points 🥉
- **Silver**: 101-200 points 🥈
- **Gold**: 201-400 points 🥇
- **Platinum**: 401-700 points 💎
- **Diamond**: 700+ points 💠

### User Interface
- **Points Display**: Shows current points and rank on dashboard and tasks page
- **Task Completion Button**: ✅ button to mark task as completed
- **Real-time Updates**: Points and rank update immediately after task completion/timeout
- **Visual Feedback**: Different colors and emojis for each rank

## Technical Implementation

### Backend (MVC Pattern)

#### Model (`Model/Points.js`)
- `initializeUserPoints(userId)`: Initialize user with 0 points and Bronze rank
- `getUserPoints(userId)`: Retrieve user's current points and rank
- `updateUserPoints(userId, pointsChange)`: Update points and recalculate rank
- `calculateRank(points)`: Determine rank based on point total
- `awardPoints(userId, taskTimeInMinutes)`: Award points for successful completion
- `penalizePoints(userId, taskTimeInMinutes)`: Deduct points for timeout

#### Controller (`Controller/pointsController.js`)
- `GET /points/:userId`: Get user points and rank
- `POST /points/award`: Award points for task completion
- `POST /points/penalize`: Penalize points for task timeout
- `POST /tasks/complete`: Complete task successfully (award points + delete task)
- `POST /tasks/timeout`: Handle task timeout (penalize points + delete task)

### Frontend Components

#### `PointsDisplay.jsx`
- Displays current points and rank
- Auto-refreshes when points change
- Responsive design with gradient background
- Color-coded ranks with emojis

#### `SmallTimer.jsx` (Enhanced)
- Added "Task Finished" button (✅)
- Handles task completion vs timeout
- Visual states: ready, running, paused, completed, timeout
- Calls appropriate completion/timeout handlers

#### `tasks.jsx` (Enhanced)
- Integrated points display
- Handles task completion and timeout events
- Refreshes points display after point changes
- Shows success/failure messages with point changes

## Database Schema

### Points Table
```sql
CREATE TABLE points (
    id INTEGER PRIMARY KEY,
    points INTEGER DEFAULT 0,
    rank VARCHAR(20) DEFAULT 'Bronze',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

1. **Database Setup**:
   ```bash
   # Run the SQL script to create the points table
   psql -d your_database -f setup_points_table.sql
   ```

2. **Backend Setup**:
   - The points controller is already integrated into `server.js`
   - No additional dependencies required

3. **Frontend Setup**:
   - All components are already integrated
   - CSS styles are included

## Usage Flow

1. **User creates a task** with a specific duration (e.g., 5 minutes)
2. **User starts the timer** to begin working on the task
3. **Two possible outcomes**:
   - **Success**: User clicks "Task Finished" button before timer ends
     - Task is deleted
     - User earns points equal to task duration in minutes
     - Rank is recalculated
   - **Failure**: Timer reaches zero
     - Task is deleted
     - User loses points equal to task duration in minutes
     - Rank is recalculated (minimum 0 points)

## API Endpoints

### Get User Points
```
GET /points/:userId
Response: { points: 150, rank: "Silver" }
```

### Complete Task Successfully
```
POST /tasks/complete
Body: { userId: 1, taskId: 123, taskTimeInMinutes: 5 }
Response: { message: "Task completed successfully!", points: 155, rank: "Silver", pointsAwarded: 5 }
```

### Handle Task Timeout
```
POST /tasks/timeout
Body: { userId: 1, taskId: 123, taskTimeInMinutes: 5 }
Response: { message: "Task timed out!", points: 145, rank: "Silver", pointsPenalized: 5 }
```

## File Structure
```
Model/
├── Points.js                 # Points database operations
Controller/
├── pointsController.js       # Points API endpoints
├── server.js                 # Updated to include points controller
Views/src/
├── PointsDisplay.jsx         # Points and rank display component
├── PointsDisplay.css         # Styling for points display
├── SmallTimer.jsx            # Enhanced timer with completion button
├── SmallTimer.css            # Updated timer styles
├── tasks.jsx                 # Enhanced tasks page with points integration
└── dashboard.jsx             # Updated dashboard with points display
```

## Future Enhancements
- Leaderboards
- Achievement badges
- Streak tracking
- Point multipliers for consecutive completions
- Shop system integration (spend points on rewards)
- Social features (compare ranks with friends)

## Testing
To test the reward system:
1. Create a task with a short duration (e.g., 1 minute)
2. Start the timer
3. Try both scenarios:
   - Complete the task early using the ✅ button
   - Let the timer run out
4. Check that points and rank update correctly
5. Verify that points cannot go below 0

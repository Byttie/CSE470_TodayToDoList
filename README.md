Student Name: Ragib Rawnak
ID: 23101346
Email: ragib.rawnak@g.bracu.ac.bd

Project Name: Today-Todo-List
Project Type: Web-Application
TechStack: POSTGRE SQL, ExpressJS ReactJS NodeJS

Summary: 

In this project users can create Tasks that they want to complete within 24hours(A single Day) 

Features:

1. Authentication
2. Dash Board for Management
3. Listing Tasks
4. Deleting Tasks
5. Timer (24 Hour Real Time Clock)
6. Ranking System (Completing Tasks Gives Reward. Points and Ranks)
7. Reward System (Reward Points can be redeemed. Reward are like Watching a movie Play some games etc but it'll have a timer as well based on the reward point spent)
8. Buying Rewards For Task Completion Using Points
9. Sharing Progress with Others and Creating Posts
10. Comment on Other Peoples Progress and Posts
11. Rate Their Progress


Instructions

1. Install nodejs
2. Install npm 
3. Install POSTGRE SQL
4. Open two terminals
5. Go to "/CSE470_TodayToDoList/Views" Directory
6. run npm run dev in terminal 1
7. Go to "/CSE470_TodayToDoList/Controller"
8. run node server.js in terminal 2


Cloudinary Setup for Profile Pictures

1. In the Controller directory, create a .env file with:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

2. Install backend dependencies (already in package.json but ensure installed):

cd Controller
npm install

3. Database migration (PostgreSQL): ensure users table has profile_image_url column. You can run the final statements in fix_schema.sql or execute:

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

4. Start backend and frontend as above. The signup form now accepts an optional image file and uploads it to Cloudinary, storing the URL in users.profile_image_url.









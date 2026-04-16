# Smart Expance Tracker

This project is now split into:

- `src/`: React frontend built with Vite
- `server/`: Express API with MongoDB via Mongoose

## Run on your MacBook

1. Open Terminal in `/Users/meetsharma/Documents/Playground/Smart Expance Tracker`
2. Install packages:
   `npm install`
3. Create your env file:
   `cp .env.example .env`
4. Make sure local MongoDB is running on your Mac:
   `brew services start mongodb-community`
5. Start the backend:
   `npm run server`
6. In another terminal tab, start the frontend:
   `npm run dev`
7. Open the app in the browser:
   `http://localhost:5173`

## MongoDB Compass

- Open MongoDB Compass
- Connect to: `mongodb://127.0.0.1:27017`
- Database name used by this app: `smart-expense-tracker`

## Notes

- User accounts, transactions, and budgets are now saved in MongoDB instead of browser local storage.
- The API runs on `http://localhost:5001`.

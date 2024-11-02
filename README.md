# Personal Finance Dashboard
This repository contains the source code for the **Personal Finance Dashboard** web application, designed to help users track their income and expenses, calculate their total balance, visualize their financial data, and stay on top of their personal finance goals.

## Features
- **Income & Expense Tracking**: Easily add, view, and manage transactions, including income and expenses.
- **Financial Summary Cards**: Display the total income, total expenses, and current balance.
- **Financial Wellness Score**: Assess financial wellness based on spending habits and trends.
- **Payment Calendar**: Visual overview of upcoming and past payments.
- **Data Visualization**: Charts and graphs to visually understand spending and income trends.
- **Reset Balance**: Option to reset all financial data.

## Tech Stack
- **Frontend**: React, Ant Design, react-toastify for notifications
- **Backend**: Firebase Firestore for data storage and authentication
- **Authentication**: Firebase Auth (via `react-firebase-hooks`)
- **Deployment**: Netlify

## Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google Sign-in) and Firestore Database
3. Create a `.env` file in the root directory with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

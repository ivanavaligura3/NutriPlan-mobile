# NutriPlan 📱

NutriPlan is a mobile application for meal planning, recipe management, nutrition tracking, food inventory management, and shopping list organization.

The application is designed to help users organize their meals and food-related activities in one place, making everyday meal planning simpler and more structured.

This project is a mobile version of the NutriPlan application originally developed as a web application.

## ✨ Features

* 🔐 User registration and login
* 📅 Weekly meal planning
* 🍽️ Meal management
* 📖 Recipe management
* 🥗 Food and ingredient management
* 📊 Calorie tracking
* 🛒 Shopping list management
* 📦 Food inventory management
* 🔎 Recipe details
* 📱 Mobile-first interface
* 🧩 Reusable components and organized project structure

## 🛠️ Technologies

* **React Native** – mobile application development
* **Expo** – development and build environment
* **TypeScript** – type-safe development
* **Expo Router** – file-based navigation
* **React Native StyleSheet** – styling
* **Context API** – state management

### Planned technologies

* **Node.js & Express.js** – backend
* **MySQL** – database
* **REST API** – client-server communication
* **JWT / secure sessions** – authentication
* **bcrypt** – password hashing
* **Open Food Facts API** – food and nutritional data

## 📂 Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   │
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── plan.tsx
│   │   ├── recipes.tsx
│   │   ├── groceries.tsx
│   │   ├── shopping.tsx
│   │   └── profile.tsx
│   │
│   ├── add-food.tsx
│   ├── add-meal.tsx
│   ├── add-recipe.tsx
│   ├── add-shopping-item.tsx
│   └── recipe-details.tsx
│
├── components/
├── constants/
├── context/
├── services/
├── styles/
├── types/
└── utils/
```

The project follows a modular structure with separate components, styles, contexts, services, types, constants, and utility functions.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ivanavaligura3/NutriPlan-mobile.git
```

### 2. Navigate to the project

```bash
cd NutriPlan-mobile
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npx expo start
```

You can then open the application using Expo Go, an Android emulator, or another supported Expo development environment.

## 🎯 Project Goals

The main goal of NutriPlan is to provide a centralized solution for everyday meal organization.

The application aims to help users:

* plan meals more efficiently
* organize recipes and ingredients
* keep track of available food
* monitor calorie and nutritional information
* manage shopping lists
* reduce unnecessary food purchases
* simplify everyday meal planning

## 🔮 Future Development

Planned improvements include:

* Connecting the mobile application to the NutriPlan backend
* MySQL database integration
* Persistent user and application data
* Secure server-side authentication
* Open Food Facts API integration
* Extended nutritional information
* Additional meal planning features
* Production-ready Android build
* iOS support

## 👩‍💻 Author

**Ivana Valigura**

Frontend / Web Developer

GitHub:
https://github.com/ivanavaligura3

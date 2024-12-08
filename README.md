# Campus Fitness App

A campus fitness application developed with React Native and Expo, primarily designed for college students, offering features like exercise tracking and PE course management.

## 🔧Configuration Instructions

### Download the project

```bash
git clone https://github.com/HayesWang/Fitness.git
```

### Environment

Make sure you have node, npm, expo-cli installed.

### Dependencies

Fonts
```bash
npm install @expo-google-fonts/rubik @expo-google-fonts/rubik-mono-one
```
Other Dependencies
```bash
npm install @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/native-stack expo-location react-native-maps polyline
```

### API Key

You need to get a Google Maps API key to use the map features.(We have a default free tier for testing)

You need to get a OPENAI API key to use the chatbot and suggestion features.(We have a default free tier for testing)

### Run the app

```bash
npx expo start
```

## Key Features

### 1. Exercise Tracking
- Free Exercise Mode
  - Real-time GPS tracking
  - Display duration, distance, and other metrics
  - Support pause/resume functionality
  - Save exercise records upon completion

- Preset Route Mode
  - Predefined campus running routes
  - Route navigation
  - Real-time progress tracking

### 2. PE Course Management
- Course Calendar
  - Display semester PE course schedule
  - Monthly view with swipe navigation
  - Highlight today's classes
- Course Check-in
  - Location-based attendance
  - Display classroom location and information

### 3. Community Features
- Exercise Community
  - Post exercise updates
  - Like, comment, and share functionality
  - Follow other users
- Course Discussion
  - PE course-related communications

### 4. Profile Center
- Exercise Statistics
  - Monthly exercise frequency
  - Cumulative distance
  - Visual exercise data charts
- Exercise History
  - Detailed exercise record list
  - View exercise routes
  - Clear history option

## Tech Stack

- React Native
- Expo
- React Navigation
- React Native Maps
- AsyncStorage
- Google Directions API

## Project Structure
```
fitness/
├── assets/ # Static resources like images and fonts
├── components/ # Reusable components
├── constants/ # Configuration constants
├── navigation/ # Navigation setup
├── screens/ # Application screens
└── App.js # Application entry point
```

## Important Notes

1. Google Maps API Key configuration required for map features
2. Ensure all necessary fonts are installed before running
3. Device location permissions must be enabled

## Contributing

Issues and Pull Requests are welcome to help improve the project.

## License

MIT License
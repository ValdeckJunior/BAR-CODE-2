# QR Campus

A mobile application built with Expo and React Native for managing course registrations and student identification through QR codes.

## Project Overview

QR Campus is a modern mobile application designed to streamline the course registration verification process in educational institutions. It provides a secure and efficient way for students to manage their course registrations and for staff to verify student attendance through QR code scanning.

## Core Features

- **Student Authentication**

  - Secure login system using matriculation number and password
  - Personal QR code generation for student identification
  - Profile management with student details

- **QR Code Management**

  - Personal QR code display for student identification
  - QR code download functionality
  - QR code scanning for course registration verification

- **Course Management**
  - Course registration verification
  - Results viewing interface
  - Detailed course information display

## Technical Features

- Built with Expo and React Native for cross-platform compatibility
- Type-safe development with TypeScript
- File-based routing using Expo Router
- Dark/Light theme support with automatic system theme detection
- Custom UI components with theme support
- Haptic feedback for enhanced user interaction on iOS
- Native blur effects and animations
- Safe area handling for different device sizes
- Custom fonts integration (Inter and Space Mono)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

You can run the app on:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Project Structure

- `/app` - Main application screens and navigation
- `/assets` - Static assets (fonts, images)
- `/components` - Reusable UI components
- `/constants` - Theme and configuration constants
- `/hooks` - Custom React hooks

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Components**: Custom components with native platform integration
- **Styling**: React Native StyleSheet
- **Authentication**: Local authentication system

## Development Guidelines

The project follows a modular architecture with:

- Component-based development
- Type-safe implementations
- Platform-specific optimizations
- Theme support for light and dark modes
- File-based routing for easy navigation management

## Learn More

To learn more about the technologies used in this project:

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)

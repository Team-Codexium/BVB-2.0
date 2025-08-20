# 🎤 BarsVsBars - The Ultimate Rap Battle Platform

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.15.1-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.8-38B2AC.svg)](https://tailwindcss.com/)

> **Where Legends Are Born** - Challenge rappers worldwide, upload your fire tracks, and let the community decide who's got the sickest bars!

## 🌟 Overview

BarsVsBars is a comprehensive rap battle platform that brings together MCs from around the world to compete in epic lyrical battles. Built with modern web technologies, it features real-time battle management, audio uploads, community voting, and a complete user authentication system with email verification.

## ✨ Features

### 🥊 **Battle System**
- **Challenge Creation**: Send battle requests to any rapper on the platform
- **Battle Acceptance**: Accept or decline incoming challenges
- **Time-Limited Battles**: Configurable time limits (30 minutes to 7 days)
- **Audio Upload**: Upload battle tracks with Cloudinary integration
- **Battle Status Tracking**: Pending → Active → Completed workflow
- **Winner Determination**: Automatic winner selection based on submissions and community voting

### 🎵 **Audio Management**
- **Cloudinary Integration**: Secure audio file storage and streaming
- **Multiple Audio Tracks**: Support for multiple audio files per battle
- **Audio Validation**: Ensure only battle participants can upload audio
- **Audio Retrieval**: Fetch and manage battle audio files

### 👥 **User Management**
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Email Verification**: 6-digit OTP verification system with 10-minute expiration
- **User Profiles**: Complete rapper profiles with rankings and battle history
- **Battle Participation Tracking**: Monitor all battles a rapper has participated in

### 🗳️ **Voting System**
- **Community Voting**: Vote for your favorite battle tracks
- **Vote Tracking**: Prevent duplicate votes from the same user
- **Real-time Results**: Live vote counting and leader display
- **Winner Highlighting**: Visual indicators for leading contestants

### 📧 **Email Notifications**
- **Battle Invitations**: Automatic email notifications for battle challenges
- **Battle Updates**: Notifications when battles are accepted
- **Email Verification**: Professional HTML email templates for OTP delivery
- **Resend Functionality**: 60-second cooldown for OTP resending

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Beautiful dark gradient theme with red accents
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **Real-time Updates**: Live notifications and status updates
- **Search & Filter**: Advanced search and filtering capabilities

### 📊 **Dashboard & Analytics**
- **Battle Statistics**: Track wins, losses, and performance metrics
- **User Rankings**: Leaderboard system with ranking calculations
- **Battle History**: Complete history of all battles participated in
- **Performance Analytics**: Detailed stats and progress tracking

## 🛠️ Technology Stack

### **Frontend**
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Multer** - File upload handling
- **Cloudinary** - Cloud media management

### **Infrastructure**
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Cloud media storage and CDN
- **Gmail SMTP** - Email delivery service

## 📁 Project Structure

```
BarsVsBars/
├── backend/
│   ├── config/
│   │   ├── connectCloudinary.js
│   │   └── mongodb.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── battle.controller.js
│   │   ├── emailVerification.controller.js
│   │   ├── media.controller.js
│   │   └── rapper.controller.js
│   ├── middlewares/
│   │   └── JWTAuth.middleware.js
│   ├── models/
│   │   ├── battle.model.js
│   │   ├── emailVerification.model.js
│   │   └── rapper.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── battle.route.js
│   │   ├── emailVerification.route.js
│   │   ├── media.routes.js
│   │   └── rapper.route.js
│   ├── index.js
│   ├── sendemail.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── BattleCard.jsx
│   │   │   ├── EmailVerification.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── BattleContext.jsx
│   │   │   └── ArtistContext.jsx
│   │   ├── pages/
│   │   │   ├── Artists.jsx
│   │   │   ├── DashBoard.jsx
│   │   │   ├── EmailVerificationPage.jsx
│   │   │   ├── ExploreBattles.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Welcome.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎯 Key Features in Detail

### Email OTP Verification System
- **6-digit OTP** generation with 10-minute expiration
- **Beautiful email templates** with BarsVsBars branding
- **Resend functionality** with 60-second cooldown
- **Auto-focus OTP inputs** for smooth user experience
- **Email verification required** before registration

### Battle Management
- **Challenge System**: Send and accept battle requests
- **Time Management**: Configurable time limits with automatic expiration
- **Status Tracking**: Complete battle lifecycle management
- **Audio Integration**: Secure audio upload and storage
- **Winner Determination**: Automatic and community-based winner selection

### User Experience
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Live notifications and status changes
- **Search & Filter**: Find battles and artists quickly
- **Performance Analytics**: Track your battle statistics
- **Community Features**: Vote, comment, and interact with other rappers

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcrypt
- **Email Verification** to prevent fake accounts
- **Rate Limiting** on OTP requests
- **Input Validation** and sanitization
- **CORS Configuration** for secure API access
- **Environment Variables** for sensitive data
---

**🎤 Stay lyrical, and may the best rapper win! 🎤** 

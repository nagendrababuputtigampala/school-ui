# School Management System UI

A modern, responsive school management system built with React, TypeScript, and Material-UI. Features dynamic content management through Firebase integration with real-time updates.

## ✨ Features

- 🏫 **Dynamic Homepage**: Hero carousel with Firebase-managed images
- 📊 **Live Statistics**: Real-time stats for students, teachers, awards, and years
- 📅 **Interactive Timeline**: School history with expandable descriptions
- 🎨 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🔥 **Firebase Integration**: Real-time data management without deployments
- 🎯 **Material-UI**: Modern, accessible components

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **Backend**: Firebase Firestore
- **Build**: Create React App
- **Styling**: Responsive Material-UI components

## 🚀 Quick Start

```bash
git clone https://github.com/nagendrababuputtigampala/school-ui.git
cd school-ui
npm install
cp .env.example .env
# Edit .env with your Firebase config
npm start
```

## 📋 Prerequisites

- Node.js 18.0.0+ ([Download](https://nodejs.org/))
- Firebase project with Firestore enabled
- Git for version control

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/nagendrababuputtigampala/school-ui.git
cd school-ui
npm install
```

### 2. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing
3. Enable Firestore Database (start in test mode)

#### Get Configuration
1. Project Settings → General tab
2. Your apps section → Add web app
3. Copy the config object

#### Setup Environment
```bash
cp .env.example .env
# Edit .env with your Firebase values
```

Required environment variables:
```env
REACT_APP_API_KEY=your_firebase_api_key
REACT_APP_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_PROJECT_ID=your_firebase_project_id
REACT_APP_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_firebase_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
```

### 3. Add Sample Data (Optional)

Create collection `schoolInfo` with document containing:

```json
{
  "welcomeTitle": "Welcome to EduConnect",
  "welcomeSubtitle": "Empowering minds, shaping futures.",
  "studentsCount": "2,500+",
  "teachersCount": "150+",
  "awardsCount": "50+",
  "yearsCount": "35+",
  "heroImages": [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=1080",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1080"
  ],
  "timeline": [
    {
      "year": "1985",
      "title": "School Founded",
      "description": "EduConnect was established with a vision to provide quality education."
    }
  ]
}
```

### 4. Start Development

```bash
npm start
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
src/
├── components/
│   ├── HeroCarousel.tsx    # Image carousel component
│   └── ui/                 # Reusable UI components
├── config/
│   └── firebase.ts         # Firebase setup and functions
├── pages/
│   ├── HomePage.tsx        # Main landing page
│   └── ...                 # Other pages
└── App.tsx                 # Main app component
```

## 🔨 Available Scripts

- `npm start` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Check code quality
- `npm run lint:fix` - Auto-fix linting issues
- `npm test` - Run tests

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Configure environment variables in your hosting platform:

- **Vercel/Netlify**: Add in project settings
- **GitHub Pages**: Use GitHub Secrets
- **Firebase Hosting**: Use Firebase CLI

### Production Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /schoolInfo/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 🧪 Testing Your Setup

✅ Verify these work:
- Application loads without errors
- Firebase data displays correctly
- Hero carousel auto-advances
- Timeline "Read More" buttons work
- Responsive design on mobile

## 🚨 Troubleshooting

### Firebase Connection Issues
- Check `.env` file values (no extra spaces/quotes)
- Verify Firestore is enabled
- Check browser console for errors

### Build Issues
```bash
npm run lint          # Check code issues
npm cache clean --force  # Clear cache
rm -rf node_modules && npm install  # Reinstall dependencies
```

### Port Already in Use
```bash
npx kill-port 3000   # Kill process on port 3000
PORT=3001 npm start  # Use different port
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔒 Security Note

⚠️ **Important**: The `.env` file contains sensitive Firebase configuration and is not committed to version control. Always use `.env.example` as a template and never commit real API keys.

### Troubleshooting Local Setup Issues

#### Common Issues and Solutions

##### Issue 1: "Firebase project not found" or "Permission denied"

**Solution:**
```bash
# Check your .env file
cat .env

# Verify all values are correct (no extra spaces, quotes, or line breaks)
# Ensure the Firebase project exists and is accessible
```

##### Issue 2: "Module not found" errors

**Solution:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

##### Issue 3: Port 3000 is already in use

**Solution:**
```bash
# Kill process using port 3000
npx kill-port 3000

# Or start on a different port
PORT=3001 npm start
```

##### Issue 4: Build or lint errors

**Solution:**
```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Check TypeScript compilation
npx tsc --noEmit
```

##### Issue 5: Firebase connection issues

**Solution:**
1. Verify internet connection
2. Check Firebase project status in console
3. Ensure Firestore is enabled
4. Verify API key permissions in Firebase console
5. Check browser console for specific error messages

#### Getting Help

If you encounter issues not covered here:

1. **Check the browser console** (F12) for error messages
2. **Verify all environment variables** are correctly set
3. **Ensure Node.js version** is 18.0.0 or higher
4. **Check Firebase project permissions** and billing status
5. **Create an issue** in this repository with:
   - Error message
   - Steps to reproduce
   - Your operating system
   - Node.js version (`node --version`)

### Installation

### Additional Development Commands

Once you have the application running locally, you can use these additional commands:

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run lint`

Runs ESLint to check for code quality and style issues.\
This will help maintain consistent code standards across the project.

### `npm run lint:fix`

Automatically fixes ESLint issues that can be resolved automatically.\
Use this to quickly clean up code style issues.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

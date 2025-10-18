# School Management System UI - Multi-Tenant

A modern, responsive school management system built with React, TypeScript, and Material-UI. **Now supports multiple schools** with dynamic content management through Firebase integration and URL-based school identification.

## ✨ Features

- 🏫 **Multi-Tenant Architecture**: Support unlimited schools with unique URLs
- 📊 **Dynamic Content**: Each school has its own data, branding, and content
- 🎯 **URL-Based Routing**: Access schools via `/school/{schoolSlug}`
- 📅 **Interactive Timeline**: School-specific history with expandable descriptions
- 🎨 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🔥 **Real-time Updates**: Content management without code deployments
- 🎯 **Material-UI**: Modern, accessible components

## 🌟 Multi-School Example URLs

- **EduConnect Academy**: `http://localhost:3000/school/educonnect`
- **Riverside High School**: `http://localhost:3000/school/riverside-high`
- **Tech Institute**: `http://localhost:3000/school/tech-institute`

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI, React Router
- **Backend**: Firebase Firestore (multi-tenant structure)
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
# Visit http://localhost:3000/school/educonnect
```

## 📋 Prerequisites

- Node.js 18.0.0+ ([Download](https://nodejs.org/))
- Firebase project with Firestore enabled
- Git for version control

## 🔧 Multi-Tenant Setup Instructions

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

### 3. Setup School Data (Multi-Tenant)

Create collection `schools` with documents for each school:

#### Sample School Document
```json
{
  "name": "EduConnect Academy",
  "slug": "educonnect",
  "domain": "educonnect.edu",
  "welcomeTitle": "Welcome to EduConnect",
  "welcomeSubtitle": "Empowering minds, shaping futures.",
  "studentsCount": "2,500+",
  "teachersCount": "150+",
  "awardsCount": "50+",
  "yearEstablished": "1989",
  "successRate": "96%",
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
  ],
  "primaryColor": "#1976d2",
  "secondaryColor": "#dc004e",
  "contactInfo": {
    "address": "123 Education Street",
    "phone": "+1 (555) 123-4567",
    "email": "info@educonnect.edu"
  }
}
```

#### Adding Multiple Schools
1. Create additional documents in `schools` collection
2. Use unique `slug` for each school (URL identifier)
3. Access via: `http://localhost:3000/school/{slug}`

### 4. Start Development

```bash
npm start
# Default redirects to: http://localhost:3000/school/educonnect
```

## 📁 Project Structure

```
src/
├── components/
│   ├── HeroCarousel.tsx    # Image carousel component
│   ├── SimpleNav.tsx       # Navigation component
│   ├── SchoolLayout.tsx    # School-specific layout
│   └── ui/                 # Reusable UI components
├── contexts/
│   └── SchoolContext.tsx   # School data management
├── config/
│   └── firebase.ts         # Firebase setup and functions
├── pages/
│   ├── HomePage.tsx        # Main landing page
│   └── ...                 # Other pages
└── App.tsx                 # Main app with routing
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
    // Allow read access to schools
    match /schools/{schoolId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow read access to page content (optional)
    match /pageContent/{contentId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 🧪 Testing Your Multi-Tenant Setup

✅ Verify these work:
- **Default school loads**: `http://localhost:3000` → redirects to `/school/educonnect`
- **School-specific URLs work**: `/school/{your-school-slug}`
- **Each school shows unique data**: Name, content, images, timeline
- **Navigation works**: Between pages within each school
- **Responsive design**: On mobile and desktop
- **Multiple schools**: Create and test additional schools

## 🏫 Managing Multiple Schools

### Adding a New School
1. **Create Firestore document** in `schools` collection
2. **Use unique slug** (e.g., "riverside-high")
3. **Add school data** following the structure above
4. **Access immediately** via `/school/riverside-high`

### School-Specific Features
- **Unique branding**: Each school can have different colors, logos
- **Custom content**: Timeline, statistics, hero images per school
- **Independent navigation**: All pages work within school context
- **URL isolation**: `/school/school1/about` vs `/school/school2/about`

### Example Multi-School Setup
```
🏫 EduConnect Academy     → /school/educonnect
🏫 Riverside High School  → /school/riverside-high  
🏫 Tech Institute         → /school/tech-institute
🏫 Arts Academy          → /school/arts-academy
```

## 🚨 Troubleshooting

### Firebase Connection Issues
- Check `.env` file values (no extra spaces/quotes)
- Verify Firestore is enabled with new `schools` collection
- Check browser console for errors

### School Not Found Errors
- Verify school document exists in `schools` collection
- Check `slug` field matches URL parameter
- Ensure Firestore rules allow read access

### Build Issues
```bash
npm run lint          # Check code issues
npm cache clean --force  # Clear cache
rm -rf node_modules && npm install  # Reinstall dependencies
```

### URL Routing Issues
- Ensure React Router is properly installed
- Check that school slug exists in Firestore
- Verify URL format: `/school/{slug}`

## 📚 Additional Resources

- **[Multi-Tenant Setup Guide](./MULTI_TENANT_SETUP.md)**: Detailed migration instructions
- **Firebase Documentation**: [Firestore Getting Started](https://firebase.google.com/docs/firestore)
- **React Router Documentation**: [React Router v6](https://reactrouter.com/)

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

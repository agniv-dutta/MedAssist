# MedAssist Frontend

React + Vite + Tailwind CSS implementation of the healthcare interface.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   │   ├── Landing.jsx        # Home page
│   │   ├── SymptomChecker.jsx # Chat interface
│   │   ├── Dashboard.jsx      # User dashboard
│   │   ├── MedicalHistory.jsx # Medical records
│   │   └── DoctorConnect.jsx  # Doctor booking
│   ├── utils/
│   │   ├── api.js       # API client functions
│   │   └── firebase.js  # Firebase configuration
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── package.json         # Dependencies
└── index.html          # HTML template
```

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Create Environment File
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase and API credentials.

### Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production
```bash
npm run build
npm run preview  # Preview the production build
```

## 📦 Key Dependencies

- **react**: UI library
- **vite**: Lightning-fast build tool
- **tailwindcss**: Utility-first CSS framework
- **axios**: HTTP client for API calls
- **firebase**: Backend services and authentication

## 🎨 Styling

### Tailwind CSS Classes
- `.btn-primary` - Primary CTA button
- `.btn-secondary` - Secondary button
- `.severity-badge` - Severity level badges
- `.message` - Chat message styling
- `.chat-container` - Chat area container

### Color Scheme
- **Primary**: Blue (#0066CC) - Trust, healthcare
- **Danger**: Red (#DC2626) - Emergency
- **Success**: Green (#10B981) - Positive
- **Warning**: Amber (#F59E0B) - Caution

## 🔄 Component Communication

Components use a simple prop-based navigation pattern:
```jsx
function Landing({ navigate }) {
  return (
    <button onClick={() => navigate('/symptom-checker')}>
      Check Symptoms
    </button>
  )
}
```

## 📡 API Integration

All API calls go through `src/utils/api.js`:

```javascript
import { analyzeSymptoms } from '../utils/api'

const result = await analyzeSymptoms(userId, symptoms, history)
```

## 🔐 Firebase Setup

1. Create Firebase project
2. Enable Authentication and Firestore
3. Copy credentials to `.env.local`
4. User data automatically synced

## 📱 Responsive Breakpoints

- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

Tailwind responsive utilities: `sm:`, `md:`, `lg:`, `xl:`

## ⚡ Performance Tips

- Images lazy-loaded
- Code splitting per route
- Optimized bundle with Vite
- Minimal dependencies
- CSS purging in production

## 🐛 Debugging

Enable React Developer Tools:
- Install React DevTools browser extension
- Check component props and state
- Profile performance

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Web](https://firebase.google.com/docs/web)

---

Built with React & Vite ⚡

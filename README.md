# TaskTrackr# React + TypeScript + Vite



A React + TypeScript web application for managing weekly tasks with automatic user session tracking and metadata capture.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 FeaturesCurrently, two official plugins are available:



### 1. **Login Simulation**- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- Simple email/password login (no real authentication)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- Automatically captures user metadata on login:

  - **Login timestamp** (precise ISO format)## React Compiler

  - **Device information** (browser, OS, device type)

  - **Geolocation** (latitude, longitude, accuracy) if permittedThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



### 2. **Dashboard**## Expanding the ESLint configuration

- Welcome message with user email

- Beautiful card-based layout displaying:If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

  - Login information and timestamp

  - Device details (browser, OS, device type)```js

  - Location information (if permission granted)export default defineConfig([

- Navigation to weekly tasks  globalIgnores(['dist']),

  {

### 3. **Weekly Task Management**    files: ['**/*.{ts,tsx}'],

- **Create tasks** with title and optional description    extends: [

- **Edit tasks** via modal dialog      // Other configs...

- **View all tasks** in a clean card layout

- Each task displays:      // Remove tseslint.configs.recommended and replace with this

  - Creation timestamp      tseslint.configs.recommendedTypeChecked,

  - Last updated timestamp (if edited)      // Alternatively, use this for stricter rules

  - Relative time indicators ("2 hours ago")      tseslint.configs.strictTypeChecked,

- Tasks persist in browser localStorage      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

### 4. **Protected Routes**

- Automatic redirection to login if not authenticated      // Other configs...

- Session management with Zustand + localStorage persistence    ],

    languageOptions: {

## 🛠️ Tech Stack      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- **React 18+** - UI library        tsconfigRootDir: import.meta.dirname,

- **TypeScript** - Type safety      },

- **Vite** - Build tool and dev server      // other options...

- **Material UI (MUI)** - UI components and design system    },

- **React Router v6** - Client-side routing  },

- **Zustand** - State management with persistence])

- **dayjs** - Date/time formatting and manipulation```

- **ua-parser-js** - Device and browser detection

- **Geolocation API** - Browser native location servicesYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:



## 📁 Project Structure```js

// eslint.config.js

```import reactX from 'eslint-plugin-react-x'

src/import reactDom from 'eslint-plugin-react-dom'

├── components/

│   └── common/export default defineConfig([

│       └── ProtectedRoute.tsx      # Route protection component  globalIgnores(['dist']),

├── pages/  {

│   ├── LoginPage.tsx                # Login screen    files: ['**/*.{ts,tsx}'],

│   ├── DashboardPage.tsx            # User dashboard with metadata    extends: [

│   └── TaskListPage.tsx             # Task management page      // Other configs...

├── store/      // Enable lint rules for React

│   └── store.ts                     # Zustand store (session + tasks)      reactX.configs['recommended-typescript'],

├── types/      // Enable lint rules for React DOM

│   ├── user.ts                      # UserSession, DeviceInfo, Location types      reactDom.configs.recommended,

│   └── task.ts                      # TaskEntry type    ],

├── utils/    languageOptions: {

│   ├── userMetadata.ts              # Device info and geolocation utilities      parserOptions: {

│   └── dateUtils.ts                 # Date formatting helpers        project: ['./tsconfig.node.json', './tsconfig.app.json'],

├── App.tsx                          # Main app with routing        tsconfigRootDir: import.meta.dirname,

└── main.tsx                         # App entry point      },

```      // other options...

    },

## 🏃 Getting Started  },

])

### Prerequisites```

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-tracker-meteoros-automation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📱 Usage

### Login
1. Enter any email address (e.g., `user@example.com`)
2. Enter any password
3. Click **Login**
4. Grant location permission when prompted (optional)

### Dashboard
- View your session metadata
- Click **Go to Weekly Tasks** to manage tasks
- Click **Logout** to end your session

### Task Management
- Click **Add Task** to create a new task
- Fill in the title (required) and description (optional)
- Click on the **Edit** icon to modify existing tasks
- Tasks are automatically saved to localStorage

## 🔑 Key Features Explained

### User Session Metadata

The app captures the following metadata on login:

```typescript
interface UserSession {
  email: string;
  loginTime: string;              // ISO timestamp
  deviceInfo: {
    browser: string;              // e.g., "Chrome 120.0"
    os: string;                   // e.g., "Windows 10"
    deviceType: string;           // "desktop" | "mobile" | "tablet"
  };
  location: {
    lat: number;                  // Latitude
    lon: number;                  // Longitude
    accuracy: number;             // Accuracy in meters
    timestamp: number;            // Location timestamp
  } | null;                       // null if permission denied
}
```

### Task Entry Structure

Each task entry contains:

```typescript
interface TaskEntry {
  id: string;                     // UUID
  title: string;                  // Task title
  description: string;            // Task description
  createdAt: string;              // ISO timestamp
  updatedAt: string | null;       // ISO timestamp or null
}
```

### State Persistence

- Uses Zustand with localStorage middleware
- Session and tasks persist across browser refreshes
- Storage key: `tasktrackr-storage`

## 🎨 UI Components

- **Material UI v7** with default light theme
- Responsive design (mobile, tablet, desktop)
- Clean card-based layouts
- MUI icons for visual appeal
- Dialog modals for task editing

## 🔐 Route Protection

Routes are protected using a custom `ProtectedRoute` component:

- `/` - Login page (public)
- `/dashboard` - Dashboard (protected)
- `/tasks` - Task list (protected)
- `*` - Redirects to login

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 🧪 Testing the App

1. **Login Flow:**
   - Use any email/password
   - Check browser console for geolocation requests
   - Grant or deny location permission

2. **Dashboard:**
   - Verify all metadata is displayed correctly
   - Check timestamps are formatted properly

3. **Task Management:**
   - Create multiple tasks
   - Edit existing tasks
   - Verify timestamps update correctly
   - Refresh page to test persistence

4. **Session Management:**
   - Logout and verify redirect to login
   - Try accessing protected routes without login
   - Verify redirect back to login page

## 🌟 Additional Notes

- **No Backend Required:** All data is stored in browser localStorage
- **Privacy:** Location data is only requested once at login and stored locally
- **Time Handling:** All timestamps use ISO format for consistency
- **Responsive:** Works on mobile, tablet, and desktop devices

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

Built with ❤️ using React, TypeScript, and Material UI

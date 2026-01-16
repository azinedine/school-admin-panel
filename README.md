# School Admin Panel (Frontend)

A modern, full-featured school management system frontend built with React, TypeScript, and Vite.

## 🚀 Features

### Core Features
- **Authentication & Authorization** - Role-based access control (RBAC) with Sanctum
- **Multi-language Support** - Arabic, English, and French (i18n)
- **Dark/Light Theme** - Theme switching with persistence
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### Teacher Features
- **Lesson Preparation** - Create, edit, and manage lesson plans
- **Lesson Management** - Track and organize lessons
- **Timetable Management** - View and manage class schedules
- **Grade Management** - Input and track student grades
- **Attendance Tracking** - Record student attendance and tardiness

### Admin Features
- **User Management** - Create, edit, suspend, and delete users
- **Institution Management** - Manage schools and educational institutions
- **Class Management** - Organize classes and subjects
- **Reports & Analytics** - Generate student reports and statistics

### Student Features
- **Grade Viewing** - View grades and academic performance
- **Reports** - Access personalized student reports

## 🛠️ Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite 7
- **Routing:** TanStack Router
- **State Management:** TanStack Query + Zustand
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui + Radix UI
- **Forms:** React Hook Form + Zod
- **i18n:** react-i18next
- **HTTP Client:** Axios
- **Icons:** Lucide React + Tabler Icons

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (see `school-manager-api`)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000`

See [DOCKER_README.md](./DOCKER_README.md) for detailed Docker instructions.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common/shared components
│   ├── features/       # Feature-specific components
│   ├── grades/         # Grade management components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components (shadcn)
├── features/           # Feature modules (API hooks, types)
│   ├── grades/
│   ├── institutions/
│   └── users/
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── api/           # API utilities
│   ├── api-client.ts  # Axios instance
│   ├── logger.ts      # Logging utility
│   └── utils.ts       # General utilities
├── locales/            # i18n translations
│   ├── ar.json
│   ├── en.json
│   └── fr.json
├── pages/              # Page components
├── routes/             # Route definitions
│   ├── __root.tsx
│   ├── _authenticated/ # Protected routes
│   └── login.tsx
├── schemas/            # Zod validation schemas
├── store/              # Zustand stores
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🔑 Key Concepts

### Authentication

The app uses token-based authentication with Laravel Sanctum:

```typescript
// Login
const { login } = useAuthStore()
await login(email, password)

// Logout
const { logout } = useAuthStore()
await logout()

// Check auth status
const { isAuthenticated, user } = useAuthStore()
```

### API Calls

All API calls use TanStack Query for caching and state management:

```typescript
// Example: Fetch users
const { data: users, isLoading } = useUsers()

// Example: Create mutation
const createMutation = useCreateUser()
createMutation.mutate(userData)
```

### Routing

Protected routes are defined in `routes/_authenticated/`:

```typescript
// Example route: /teacher/lessons/preparation
routes/_authenticated/teacher/lessons/preparation.tsx
```

### Forms

Forms use React Hook Form with Zod validation:

```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {...}
})
```

## 🎨 Styling

The project uses Tailwind CSS with custom configuration:

- **Theme:** Dark/Light mode support
- **RTL Support:** Full right-to-left layout support for Arabic
- **Responsive:** Mobile-first design
- **Components:** shadcn/ui components

## 🌐 Internationalization

The app supports three languages:

- **Arabic (ar)** - Right-to-left layout
- **English (en)** - Default
- **French (fr)**

Translation files are in `src/locales/`.

## 🧪 Development

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npm run build
```

### Logging

The app uses a centralized logger:

```typescript
import { logger } from '@/lib/logger'

logger.info('Info message', 'Context')
logger.warn('Warning message', 'Context', data)
logger.error('Error message', 'Context', error)
logger.debug('Debug message', 'Context', data) // Dev only
```

In development, logs are stored in sessionStorage and accessible via `window.logger`.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## 🔒 Security

- **HTTPS Only** in production
- **Token-based auth** with automatic refresh
- **CORS** configured on backend
- **Input validation** with Zod schemas
- **XSS Protection** via React's built-in escaping

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new files
3. Add proper type definitions
4. Use the logger instead of console.log/error
5. Follow the component structure
6. Add translations for all user-facing text

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For issues or questions:
1. Check the documentation files in the project root
2. Review the implementation guides
3. Check the API documentation

## 🔗 Related Projects

- **Backend API:** `../school-manager-api` - Laravel API
- **Documentation:** See root-level `.md` files for detailed guides

---

**Built with ❤️ for educational excellence**

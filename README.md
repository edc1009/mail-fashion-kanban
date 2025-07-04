# 📧 Mail Fashion Kanban


A modern email management kanban application with drag-and-drop interface for effortless email workflow management.

![Mail Fashion Kanban](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue) ![Vite](https://img.shields.io/badge/Vite-5.x-purple)

## ✨ Key Features

### 🎯 Core Functionality
- **📋 Kanban Email Management** - Organize emails into visual kanban columns
- **🖱️ Drag & Drop Operations** - Intuitive drag-and-drop interface for moving email cards
- **📝 Dynamic Column Management** - Add, edit, delete, and reorder kanban columns
- **🎨 Custom Themes** - 8 preset color themes for column customization
- **🔍 Smart Search** - Quick search and filter emails
- **📱 Responsive Design** - Perfect adaptation for desktop and mobile devices

### 📧 Email Features
- **📬 Email Cards** - Display email subject, sender, preview, and timestamp
- **🏷️ Priority Labels** - Visual indicators for high, medium, and low priority
- **📊 Unread Count** - Real-time display of unread email count
- **🔖 Tag System** - Flexible email categorization tags
- **⭐ Important Emails** - Mark and manage important emails

### 🔐 User Experience
- **🔑 Authentication** - Secure user login system
- **🎭 Modern UI** - Built with shadcn/ui component library
- **🌈 Gradient Backgrounds** - Beautiful visual effects
- **⚡ Real-time Updates** - Smooth user interaction experience

## 🛠️ Tech Stack

### Frontend Technologies
- **⚛️ React 18** - Modern frontend framework
- **📘 TypeScript** - Type-safe development experience
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - High-quality UI component library
- **⚡ Vite** - Fast build tool

### State Management & Routing
- **🔄 React Query** - Server state management
- **🛣️ React Router** - Client-side routing
- **📱 React Hooks** - Modern state management

### Backend Integration
- **🗄️ Supabase** - Backend-as-a-Service platform
- **🔐 Supabase Auth** - Authentication service
- **📊 PostgreSQL** - Relational database

### Development Tools
- **🔍 ESLint** - Code quality checking
- **🎯 TypeScript** - Static type checking
- **📦 npm/bun** - Package management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun
- Git

### Installation Steps

1. **Clone the Project**
```bash
git clone <YOUR_REPOSITORY_URL>
cd mail-fashion-kanban
```

2. **Install Dependencies**
```bash
npm install
# or using bun
bun install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and fill in your Supabase configuration
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start Development Server**
```bash
npm run dev
# or using bun
bun dev
```

5. **Open Browser**
Navigate to `http://localhost:8080` to view the application

## 📁 Project Structure

```
src/
├── components/          # React Components
│   ├── ui/             # shadcn/ui Base Components
│   ├── EmailCard.tsx   # Email Card Component
│   ├── EmailInbox.tsx  # Email Inbox
│   ├── EmailKanban.tsx # Main Kanban Component
│   ├── KanbanColumn.tsx # Kanban Column Component
│   └── Header.tsx      # Page Header
├── contexts/           # React Context
│   └── AuthContext.tsx # Authentication Context
├── hooks/              # Custom Hooks
│   ├── use-mobile.tsx  # Mobile Device Detection
│   └── use-toast.ts    # Notification System
├── integrations/       # Third-party Integrations
│   └── supabase/       # Supabase Configuration
├── lib/                # Utility Functions
│   └── utils.ts        # Common Utilities
├── pages/              # Page Components
│   ├── Index.tsx       # Main Page
│   ├── Auth.tsx        # Login Page
│   └── NotFound.tsx    # 404 Page
└── App.tsx             # Application Root Component
```

## 🎮 Usage Guide

### Basic Operations
1. **Login to System** - Use Supabase authentication
2. **View Kanban** - Browse email columns with different statuses
3. **Drag Emails** - Drag email cards to different columns
4. **Manage Columns** - Add, edit, or delete kanban columns
5. **Search Emails** - Use search functionality to quickly find emails

### Advanced Features
- **Custom Column Colors** - Click the edit button next to column titles
- **Priority Management** - Identify email priority by colors
- **Tag Filtering** - Use tags to organize and filter emails

## 🔧 Development Commands

```bash
# Development mode
npm run dev

# Build project
npm run build

# Preview build result
npm run preview

# Code linting
npm run lint

# Development build
npm run build:dev
```

## 🚀 Deployment

### Vercel Deployment
1. Push project to GitHub
2. Connect Vercel to your GitHub repository
3. Configure environment variables
4. Automatic deployment

### Other Platforms
- **Netlify** - Static site deployment support
- **GitHub Pages** - Free static site hosting
- **Railway** - Full-stack application deployment

## 🤝 Contributing

We welcome community contributions! Please follow these steps:

1. Fork this project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type system
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Supabase](https://supabase.com/) - Backend service
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Contact Information

If you have any questions or suggestions, please contact us through:

- 📧 Email: [chen.i1@northeastern.edu]
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/mail-fashion-kanban/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/mail-fashion-kanban/discussions)

---

⭐ If this project helps you, please give us a star!

![GitHub stars](https://img.shields.io/github/stars/your-username/mail-fashion-kanban?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/mail-fashion-kanban?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/your-username/mail-fashion-kanban?style=social)

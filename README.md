# Personal Budget Tracker PWA

A simplified, manual-entry personal finance application built with React, Vite, and Tailwind CSS.

## Features
- **Dashboard**: Overview of balance, monthly budget progress, and spending charts.
- **Transactions**: Add, delete, and view transactions with categories and wallet sources.
- **Offline First**: All data is stored locally in your browser (LocalStorage), making it work perfectly offline.
- **PWA Support**: Installable on mobile and desktop devices.
- **Dark Mode**: Support for light and dark themes.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Key Technologies
- **Vite**: Build tool and dev server.
- **React**: UI library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Shadcn/ui**: Reusable UI components.
- **Recharts**: Data visualization.
- **Vite PWA**: Progressive Web App capabilities.

## Notes
- **Data Persistence**: Data is stored in `localStorage`. Clearing browser data will reset the app.
- **PDF Export**: Currently disabled pending library compatibility fixes. CSV export is available.

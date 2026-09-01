import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CloudDataProvider } from './context/CloudDataContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ComparePage } from './pages/ComparePage';
import { MatrixPage } from './pages/MatrixPage';
import { ManagePage } from './pages/ManagePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CloudDataProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Header />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/matrix" element={<MatrixPage />} />
                <Route path="/manage" element={<ManagePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CloudDataProvider>
    </ThemeProvider>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Home as HomeIcon, Info, Moon, Sun, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Pesquisar from './pages/Pesquisar';
import Sobre from './pages/Sobre';
import './styles/theme.css';
import './styles/components.css';
import './styles/layout.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

function SidebarContent() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const app = document.querySelector('.app');
    if (app) {
      if (isCollapsed) {
        app.classList.add('sidebar-collapsed');
      } else {
        app.classList.remove('sidebar-collapsed');
      }
    }
  }, [isCollapsed]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Botão Hambúrguer para Mobile - Só aparece quando sidebar está fechado */}
      {!isMobileMenuOpen && (
        <button 
          className="sidebar-toggle-mobile"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay para Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
              <Search size={24} />
              {!isCollapsed && <span className="logo-text">SearchBench</span>}
            </Link>
            {isMobileMenuOpen && (
              <button 
                className="sidebar-close-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
            title={isCollapsed ? 'Início' : ''}
          >
            <HomeIcon size={20} />
            {!isCollapsed && <span>Início</span>}
          </Link>

          <div className="tooltip-wrapper">
            <Link 
              to="/pesquisar" 
              className={`sidebar-link sidebar-link-primary ${isActive('/pesquisar') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
              title={isCollapsed ? 'Pesquisar' : ''}
            >
              <Search size={20} />
              {!isCollapsed && <span>Pesquisar</span>}
            </Link>
            {!isCollapsed && (
              <span className="tooltip tooltip-sidebar">
                Clique para realizar buscas no sistema e comparar algoritmos de busca em tempo real
              </span>
            )}
          </div>

          <Link 
            to="/sobre" 
            className={`sidebar-link ${isActive('/sobre') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
            title={isCollapsed ? 'Sobre' : ''}
          >
            <Info size={20} />
            {!isCollapsed && <span>Sobre</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}

function AppContent() {
  return (
    <Router>
      <div className="app">
        <SidebarContent />
        <div className="app-wrapper">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pesquisar" element={<Pesquisar />} />
              <Route path="/sobre" element={<Sobre />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="container">
              <p>&copy; 2025 SearchBench by Arthur Silva</p>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;


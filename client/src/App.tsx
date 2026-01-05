import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCurrentUser } from './store/authSlice';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AccessibilityWidget from './components/AccessibilityWidget/AccessibilityWidget';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Recipes from './pages/Recipes/Recipes';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import Favorites from './pages/Favorites/Favorites';
import Admin from './pages/Admin/Admin';
import About from './pages/About/About';
import Groups from './pages/Groups/Groups';
import GroupDetail from './pages/GroupDetail/GroupDetail';
import JoinGroup from './pages/JoinGroup/JoinGroup';
import Ethnicities from './pages/Ethnicities/Ethnicities';
import './styles/global.scss';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <span className="loading-text">טוען...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-wrapper">
        {/* Skip to Content Link - First focusable element */}
        <a href="#main-content" className="skip-link">
          דלג לתוכן הראשי
        </a>

        {/* Header Navigation */}
        <Header />

        {/* Main Content Area */}
        <main id="main-content" className="main-content" role="main" aria-label="תוכן ראשי">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/ethnicities" element={<Ethnicities />} />
            <Route path="/about" element={<About />} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/groups/join/:inviteCode" element={<ProtectedRoute><JoinGroup /></ProtectedRoute>} />
            <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Accessibility Widget - Floating Button */}
        <AccessibilityWidget />
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </Provider>
  );
}

export default App;

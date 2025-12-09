import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import MatrixBackground from './components/MatrixBackground';
import AuroraBackground from './components/AuroraBackground';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Converter from './pages/Converter';

const PrivateRoute = ({ children }) => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="text-green-500 text-center mt-20 font-mono">
        INICIALIZANDO PROTOCOLOS...
      </div>
    );
  }

  return signed ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuroraBackground />

        <div className="relative z-10 min-h-screen flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route
              path="/converter"
              element={
                <PrivateRoute>
                  <Converter />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

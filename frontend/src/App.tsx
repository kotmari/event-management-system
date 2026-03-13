import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { EventsPage } from "./pages/EventsPage";
import { MyEventsPage } from "./pages/MyEventsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { CreateEventPage } from "./pages/CreateEventPage";
import { Header } from "./components/header/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { JoinEventPage } from "./pages/JoinEventPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/:id" element={<EventDetailsPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route
              path="/user/me/events"
              element={
                <ProtectedRoute>
                  <MyEventsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/:id/edit"
              element={
                <ProtectedRoute>
                  <EditEventPage />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/:id/join"
              element={
                <ProtectedRoute>
                  <JoinEventPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;

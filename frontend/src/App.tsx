import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { EventsPage } from "./pages/EventsPage";
import { MyEventsPage } from "./pages/MyEventsPage";
import { AuthPage } from "./pages/AuthPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { CreateEventPage } from "./pages/CreateEventPage";
import { Header } from "./components/header/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { EditEventPage } from "./pages/EditEventPage";
import { MainLayout } from "./components/layout/MainLayout";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Header />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<AuthPage />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/user/me/events" element={<MyEventsPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/events/:id/edit" element={<EditEventPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

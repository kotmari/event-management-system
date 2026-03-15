import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import {
  LogOut,
  MenuSquare,
  NotebookPen,
  NotebookTabs,
  Plus,
} from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row  items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-accent"
            >
              <NotebookTabs className="size-6 text-gray-800" />
              <span>Event app</span>
            </Link>
          </div>
          <nav className="flex items-center gap-5">
            {user && (
              <div className="flex gap-3">
                <Link
                  to="/events"
                  className="flex items-center gap-1 text-sm font-medium group hover:text-accent transition-colors"
                >
                  <MenuSquare className="size-6 group-hover:text-accent" />{" "}
                  Events
                </Link>
                <Link
                  to="/user/me/events"
                  className="flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors"
                >
                  <NotebookPen className="size-5 group-hover:text-accent" /> My
                  events
                </Link>
                <Link
                  to="/events/create"
                  className="flex items-center gap-1 text-sm font-medium bg-accent hover:bg-accent/80 py-1.5 px-3 rounded-xl transition-colors"
                >
                  <Plus className="size-5 text-white" />{" "}
                  <span className="text-white">Create</span>
                </Link>
                <div className="flex flex-col items-center pl-4 border-l border-gray-200">
                  <div className="size-8 rounded-full bg-violet-300 flex items-center justify-center text-sm font-bold text-gray-800">
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  title="Exit"
                >
                  <LogOut className="size-5" />
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

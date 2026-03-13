import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../Button";
import {
  LogOut,
  MenuSquare,
  NotebookPen,
  NotebookTabs,
  Plus,
  User,
} from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/", { replace: true });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="max-w-6xl mx-auto px-6 h-16">
        <div className="flex h-16 items-center justify-between">
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
            {user ? (
              <>
                <Link
                  to="/"
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
                  to="/create"
                  className="flex items-center gap-1 text-sm font-medium bg-accent hover:bg-accent/80 py-1.5 px-3 rounded-xl transition-colors"
                >
                  <Plus className="size-5 text-white" />{" "}
                  <span className="text-white">Create</span>
                </Link>
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <div className="size-8 rounded-full bg-violet-400 flex items-center justify-center">
                    <User className="size-5 text-gray-800" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                  title="Exit"
                >
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-medium hover:text-accent">
                  All public events
                </Link>
                <Link to="/auth/login" className="text-sm font-medium">
                  <Button size="sm" variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register" className="text-sm font-medium">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

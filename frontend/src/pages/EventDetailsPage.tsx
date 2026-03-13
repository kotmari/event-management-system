import { useEffect } from "react";
import { useEventStore } from "../store/useEventStore";
import {
  Calendar,
  MapPin,
  Loader2,
  UserCheck2,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/Button";
import { formatDate } from "../utils/date";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentEvent, isLoading, error, joinEvent, fetchEventById } =
    useEventStore();

  useEffect(() => {
    fetchEventById(Number(id));
  }, [id, fetchEventById]);

  const event = currentEvent;

  const handleJoinClick = async (eventId: number) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    await joinEvent(eventId);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-10 animate-spin text-accent" />
      </div>
    );
  }
  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="text-center mt-20">Event not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors mb-6 group"
      >
        <div className="p-2 rounded-full bg-gray-100 group-hover:bg-accent/10 transition-colors">
          <ArrowLeft className="size-4" />
        </div>
        <span className="font-medium">Back to events</span>
      </button>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Details Event</h1>
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {event.description}
        </p>
        <p className="text-gray-700">
          <span className="text-gray-400 mr-2">Organizer:</span>
          <span className="font-semibold">
            {event.organizer?.name || "Unknown"}
          </span>
        </p>
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="size-4" />
            <span>{formatDate.fullDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="size-4" />
            <span>{formatDate.time(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="size-4" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserCheck2 className="size-4" />
            <span>{event.participants?.length || 0}</span>
          </div>
        </div>
        <div className="flex gap-5 mt-6">
          <Link
            to={`/${event.id}/join`}
            onClick={() => handleJoinClick(event.id)}
          >
            <Button variant="primary" className="w-xs">
              Join
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

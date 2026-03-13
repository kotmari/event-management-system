import { useEffect, useState } from "react";
import { useEventStore } from "../store/useEventStore";
import {
  Calendar,
  MapPin,
  Loader2,
  UserCheck2,
  Clock,
  Search,
} from "lucide-react";
import { Button } from "../components/Button";
import { formatDate } from "../utils/date";
import { Card } from "../components/Card";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const EventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events, isLoading, error, joinEvent, fetchEvents } = useEventStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Discover Events</h1>
      <div className="relative mb-10 max-w-xl">
        <Search className="absolute right-3 top-3.5 size-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search events by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-20">
          There are no events yet. Be the first to create one!
        </p>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-2">
            No events found for "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-accent hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              variant="bordered"
              className="group overflow-hidden hover:scale-101 transition-all duration-300"
            >
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                  {event.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {event.description}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  Organizer:{" "}
                  <span className="font-bold">{event.organizer.name}</span>
                </p>
                <div className="space-y-2">
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
                    className="w-full"
                    onClick={() => handleJoinClick(event.id)}
                  >
                    <Button variant="primary" className="w-full">
                      Join
                    </Button>
                  </Link>
                  <Link to={`/${event.id}`} className="w-full">
                    <Button variant="ghost" className="w-full">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

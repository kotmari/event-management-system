import { useEffect, useState } from "react";
import { useEventStore } from "../store/useEventStore";
import {
  Calendar,
  MapPin,
  Loader2,
  UserCheck2,
  Clock,
  ArrowLeft,
  Trash2,
  Edit2,
} from "lucide-react";
import { Button } from "../components/Button";
import { formatDate } from "../utils/date";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ConfirmModal } from "../components/ConfirmModal";

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentEvent,
    isLoading,
    error,
    joinEvent,
    leaveEvent,
    deleteEvent,
    fetchEventById,
  } = useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEventById(Number(id));
  }, [id, fetchEventById]);

  const event = currentEvent;

  const isOrganizer = user?.id === event?.organizerId;
  const isJoined = event?.participants?.some(
    (p) => p.userId === Number(user?.id),
  );

  const handleJoinLeave = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    if (isJoined) await leaveEvent(event!.id);
    else await joinEvent(event!.id);
  };

  const handleDelete = async () => {
    if (currentEvent) {
      await deleteEvent(currentEvent.id);
      navigate("/user/me/events");
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-10 animate-spin text-accent" />
      </div>
    );
  if (error)
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  if (!event) return <div className="text-center mt-20">Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 mb-6 hover:text-accent"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-600 mb-6">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="size-4" /> {formatDate.fullDate(event.date)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" /> {formatDate.time(event.date)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4" /> {event.location}
          </div>
          <div className="flex items-center gap-2">
            <UserCheck2 className="size-4" /> Capacity: {event.capacity}
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-semibold mb-3 text-accent">
            Participants ({event.participants?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-2">
            <ol className="list-decimal list-inside space-y-2">
              {event.participants?.map((p) => (
                <li
                  key={p.userId}
                  title={p.user.name}
                  className="text-sm font-medium text-gray-700"
                >
                  {p.user.name}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t">
          {isOrganizer ? (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(`/events/${event.id}/edit`)}
              >
                <Edit2 className="size-4 mr-2" /> Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsModalOpen(true)}
              >
                <Trash2 className="size-4 mr-2" /> Delete
              </Button>
            </>
          ) : (
            <Button
              variant={isJoined ? "outline" : "primary"}
              onClick={handleJoinLeave}
            >
              {isJoined ? "Leave Event" : "Join Event"}
            </Button>
          )}
        </div>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Event"
          message="Are you sure you want to delete this event?"
        />
      </div>
    </div>
  );
};

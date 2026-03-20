import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, UserCheck2 } from "lucide-react";
import type {IEvent}  from "../types/index"; 
import { TagBadge } from "./ui-components/TagBadge";
import { Button } from "./ui-components/Button";
import { Card} from "./ui-components/Card"; 
import { formatDate } from "../utils/date";

interface EventCardProps {
  event: IEvent;
  currentUserId: number | null;
  joinEvent: (id: number) => void;
  leaveEvent: (id: number) => void;
}

export const EventCard = ({ event, currentUserId, joinEvent, leaveEvent }: EventCardProps) => {
  const isJoined = event.participants?.some((p) => p.userId === currentUserId);
  const isOrganizer = event.organizerId === currentUserId;
  const isFull = event.capacity && (event.participants?.length || 0) >= event.capacity;

  return (
    <Card variant="bordered" className="group overflow-hidden flex flex-col h-full">
      <div className="p-5 grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {event.description}
        </p>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {event.tags.map((t) => (
              <TagBadge key={t.id} name={t.name} variant="compact" />
            ))}
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4">
          Organizer: <span className="font-bold">{event.organizer.name}</span>
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
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserCheck2 className="size-4" />
            <span>
              {event.participants?.length || 0}
              {event.capacity ? ` / ${event.capacity}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto flex gap-3">
        {isOrganizer ? (
          <Button
            disabled
            className="w-full text-[10px] bg-blue-300 text-blue-600 border-accent cursor-default"
          >
            You are Organizer
          </Button>
        ) : isFull && !isJoined ? (
          <Button disabled className="w-full bg-gray-300">
            Full
          </Button>
        ) : isJoined ? (
          <Button
            variant="ghost"
            className="w-full border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => leaveEvent(event.id)}
          >
            Leave
          </Button>
        ) : (
          <Button
            variant="primary"
            className="w-full"
            onClick={() => joinEvent(event.id)}
          >
            Join
          </Button>
        )}

        <Link to={`/events/${event.id}`} className="w-full">
          <Button variant="ghost" className="w-full">
            Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
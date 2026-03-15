import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { IEvent } from "../types";

export interface CalendarCellProps {
  day: Date;
  isSelected?: boolean;
  events: IEvent[];
  className?: string;
}

export const CalendarCell = ({ day, isSelected, events, className }: CalendarCellProps) => {
  const navigate = useNavigate();


  const handleCellClick = () => {
    if (events.length === 0) {
      navigate(`/events/create?date=${format(day, "yyyy-MM-dd")}`);
    }
  };

 
  const handleEventClick = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation(); 
    navigate(`/events/${eventId}`);
  };

  return (
    <div
      onClick={handleCellClick}
      className={`border p-2 h-24 relative transition-all duration-200 
        ${events.length === 0 ? "cursor-pointer hover:bg-blue-50" : "cursor-default"}
        ${isSelected ? "border-accent border-2" : "border-gray-200"}
        ${className}`}
    >
      <span className={`text-sm ${isSelected ? "text-accent font-bold" : "text-gray-600"}`}>
        {format(day, "d")}
      </span>

      <div className="mt-1 space-y-1">
        {events.map((ev) => (
          <div
            key={ev.id}
            onClick={(e) => handleEventClick(e, ev.id)}
            className="text-xs bg-indigo-100 text-accent px-1 py-1.75 rounded truncate cursor-pointer hover:bg-indigo-200"
          >
            {format(new Date(ev.date), "HH:mm")} · {ev.title}
          </div>
        ))}
      </div>
    </div>
  );
};
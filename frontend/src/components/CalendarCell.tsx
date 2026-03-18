import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { IEvent } from "../types";
import { TAG_CONFIG } from "../constants/tags";

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

      <div className="mt-1 space-y-1 overflow-y-auto max-h-[80%] custom-scrollbar">
        {events.map((ev) => {
          const firstTag = ev.tags?.[0]?.name;
          const tagStyle = TAG_CONFIG[firstTag as keyof typeof TAG_CONFIG] || TAG_CONFIG.Default;
          return (
          <div
            key={ev.id}
            onClick={(e) => handleEventClick(e, ev.id)}
            style={{ 
                backgroundColor: tagStyle.bg, 
                color: tagStyle.text,       
                borderLeft: `3px solid ${tagStyle.border}`
              }}
            className="text-[10px] px-1.5 py-1 rounded-sm truncate cursor-pointer hover:brightness-95 transition-all shadow-sm font-medium mb-1"
          >
            {format(new Date(ev.date), "HH:mm")} · {ev.title}
          </div>
          )
})}
      </div>
    </div>
  );
};
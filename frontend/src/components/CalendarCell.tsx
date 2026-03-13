import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { IEvent } from "../types";

interface CalendarCellProps {
  day: Date;
  isSelected?: boolean;
  events: IEvent[]; 
  className?: string;
}

export const CalendarCell = ({ day, isSelected, events, className }: CalendarCellProps) => {
  return (
    <Link
      to={`/create?date=${format(day, "yyyy-MM-dd")}`}
      className={`border p-2 h-24 relative transition-all duration-200 
        hover:bg-blue-50 hover:border-blue-300 flex flex-col
        ${isSelected ? "border-accent border-2" : "border-gray-200"}
        ${className}`}
    >
      <span className={`text-sm ${isSelected ? "text-accent font-bold" : "text-gray-600"}`}>
        {format(day, "d")}
      </span>

      <div className="mt-1 space-y-1">
        {events.map((ev) => (
          <div key={ev.id} className="text-[10px] bg-indigo-100 text-accent px-1 py-0.5 rounded truncate">
            {format(new Date(ev.date), "HH:mm")} · {ev.title}
          </div>
        ))}
      </div>
    </Link>
  );
};
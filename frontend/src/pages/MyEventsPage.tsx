import { useEventStore } from "../store/useEventStore";
import { useEffect, useState } from "react";
import { CalendarCell } from "../components/CalendarCell";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
} from "date-fns";

import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const MyEventsPage = () => {
  const { myEvents, isLoading, fetchMyEvents } = useEventStore();

  const [hasTriedLoading, setHasTriedLoading] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      await fetchMyEvents();
      setHasTriedLoading(true);
    };
    loadEvents();
  }, [fetchMyEvents]);

  const getEventsForDay = (day: Date) => {
    return myEvents.filter((event) => isSameDay(new Date(event.date), day));
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let daysCells = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        daysCells.push(
          <CalendarCell
            key={day.toString()}
            day={day}
            isSelected={isSameDay(day, new Date())}
            events={getEventsForDay(day)}
          />,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {daysCells}
        </div>,
      );
      daysCells = [];
    }
    return rows;
  };

  const renderWeek = () => {
    const weekStart = startOfWeek(currentDate);
    const daysArr = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      daysArr.push(
        <CalendarCell
          key={day.toString()}
          day={day}
          isSelected={isSameDay(day, currentDate)}
          events={getEventsForDay(day)}
          className="h-28 rounded-xl"
        />,
      );
    }

    return <div className="grid grid-cols-7 gap-4">{daysArr}</div>;
  };

  if (isLoading) return <div>Loading calendar...</div>;

  if (hasTriedLoading && myEvents.length === 0) {
    return (
      <div className="max-w-6xl mx-auto pt-16">
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold mb-2">No events yet</h3>
          <p className="text-gray-500 mb-6">
            You are not part of any events yet. Explore public events and join.
          </p>
          <Link
            to="/events"
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            Explore public events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-16">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Events</h1>
          <p className="text-gray-500 text-sm">
            View and manage your event calendar
          </p>
        </div>

        <Link
          to="/events/create"
          className="flex items-center gap-1 text-sm font-medium bg-accent hover:bg-accent/80 py-1.5 px-3 rounded-xl transition-colors"
        >
          <Plus className="size-5 text-white" />{" "}
          <span className="text-white">Create</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="border px-1 rounded">
            ◀
          </button>

          <span className="font-medium text-accent">
            {format(currentDate, "MMMM yyyy")}
          </span>

          <button onClick={nextMonth} className="border px-1 rounded">
            ▶
          </button>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded-xl ${
              view === "month" && "bg-accent text-white"
            }`}
          >
            Month
          </button>

          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded-xl ${
              view === "week" && "bg-accent text-white"
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {view === "month" && (
        <>
          <div className="grid grid-cols-7 bg-foreground/10 text-sm text-gray-500 rounded-t-lg p-1">
            {days.map((day) => (
              <div key={day} className="text-center">
                {day}
              </div>
            ))}
          </div>

          <div className="border rounded-b-lg overflow-hidden">
            {renderMonth()}
          </div>
        </>
      )}


      {view === "week" && renderWeek()}
    </div>
  );
};

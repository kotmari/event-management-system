import { useEffect, useState } from "react";
import { useEventStore } from "../store/useEventStore";
import { Loader2, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { TagBadge } from "../components/ui-components/TagBadge";
import { Input } from "../components/ui-components/Input";
import { EventCard } from "../components/EventCard";

export const EventsPage = () => {
  const { user } = useAuthStore();
  const {
    events,
    tags,
    isLoading,
    error,
    joinEvent,
    fetchEvents,
    fetchTags,
    leaveEvent,
  } = useEventStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const currentUserId = user ? Number(user.id) : null;

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTags(), fetchEvents()]);
      setIsFirstLoad(false);
    };
    loadData();
  }, [fetchEvents, fetchTags]);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFilter = (id: number | null) => {
    setActiveTag(id);
    fetchEvents(id || undefined);
  };

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Discover Events</h1>
      <div className="flex gap-2 justify-center flex-wrap sm:justify-end mb-8">
        <TagBadge
          name="All"
          isSelected={activeTag === null}
          onClick={() => handleFilter(null)}
        />
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            name={tag.name}
            isSelected={activeTag === tag.id}
            onClick={() => handleFilter(tag.id)}
          />
        ))}
      </div>
      <div className="relative mb-10 max-w-xl">
        <Search className="absolute right-3 top-3.5 size-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search events by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </div>
      {isLoading || isFirstLoad ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-accent" />
        </div>
      ) : (
        <>
          {events.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
              <p className="text-gray-500">There are no events yet.</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                <Search className="size-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                No results for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-accent hover:text-accent/80 font-semibold mt-2 transition-colors"
              >
                Clear search and see all events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUserId={currentUserId}
                  joinEvent={joinEvent}
                  leaveEvent={leaveEvent}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

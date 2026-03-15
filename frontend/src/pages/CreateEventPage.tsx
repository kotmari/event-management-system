import { useNavigate, useSearchParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import type { IEventForm } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventSchema } from "../utils/validation";
import { useEventStore } from "../store/useEventStore";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { Button } from "../components/Button";

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateFromUrl = searchParams.get("date");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<IEventForm>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      date: dateFromUrl || "",
      isPublic: true,
    },
  });

  const { createEvent, isLoading } = useEventStore();

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: IEventForm) => {
    const selectedDateTime = new Date(`${data.date}T${data.time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      setError("time", {
        message: "The selected time has already passed",
      });
      return;
    }

    const eventPayload = {
      title: data.title,
      description: data.description,
      date: selectedDateTime.toISOString(),
      location: data.location,
      capacity: data.capacity ? Number(data.capacity) : null,
      isPublic: data.isPublic,
    };

    await createEvent(eventPayload);
    navigate("/user/me/events");
    reset();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors mb-6 group"
      >
        <div className="p-2 rounded-full bg-gray-100 group-hover:bg-accent/10 transition-colors">
          <ArrowLeft className="size-4" />
        </div>
        <span className="font-medium">Back to events calendar</span>
      </button>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold">Create New Event</h2>
        <p>Fill in the details to create an amazing event </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <Input
            label={<span>Event Title <span className="text-red-500">*</span></span>}
            type="text"
            placeholder="e.g., Tech Conference 2026"
            {...register("title")}
            error={errors.title?.message}
          />
          <Textarea
            label={<span>Description <span className="text-red-500">*</span></span>}            
            rows={3}
            placeholder="Describe what makes your event special..."
            {...register("description")}
            error={errors.description?.message as string}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label={<span>Date <span className="text-red-500">*</span></span>}
                type="date"
                min={today}
                {...register("date")}
                error={errors.date?.message as string}
              />
            </div>
            <div className="flex-1">
              <Input
                label={<span>Time <span className="text-red-500">*</span></span>}
                type="time"
                {...register("time")}
                error={errors.time?.message as string}
              />
            </div>
          </div>
          <Input
            label={<span>"Location <span className="text-red-500">*</span></span>}
            type="text"
            placeholder="e.g., Convention Center, San Francisco"
            {...register("location")}
            error={errors.location?.message as string}
          />
          <div>
            <Input
              label="Capacity (optional)"
              type="number"
              placeholder="Leave empty for unlimited"
              {...register("capacity")}
              error={errors.capacity?.message as string}
            />
            <span className="text-xs">
              Maximum number of participants. Leave empty for unlimited
              capacity.
            </span>
          </div>

          <div>
            <p className="font-semibold mb-2">Visibility</p>
            <div className="flex items-center gap-2">
              <Input
                type="radio"
                {...register("isPublic")}
                value="true"
                defaultChecked={true}
                className="accent-accent"
              />
              <span className="text-sm font-semibold">
                Public - Anyone can see and join this event
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="radio"
                {...register("isPublic")}
                value="false"
                className="accent-accent"
              />
              <span className="text-sm font-semibold">
                Private - Only invited people can see this event
              </span>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button variant="primary" className="w-full" type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

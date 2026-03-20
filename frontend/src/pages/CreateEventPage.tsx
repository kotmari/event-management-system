import { useNavigate, useSearchParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import type { IEventForm } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventSchema } from "../utils/validation";
import { useEventStore } from "../store/useEventStore";
import { Input } from "../components/ui-components/Input";
import { Textarea } from "../components/ui-components/Textarea";
import { Button } from "../components/ui-components/Button";
import { TAG_CONFIG } from "../constants/tags";
import { useEffect } from "react";

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateFromUrl = searchParams.get("date");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    reset,
  } = useForm<IEventForm>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: dateFromUrl || "",
      time: "",
      isPublic: true,
      tagIds: [],
      capacity: null,
    },
  });

  const { createEvent, tags, fetchTags } = useEventStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

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
      tagIds: data.tagIds,
      date: selectedDateTime.toISOString(),
      location: data.location,
      capacity: data.capacity ? Number(data.capacity) : null,
      isPublic: data.isPublic,
    };

    await createEvent(eventPayload);
    navigate("/user/me/events");
    reset();
  };

  const selectedTagIds = watch("tagIds") || [];

  const toggleTag = (tagId: number) => {
    const currentTags = Array.isArray(selectedTagIds)
      ? [...selectedTagIds]
      : [];
    const index = currentTags.indexOf(tagId);

    if (index > -1) {
      currentTags.splice(index, 1);
    } else if (currentTags.length < 5) {
      currentTags.push(tagId);
    }
    setValue("tagIds", currentTags, { shouldValidate: true });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-gray-500 mb-6 hover:text-accent group transition-all duration-200 px-0 bg-transparent hover:bg-transparent border-0"
      >
        <span className="flex items-center justify-center rounded-full border border-gray-200 p-2 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-200">
          <ArrowLeft className="size-4" />
        </span>
        <span className="font-medium">Back to events details</span>
      </Button>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold">Create New Event</h2>
        <p>Fill in the details to create an amazing event </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <Input
            label={
              <span>
                Event Title <span className="text-red-500">*</span>
              </span>
            }
            type="text"
            placeholder="e.g., Tech Conference 2026"
            {...register("title")}
            error={errors.title?.message}
          />
          <Textarea
            label={
              <span>
                Description <span className="text-red-500">*</span>
              </span>
            }
            rows={3}
            placeholder="Describe what makes your event special..."
            {...register("description")}
            error={errors.description?.message as string}
          />
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Select Categories{" "}
              <span className="text-gray-400 font-normal">(up to 5)</span>
            </label>

            <div className="flex flex-wrap gap-3 p-4 border border-gray-200 rounded-2xl bg-gray-50/50">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                const config = TAG_CONFIG[tag.name] || TAG_CONFIG.Default;
                const Icon = config.icon;

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      backgroundColor: isSelected ? config.bg : "white",
                      borderColor: isSelected ? config.border : "#E5E7EB",
                      color: isSelected ? config.text : "#6B7280",
                      ...(isSelected && { ringColor: config.border }),
                    }}
                    className={`
            flex items-center gap-2 px-3 py-1 rounded-xl border transition-all duration-200
            hover:shadow-md active:scale-95 shadow-sm
            ${isSelected ? "border-2 ring-2 ring-offset-1" : "opacity-70 hover:opacity-100"}
          `}
                  >
                    <Icon
                      className={`size-4 ${isSelected ? "animate-pulse" : ""}`}
                    />
                    <span className="text-sm font-medium">{tag.name}</span>
                  </button>
                );
              })}
            </div>

            {errors.tagIds && (
              <p className="text-xs text-red-500 mt-1">
                {errors.tagIds.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label={
                  <span>
                    Date <span className="text-red-500">*</span>
                  </span>
                }
                type="date"
                min={today}
                {...register("date")}
                error={errors.date?.message as string}
              />
            </div>
            <div className="flex-1">
              <Input
                label={
                  <span>
                    Time <span className="text-red-500">*</span>
                  </span>
                }
                type="time"
                {...register("time")}
                error={errors.time?.message as string}
              />
            </div>
          </div>
          <Input
            label={
              <span>
                Location <span className="text-red-500">*</span>
              </span>
            }
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

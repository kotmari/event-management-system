import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import type { IEventForm, ITag } from "../types";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventSchema } from "../utils/validation";
import { useEventStore } from "../store/useEventStore";
import { Input } from "../components/ui-components/Input";
import { Textarea } from "../components/ui-components/Textarea";
import { Button } from "../components/ui-components/Button";
import { useEffect } from "react";
import { TAG_CONFIG } from "../constants/tags";

export const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEvent, fetchEventById, updateEvent, tags, fetchTags, isLoading } =
    useEventStore();

  useEffect(() => {
    if (id) fetchEventById(Number(id));
    fetchTags()
  }, [id, fetchEventById, fetchTags]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IEventForm>({
    resolver: yupResolver(eventSchema),

    values: currentEvent
      ? {
          title: currentEvent.title,
          description: currentEvent.description,
          tagIds: currentEvent.tags?.map((t: ITag) => t.id) || [],
          date: currentEvent.date.split("T")[0],
          time: currentEvent.date.split("T")[1].substring(0, 5),
          location: currentEvent.location,
          capacity: currentEvent.capacity ? Number(currentEvent.capacity) : undefined,
          isPublic: currentEvent.isPublic,
        }
      : undefined,
  });

  const selectedTagIds = watch("tagIds") || [];
  const today = new Date().toISOString().split("T")[0];

  const toggleTag = (tagId: number) => {
    const currentIds = [...selectedTagIds];
    const index = currentIds.indexOf(tagId);
    if (index === -1) {
      currentIds.push(tagId);
    } else {
      currentIds.splice(index, 1);
    }
    setValue("tagIds", currentIds, { shouldValidate: true });
  };


  const onSubmit = async (data: IEventForm) => {
    if (!id) return;

    const fullDate = new Date(`${data.date}T${data.time}`).toISOString();

    const payload = {
      title: data.title,
      description: data.description,
      tagIds: data.tagIds,
      date: fullDate,
      location: data.location,
      capacity: data.capacity ? Number(data.capacity) : null,
      isPublic: data.isPublic,
    };


    await updateEvent(Number(id), payload);
    navigate(`/events/${id}`);
  };

  if (isLoading) return <div>Loading...</div>;

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
        <span className="font-medium">Back</span>
      </Button>

      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold">Edit Event</h2>
        <p>Edit the details to organize an unforgettable event</p>
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
          <div>
            <label className="block text-sm font-semibold mb-3">Select Categories</label>
            <div className="flex flex-wrap gap-2">
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
                      backgroundColor: isSelected ? config.bg : 'white',
                      borderColor: isSelected ? config.border : '#E5E7EB',
                      color: isSelected ? config.text : '#6B7280',
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                      isSelected ? 'border-2 ring-1 ring-offset-1' : 'opacity-80'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{tag.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.tagIds && <p className="text-red-500 text-xs mt-1">{errors.tagIds.message}</p>}
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
                "Location <span className="text-red-500">*</span>
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
              Edit Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

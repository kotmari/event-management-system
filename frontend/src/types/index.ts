export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterFormData) => Promise<boolean>;
  login: (data: LoginFormData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void
  setToken: (token: string) => void;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
export interface LoginFormData {
  email: string;
  password: string;
}


export interface IEventForm {
  title: string;
  description: string;
  date: string;
  time: string; 
  location: string;
  tagIds?: number[];
  capacity?: number | null;
  isPublic: boolean;
}

export interface IEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity?: number | null;
  isPublic: boolean;
  organizerId: number;
  organizer: User;
  tags: ITag[];
  participants: Participant[];
  _count?: {   
    participants: number;
  };
}

export interface ITag {
  name: string;
  id: number;
}

export interface IEventState {
  events: IEvent[];
  currentEvent: IEvent | null;
  tags: ITag[];
  myEvents: IEvent[];
  isLoading: boolean;
  error: string | null;

  fetchEvents: (tagId?: number | null) => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  fetchEventById: (id: number) => Promise<void>;
  createEvent: (eventData: Partial<IEvent>) => Promise<void>;
  updateEvent: (id: number, eventData: Partial<IEvent>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  joinEvent: (id: number) => Promise<void>;
  leaveEvent: (id: number) => Promise<void>;
}


export interface Participant {
  id: number;
  userId: number;
  eventId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };

}

export type FormValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type AuthFormData = {
  email: string
  password: string
  name?: string
}

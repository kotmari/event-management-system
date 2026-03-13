export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterFormData) => Promise<boolean>;
  login: (data: LoginFormData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void
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
  participants: Participant[];
}

export interface IEventState {
  events: IEvent[];
  currentEvent: IEvent | null;
  myEvents: IEvent[];
  isLoading: boolean;
  error: string | null;

  fetchEvents: () => Promise<void>;
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
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export type ContactMessagePayload = {
  name: string;
  email?: string;
  phone?: string;
  message: string;
};

export interface SupportContactRequest {
  name: string;
  email: string;
  message: string;
  source?: string;
}

export interface SupportContactResponse {
  ok: true;
  ticketId: string;
  receivedAt: string;
}

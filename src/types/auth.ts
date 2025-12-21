export type AuthUser = {
  name: string;
  email: string;
  orgName?: string;
};

export type AuthState = AuthUser & {
  isAuthed: boolean;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthSignupPayload = AuthCredentials & {
  name: string;
  orgName: string;
  website?: string;
  vatId?: string;
};

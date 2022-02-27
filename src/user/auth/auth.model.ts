export type NewUserRequestData = {
  username: string;
  email: string;
  password: string;
};

export type NewUserResponseData = {
  id?: string;
  username: boolean;
  email: boolean;
  password: boolean;
};

export type PasswordResetData = {
  id: string;
  password: string;
  currentPassword?: string;
};

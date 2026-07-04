export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserInput {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

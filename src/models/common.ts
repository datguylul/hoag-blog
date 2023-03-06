export interface ApiRequest {}

export interface User {
  name?: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  created_date: number;
}

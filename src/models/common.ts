import { Document } from "mongoose";

export interface ApiRequest {}

export interface ResponseData<T> {
  data?: T;
  code?: number;
  message?: string;
}

export interface ErrorResponse {
  code?: number;
  message?: string;
}

export interface PagingData {
  data?: any;
  total?: number;
}

export interface UserInfo {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  created_date: number;
  address?: string;
}

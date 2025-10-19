import { BookingTypes } from "./BookingTypes";

export enum RolesEnum {
  user = 'user',
}

export interface UserTypes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  password: string;
  role: RolesEnum;
  bookings?: BookingTypes[];
}

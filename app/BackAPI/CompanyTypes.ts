import { BookingTypes } from "./BookingTypes";
import { CategoryTypes } from "./CategoryTypes";

export interface CompanyTypes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  url: string;
  categoryId: number;
  category?: CategoryTypes;
  bookings?: BookingTypes[];
}

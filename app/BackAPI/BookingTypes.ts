import { CompanyTypes } from "./CompanyTypes";
import { UserTypes } from "./UserTypes";

export interface BookingTypes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  booked: Date;
  companyId: number;
  userId: number;
  company?: CompanyTypes;
  user?: UserTypes;
}

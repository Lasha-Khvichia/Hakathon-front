import { CompanyTypes } from "./CompanyTypes";

export interface CategoryTypes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  companies?: CompanyTypes[];
}

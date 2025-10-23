import { CompanyTypes } from "./CompanyTypes";

export interface CategoryTypes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  color: string;
  icon: string;
  hasServices: boolean;
  hasBranches: boolean;
  companies?: CompanyTypes[];
}

// DTO for creating new categories (matches backend CreateCategoryDto)
export interface CreateCategoryDto {
  name: string;
  color: string;
  icon: string;
  hasServices: boolean;
  hasBranches: boolean;
}

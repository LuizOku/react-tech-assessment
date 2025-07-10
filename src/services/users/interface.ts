export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  username: string;
  phone: string;
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  company: {
    name: string;
    department: string;
    title: string;
  };
  age: number;
  gender: string;
  birthDate: string;
}

export interface UsersResponse {
  users: UserData[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersFilterParams {
  firstName?: string;
  lastName?: string;
}

export interface UsersSortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export abstract class UsersService {
  abstract getAll(
    limit?: number,
    skip?: number,
    filters?: UsersFilterParams,
    sort?: UsersSortParams
  ): Promise<UsersResponse>;
} 
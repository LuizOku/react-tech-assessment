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

export abstract class UsersService {
  abstract getAll(limit?: number, skip?: number): Promise<UsersResponse>;
} 
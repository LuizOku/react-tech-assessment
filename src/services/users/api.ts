import { UsersService, UsersResponse } from "./interface";

export class UsersApiService extends UsersService {
  private baseURL = process.env.REACT_APP_DUMMY_API_URL;

  async getAll(limit: number = 30, skip: number = 0): Promise<UsersResponse> {
    const response = await fetch(
      `${this.baseURL}/users?limit=${limit}&skip=${skip}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as UsersResponse;
  }
} 
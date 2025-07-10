import { UsersService, UsersResponse, UsersFilterParams, UsersSortParams } from "./interface";

export class UsersApiService extends UsersService {
  private baseURL = process.env.REACT_APP_DUMMY_API_URL;

  async getAll(
    limit: number = 30,
    skip: number = 0,
    filters?: UsersFilterParams,
    sort?: UsersSortParams
  ): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('skip', skip.toString());

    // Add sorting parameters
    if (sort?.sortBy && sort?.sortOrder) {
      params.append('sortBy', sort.sortBy);
      params.append('order', sort.sortOrder);
    }

    // Note: dummyjson.com doesn't support filtering by firstName/lastName directly
    // For proper filtering support, use the fake service by setting REACT_APP_FAKE_API_MODE=true
    // We'll ignore filters for the real API to maintain proper pagination

    const response = await fetch(
      `${this.baseURL}/users?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data as-is to maintain proper pagination
    // If filters are applied, they won't work with the real API
    return data as UsersResponse;
  }
} 
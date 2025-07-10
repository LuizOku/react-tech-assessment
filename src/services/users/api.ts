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
    // For a real API, you would add filter parameters here
    // For now, we'll handle filtering client-side as a fallback

    const response = await fetch(
      `${this.baseURL}/users?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    // Apply client-side filtering as fallback since dummyjson.com doesn't support it
    if (filters?.firstName || filters?.lastName) {
      data.users = data.users.filter((user: any) => {
        const firstNameMatch = !filters.firstName ||
          user.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
        const lastNameMatch = !filters.lastName ||
          user.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
        return firstNameMatch && lastNameMatch;
      });
      data.total = data.users.length;
    }

    return data as UsersResponse;
  }
} 
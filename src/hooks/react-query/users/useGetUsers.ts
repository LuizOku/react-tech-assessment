import { useQuery } from "@tanstack/react-query";
import UsersService from "services/users";
import { UsersResponse, UsersFilterParams, UsersSortParams } from "services/users/interface";

export function useGetUsers(
  limit: number = 30,
  skip: number = 0,
  filters?: UsersFilterParams,
  sort?: UsersSortParams
) {
  const usersQuery = useQuery({
    queryFn: async (): Promise<UsersResponse> => {
      const response = await UsersService.getAll(limit, skip, filters, sort);
      return response;
    },
    queryKey: ["users", limit, skip, filters, sort],
    keepPreviousData: true, // Keep previous data while fetching new data (good for pagination)
  });

  return usersQuery;
} 
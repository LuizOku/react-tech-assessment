import { useQuery } from "@tanstack/react-query";
import UsersService from "services/users";
import { UsersResponse } from "services/users/interface";

export function useGetUsers(limit: number = 30, skip: number = 0) {
  const usersQuery = useQuery({
    queryFn: async (): Promise<UsersResponse> => {
      const response = await UsersService.getAll(limit, skip);
      return response;
    },
    queryKey: ["users", limit, skip],
    keepPreviousData: true, // Keep previous data while fetching new data (good for pagination)
  });

  return usersQuery;
} 
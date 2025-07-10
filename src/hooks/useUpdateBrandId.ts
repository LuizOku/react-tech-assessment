import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { brandIdparamName } from "hooks";

export function useUpdateBrandId(path?: string) {
  const navigate = useNavigate();

  return useCallback((brandId: string) => {
    navigate({
      pathname: path,
      search: `?${brandIdparamName}=${brandId}`,
    });
  }, [navigate, path]);
}

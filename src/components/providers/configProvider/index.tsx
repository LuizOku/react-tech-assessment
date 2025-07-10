import { useEffect, useState } from "react";
import { useGetBrandId, useUpdateBrandId } from "hooks";
import { FullPageSpin } from "components/fullPageSpin";

interface AppConfigProviderProps {
  children: JSX.Element | JSX.Element[];
}

export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const brandId = useGetBrandId();
  const updateBrandId = useUpdateBrandId();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleValidation = async () => {
      setLoading(true);

      // Only update brandId if it's not already set
      if (!brandId) {
        updateBrandId("87");
      }

      setTimeout(() => setLoading(false), 500);
    };

    handleValidation();
  }, [brandId, updateBrandId]);

  if (loading) return <FullPageSpin />;

  return <>{children}</>;
}

import { useEffect, useState } from "react";
import { getVessels } from "../services/vesselService";

export function useVesselsViewModel() {
  const [hasError, setHasError] = useState(false);
  const [source, setSource] = useState("loading");
  const [vessels, setVessels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVessels() {
      const result = await getVessels();

      setVessels(result.vessels);
      setSource(result.source);
      setHasError(result.error);
      setIsLoading(false);  
    }

    loadVessels();
  }, []);

  return {
    vessels,
    isLoading,
    source,
    hasError,
  };
}

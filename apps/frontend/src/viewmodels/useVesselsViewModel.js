import { useEffect, useState } from "react";
import { getVessels } from "../services/vesselService";

export function useVesselsViewModel() {
  const [hasError, setHasError] = useState(false);
  const [source, setSource] = useState("loading");
  const [vessels, setVessels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadVessels() {
      try {
        const result = await getVessels();

        if (!active) return;

        setVessels(result.vessels);
        setSource(result.source);
        setHasError(result.error);
      } catch {
        if (!active) return;

        setVessels([]);
        setSource("error");
        setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadVessels();

    return () => {
      active = false;
    };
  }, []);

  return {
    vessels,
    isLoading,
    source,
    hasError,
  };
}

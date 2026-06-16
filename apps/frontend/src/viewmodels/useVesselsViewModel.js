import { useEffect, useState } from "react";
import { getVessels } from "../services/vesselService";

export function useVesselsViewModel() {
  const [source, setSource] = useState("loading");
  const [vessels, setVessels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVessels() {
      const result = await getVessels();

      setVessels(result.data);
      setSource(result.source);
      setIsLoading(false);
    }

    loadVessels();
  }, []);

  return {
    vessels,
    isLoading,
    source,
  };
}

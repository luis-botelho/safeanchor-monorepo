import { useEffect, useState } from "react";
import { getModules } from "../services/moduleService";

export function useHomeViewModel() {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadModules() {
      const loadedModules = await getModules();

      setModules(loadedModules);
      setIsLoading(false);
    }

    loadModules();
  }, []);

  return {
    appName: "SafeAnchor",
    subtitle: "Laboratorio simples com React, MVVM e BEM.",
    modules,
    isLoading,
  };
}

import { useApp } from "../context/AppContext";

export function useCandidates() {
  const { candidates } = useApp();
  const selected = candidates.filter((c) => c.status === "Selected");
  const rejected = candidates.filter((c) => c.status === "Rejected");
  return { candidates, selected, rejected };
}

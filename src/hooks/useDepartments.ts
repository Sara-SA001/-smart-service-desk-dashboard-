// src/hooks/useDepartments.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Department {
  _id: string;
  name: string;
  description?: string;
}

export const useDepartments = () => {
  return useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await api.get("/departments");
      return res.data || [];
    },
  });
};
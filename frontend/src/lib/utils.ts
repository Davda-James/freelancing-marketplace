import { JobStatus, JobStatusLabels } from "@/types";
export function cn(...args: (string | false | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

export const getStatusLabel = (status: number): JobStatus | "Unknown" => {
  return JobStatusLabels[status] ?? "Unknown";
};

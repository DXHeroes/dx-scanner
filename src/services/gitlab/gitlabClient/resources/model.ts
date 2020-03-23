/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TimeStats {
  time_estimate: number;
  total_time_spent: number;
  human_time_estimate?: any;
  human_total_time_spent?: any;
}

export interface TaskCompletionStatus {
  count: number;
  completed_count: number;
}

export interface Links {
  self: string;
  issues: string;
  merge_requests: string;
  repo_branches: string;
  labels: string;
  events: string;
  members: string;
}

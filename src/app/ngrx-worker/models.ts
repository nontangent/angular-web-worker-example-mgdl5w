export const WORKER_EVENT_TYPES = ['work-request', 'work-response'] as const;

export type WorkerEventType = typeof WORKER_EVENT_TYPES[number];

export interface WorkRequest {
  type: 'work-request';
  id: number;
  token: any;
  deps?: Record<string, any>;
  fn: any;
  args: any[];
}

export interface WorkResponse {
  type: 'work-response';
  id: number;
  result: any;
}

export type WorkMessage = WorkRequest | WorkResponse;

export class TaskHistory {
  taskId: number;
  action: string; // e.g., "created", "updated", "deleted"
  oldValue?: string;
  newValue?: string;
  changedBy: number; // User ID or username of the person who made the change
}

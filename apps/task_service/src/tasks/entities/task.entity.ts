export class Task {
  public task_id: number;
  public title: string;
  public description?: string | null;
  public status: string; // pending, in_progress, completed, cancelled
  public priority: string; // low, medium, high, urgent
  public due_date?: Date | null;
  public project_id: number;
}

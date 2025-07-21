export class TaskAssignment {
  public task_id: number; // Reference to Task Service
  public user_id: number; // Reference to User Service
  public assigned_at: Date;
  public status: string; // active, completed, cancelled
}

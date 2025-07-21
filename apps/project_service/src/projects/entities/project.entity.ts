export class Project {
  public project_id: number;
  public title: string;
  public description: string;
  public end_date: Date;
  public status: number; // 1 for active, 0 for inactive
  public created_at: Date;
  public updated_at: Date;
  public team_id: number | null; // Optional, can be null if not associated with a team
}

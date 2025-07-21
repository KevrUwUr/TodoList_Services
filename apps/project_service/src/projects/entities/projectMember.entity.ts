export class ProjectMember {
  public project_id: number;
  public user_id: number; // Reference to User ID in User Service
  public role: string; // project_admin, member
  public joined_at: Date;
}

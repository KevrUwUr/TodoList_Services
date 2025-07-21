export class User {
  public user_id: number;
  public username: string;
  public email: string;
  public first_name?: string | null;
  public last_name?: string | null;
  public password: string;
  public team_id: number | null;
  public status: number;
  public role_id: number | null;
}

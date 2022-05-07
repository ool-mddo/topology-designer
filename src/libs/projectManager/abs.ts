import { Project } from "models/project";

export default abstract class AbstractProjectManager {
  public abstract importFromJSON(json: string): Project;
  public abstract exportToJSON(project: Project): string;
}

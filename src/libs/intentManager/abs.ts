import { Intent } from "models/intent";

export default abstract class AbstractIntentManager {
  public abstract importFromJSON(json: string): Intent;
  public abstract exportToJSON(intent: Intent): string;
}

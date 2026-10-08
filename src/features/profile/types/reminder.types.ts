export interface ReminderSettings {
  enabled: boolean;
  /** Local hour (0-23) in `timeZone`. */
  hour: number;
  timeZone: string;
}

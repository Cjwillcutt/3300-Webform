import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const surveyResponsesTable = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  after_class_activity: text("after_class_activity").notNull(),
  state: text("state").notNull(),
  year_in_college: text("year_in_college").notNull(),
  activities: text("activities").array().notNull(),
  other_activity: text("other_activity"),
  study_hours: text("study_hours").notNull(),
  study_preference: text("study_preference").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponsesTable).omit({
  id: true,
  created_at: true,
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponsesTable.$inferSelect;

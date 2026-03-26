import { Router, type IRouter } from "express";
import { db, surveyResponsesTable } from "@workspace/db";
import { SubmitSurveyBody, GetSurveyResultsResponse } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.post("/survey/submit", async (req, res): Promise<void> => {
  const parsed = SubmitSurveyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  const [inserted] = await db
    .insert(surveyResponsesTable)
    .values({
      after_class_activity: data.after_class_activity,
      state: data.state,
      year_in_college: data.year_in_college,
      activities: data.activities,
      other_activity: data.other_activity ?? null,
      study_hours: data.study_hours,
      study_preference: data.study_preference,
    })
    .returning({ id: surveyResponsesTable.id });

  res.status(201).json({ id: inserted.id, message: "Survey submitted successfully" });
});

router.get("/survey/results", async (req, res): Promise<void> => {
  const totalResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(surveyResponsesTable);

  const totalResponses = totalResult[0]?.count ?? 0;

  const yearRows = await db
    .select({
      year: surveyResponsesTable.year_in_college,
      count: sql<number>`count(*)::int`,
    })
    .from(surveyResponsesTable)
    .groupBy(surveyResponsesTable.year_in_college);

  const yearOrder = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year or More",
  ];
  const yearInCollege = yearOrder
    .map((y) => {
      const found = yearRows.find((r) => r.year === y);
      return { year: y, count: found?.count ?? 0 };
    })
    .filter((y) => y.count > 0);

  const allRows = await db
    .select({ activities: surveyResponsesTable.activities, other_activity: surveyResponsesTable.other_activity })
    .from(surveyResponsesTable);

  const activityCounts: Record<string, number> = {};
  for (const row of allRows) {
    for (const act of row.activities) {
      if (act === "Other" && row.other_activity) {
        const normalized = row.other_activity.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        activityCounts[normalized] = (activityCounts[normalized] ?? 0) + 1;
      } else if (act !== "Other") {
        activityCounts[act] = (activityCounts[act] ?? 0) + 1;
      }
    }
  }
  const topActivities = Object.entries(activityCounts)
    .map(([activity, count]) => ({ activity, count }))
    .sort((a, b) => b.count - a.count);

  const stateRows = await db
    .select({
      state: surveyResponsesTable.state,
      count: sql<number>`count(*)::int`,
    })
    .from(surveyResponsesTable)
    .groupBy(surveyResponsesTable.state)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const topStates = stateRows.map((r) => ({
    state: r.state,
    count: r.count,
    percentage: totalResponses > 0 ? Math.round((r.count / totalResponses) * 100) : 0,
  }));

  const studyHoursRows = await db
    .select({
      range: surveyResponsesTable.study_hours,
      count: sql<number>`count(*)::int`,
    })
    .from(surveyResponsesTable)
    .groupBy(surveyResponsesTable.study_hours);

  const hoursOrder = ["0–5 hours", "6–10 hours", "11–15 hours", "16+ hours"];
  const studyHours = hoursOrder
    .map((h) => {
      const found = studyHoursRows.find((r) => r.range === h);
      return { range: h, count: found?.count ?? 0 };
    })
    .filter((h) => h.count > 0);

  const prefRows = await db
    .select({
      preference: surveyResponsesTable.study_preference,
      count: sql<number>`count(*)::int`,
    })
    .from(surveyResponsesTable)
    .groupBy(surveyResponsesTable.study_preference);

  const studyPreference = prefRows.map((r) => ({
    preference: r.preference,
    count: r.count,
  }));

  const results = GetSurveyResultsResponse.parse({
    total_responses: totalResponses,
    year_in_college: yearInCollege,
    top_activities: topActivities,
    top_states: topStates,
    study_hours: studyHours,
    study_preference: studyPreference,
  });

  res.json(results);
});

export default router;

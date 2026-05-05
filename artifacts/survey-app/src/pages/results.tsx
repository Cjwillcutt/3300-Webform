import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { AlertCircle, RefreshCcw, Users } from "lucide-react";
import { supabase, type SurveyResponse } from "@/lib/supabase";

const COLORS = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];
const PIE_COLORS = ["#2563EB", "#60A5FA", "#93C5FD"];

const YEAR_ORDER = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year or More"];
const HOURS_ORDER = ["0–5 hours", "6–10 hours", "11–15 hours", "16+ hours"];

type Results = {
  total_responses: number;
  year_in_college: { year: string; count: number }[];
  top_activities: { activity: string; count: number }[];
  top_states: { state: string; count: number; percentage: number }[];
  study_hours: { range: string; count: number }[];
  study_preference: { preference: string; count: number }[];
};

function computeResults(rows: SurveyResponse[]): Results {
  const total = rows.length;

  // Year in college
  const yearMap: Record<string, number> = {};
  for (const r of rows) yearMap[r.year_in_college] = (yearMap[r.year_in_college] ?? 0) + 1;
  const year_in_college = YEAR_ORDER.map(y => ({ year: y, count: yearMap[y] ?? 0 })).filter(y => y.count > 0);

  // Activities — expand "Other" into the text they entered, normalize casing
  const actMap: Record<string, number> = {};
  for (const r of rows) {
    for (const act of r.activities) {
      if (act === "Other" && r.other_activity) {
        const normalized = r.other_activity.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        actMap[normalized] = (actMap[normalized] ?? 0) + 1;
      } else if (act !== "Other") {
        actMap[act] = (actMap[act] ?? 0) + 1;
      }
    }
  }
  const top_activities = Object.entries(actMap)
    .map(([activity, count]) => ({ activity, count }))
    .sort((a, b) => b.count - a.count);

  // Top states
  const stateMap: Record<string, number> = {};
  for (const r of rows) stateMap[r.state] = (stateMap[r.state] ?? 0) + 1;
  const top_states = Object.entries(stateMap)
    .map(([state, count]) => ({ state, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Study hours
  const hoursMap: Record<string, number> = {};
  for (const r of rows) hoursMap[r.study_hours] = (hoursMap[r.study_hours] ?? 0) + 1;
  const study_hours = HOURS_ORDER.map(h => ({ range: h, count: hoursMap[h] ?? 0 })).filter(h => h.count > 0);

  // Study preference
  const prefMap: Record<string, number> = {};
  for (const r of rows) prefMap[r.study_preference] = (prefMap[r.study_preference] ?? 0) + 1;
  const study_preference = Object.entries(prefMap).map(([preference, count]) => ({ preference, count }));

  return { total_responses: total, year_in_college, top_activities, top_states, study_hours, study_preference };
}

export default function Results() {
  const [results, setResults] = useState<Results | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchResults = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const { data, error } = await supabase
        .from("survey_responses")
        .select("*");
      if (error) throw error;
      setResults(computeResults((data as SurveyResponse[]) ?? []));
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCcw className="w-10 h-10 text-primary animate-spin mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-foreground">Loading Survey Results...</h2>
          <p className="text-muted-foreground mt-2">Crunching the data for you.</p>
        </div>
      </Layout>
    );
  }

  if (isError || !results) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Could not load results</h2>
          <p className="text-muted-foreground mb-8">
            There was an error retrieving the survey data. Please try again later.
          </p>
          <button
            onClick={fetchResults}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">Survey Results</h1>
            <p className="text-muted-foreground text-lg">Live data from the College Student Lifestyle Survey.</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-6 py-4 rounded-2xl flex items-center gap-4 shrink-0">
            <div className="bg-background p-3 rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm text-primary font-semibold uppercase tracking-wider">Total Responses</div>
              <div className="text-3xl font-bold text-foreground leading-none">{results.total_responses}</div>
            </div>
          </div>
        </div>

        {results.total_responses === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-2">No data yet</h3>
            <p className="text-muted-foreground">Be the first to take the survey and generate some charts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">

            {/* Year in College */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-6">Year in College</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.year_in_college} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <RechartsTooltip cursor={{ fill: "hsl(var(--muted)/0.5)" }} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Popular Activities */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-6">Most Popular Activities</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.top_activities} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis type="category" dataKey="activity" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} width={110} />
                    <RechartsTooltip cursor={{ fill: "hsl(var(--muted)/0.5)" }} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Study Time Per Week */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-6">Study Time Per Week</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.study_hours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <RechartsTooltip cursor={{ fill: "hsl(var(--muted)/0.5)" }} contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="count" fill="#60A5FA" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Study Preference */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-6">Study Preference</h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.study_preference}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="preference"
                      stroke="none"
                    >
                      {results.study_preference.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "14px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top States Represented */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm lg:col-span-2">
              <h3 className="text-lg font-display font-bold mb-6">Top States Represented</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.top_states} layout="vertical" margin={{ top: 10, right: 60, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="state" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground))", fontWeight: 500, fontSize: 13 }} width={120} />
                    <RechartsTooltip
                      cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                      contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                      formatter={(value: number, _: string, props: { payload: { percentage: number } }) => [`${value} (${props.payload.percentage}%)`, "Responses"]}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24} label={{ position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 12, formatter: (_: number, entry: { payload?: { percentage?: number } }) => entry?.payload?.percentage != null ? `${entry.payload.percentage}%` : "" }}>
                      {results.top_states.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}

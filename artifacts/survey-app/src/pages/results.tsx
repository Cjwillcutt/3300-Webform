import { useGetSurveyResults } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { AlertCircle, RefreshCcw, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
const PIE_COLORS = ['#2563EB', '#60A5FA', '#93C5FD'];

export default function Results() {
  const { data, isLoading, isError, refetch } = useGetSurveyResults();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCcw className="w-10 h-10 text-primary animate-spin mb-4" />
          <h2 className="text-xl font-semibold text-foreground">Loading Survey Results...</h2>
          <p className="text-muted-foreground mt-2">Crunching the data for you.</p>
        </div>
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Could not load results</h2>
          <p className="text-muted-foreground mb-8">
            There was an error retrieving the survey data. Please try again later.
          </p>
          <button 
            onClick={() => refetch()}
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
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-primary font-semibold uppercase tracking-wider">Total Responses</div>
              <div className="text-3xl font-bold text-foreground leading-none">{data.total_responses}</div>
            </div>
          </div>
        </div>

        {data.total_responses === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border shadow-sm">
            <BarChart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
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
                  <BarChart data={data.year_in_college} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <RechartsTooltip 
                      cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Popular Activities */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-6">Most Popular Activities</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.top_activities} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <YAxis type="category" dataKey="activity" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} width={100} />
                    <RechartsTooltip 
                      cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
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
                  <BarChart data={data.study_hours} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <RechartsTooltip 
                      cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
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
                      data={data.study_preference}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="preference"
                      stroke="none"
                    >
                      {data.study_preference.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top States Represented */}
            <div className="bg-card p-6 rounded-3xl border border-border shadow-sm lg:col-span-2">
              <h3 className="text-lg font-display font-bold mb-6">Top States Represented</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.top_states} layout="vertical" margin={{ top: 10, right: 40, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="state" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--foreground))', fontWeight: 500, fontSize: 13}} width={120} />
                    <RechartsTooltip 
                      cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                      formatter={(value: number, name: string, props: any) => [`${value} (${props.payload.percentage.toFixed(1)}%)`, 'Count']}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={24} label={{ position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 12, formatter: (val: number) => val }} >
                      {data.top_states.map((entry, index) => (
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

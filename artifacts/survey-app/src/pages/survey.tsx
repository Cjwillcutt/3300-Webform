import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircle2, ChevronDown, RefreshCcw, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/layout";
import { cn } from "@/lib/utils";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const ACTIVITIES = [
  "Exercise", "Watch TV/Movies", "Socialize", "Study", "Play Video Games", "Other"
];

const surveySchema = z.object({
  after_class_activity: z.string().min(2, "Please tell us what you do after classes."),
  state: z.string().min(1, "Please select your state."),
  year_in_college: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year or More"], {
    errorMap: () => ({ message: "Please select your year in college." })
  }),
  activities: z.array(z.string()).min(1, "Please select at least one activity."),
  other_activity: z.string().optional(),
  study_hours: z.enum(["0–5 hours", "6–10 hours", "11–15 hours", "16+ hours"], {
    errorMap: () => ({ message: "Please select your study hours." })
  }),
  study_preference: z.enum(["Alone", "With Others", "Both"], {
    errorMap: () => ({ message: "Please select your study preference." })
  }),
}).refine((data) => {
  if (data.activities.includes("Other") && (!data.other_activity || data.other_activity.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please describe your other activity.",
  path: ["other_activity"]
});

type SurveyFormData = z.infer<typeof surveySchema>;

export default function Survey() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<SurveyFormData | null>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      activities: [],
      other_activity: "",
    }
  });

  const selectedActivities = watch("activities");
  const showOtherInput = selectedActivities?.includes("Other");

  useEffect(() => {
    if (showOtherInput && otherInputRef.current) {
      otherInputRef.current.focus();
    }
  }, [showOtherInput]);

  const onSubmit = async (data: SurveyFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("survey_responses").insert([{
        after_class_activity: data.after_class_activity,
        state: data.state,
        year_in_college: data.year_in_college,
        activities: data.activities,
        other_activity: data.other_activity || null,
        study_hours: data.study_hours,
        study_preference: data.study_preference,
      }]);

      if (error) throw error;

      setSubmittedData(data);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit survey. Please try again.";
      setSubmitError(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && submittedData) {
    const data = submittedData;
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mt-8 bg-card border border-border shadow-xl shadow-black/5 rounded-3xl p-8 sm:p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Thank You!</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Your survey response has been recorded successfully.
          </p>

          <div className="bg-muted/50 rounded-2xl p-6 text-left mb-8 border border-border/50">
            <h3 className="font-semibold text-foreground mb-4 border-b border-border pb-2">Response Summary</h3>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <dt className="text-muted-foreground font-medium">After Classes</dt>
                <dd className="sm:col-span-2 text-foreground font-medium">{data.after_class_activity}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <dt className="text-muted-foreground font-medium">State</dt>
                <dd className="sm:col-span-2 text-foreground font-medium">{data.state}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <dt className="text-muted-foreground font-medium">Year</dt>
                <dd className="sm:col-span-2 text-foreground font-medium">{data.year_in_college}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <dt className="text-muted-foreground font-medium">Activities</dt>
                <dd className="sm:col-span-2 text-foreground font-medium">
                  {data.activities.filter(a => a !== "Other").join(", ")}
                  {data.activities.includes("Other") && (
                    <span>{data.activities.length > 1 ? ", " : ""}{data.other_activity}</span>
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <dt className="text-muted-foreground font-medium">Study Hours</dt>
                <dd className="sm:col-span-2 text-foreground font-medium">{data.study_hours}</dd>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                <dt className="text-muted-foreground font-medium">Study Pref.</dt>
                <dd className="sm:col-span-2 text-foreground font-medium">{data.study_preference}</dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-center">
            <Link
              href="/results"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              View All Results
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Lifestyle Survey</h1>
          <p className="text-muted-foreground">Please fill out all the fields below to share your experience.</p>
        </div>

        {submitError && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-start gap-3">
            <div className="mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <div>
              <h4 className="font-semibold">Submission Error</h4>
              <p className="text-sm opacity-90">{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10 bg-card p-6 sm:p-10 rounded-3xl border border-border shadow-sm">

          {/* Q1: Text Input */}
          <div className="space-y-3">
            <label htmlFor="after_class_activity" className="block font-semibold text-foreground text-lg">
              1. What do you usually do after classes? <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <input
              {...register("after_class_activity")}
              id="after_class_activity"
              autoFocus
              className={cn(
                "w-full px-4 py-3 rounded-xl bg-background border-2 transition-all duration-200 focus:outline-none focus:ring-4 text-foreground placeholder:text-muted-foreground",
                errors.after_class_activity
                  ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-border focus:border-primary focus:ring-primary/10"
              )}
              placeholder="e.g. gym, homework, hanging out"
              aria-required="true"
              aria-invalid={!!errors.after_class_activity}
              aria-describedby={errors.after_class_activity ? "q1-error" : undefined}
            />
            {errors.after_class_activity && (
              <p id="q1-error" role="alert" className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {errors.after_class_activity.message}
              </p>
            )}
          </div>

          {/* Q2: Select/Dropdown */}
          <div className="space-y-3">
            <label htmlFor="state" className="block font-semibold text-foreground text-lg">
              2. What state are you from? <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                {...register("state")}
                id="state"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-background border-2 appearance-none transition-all duration-200 focus:outline-none focus:ring-4 text-foreground cursor-pointer",
                  errors.state
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-primary/10"
                )}
                aria-required="true"
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? "q2-error" : undefined}
              >
                <option value="">Select a state...</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>
            {errors.state && (
              <p id="q2-error" role="alert" className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* Q3: Radio Buttons */}
          <fieldset className="space-y-4">
            <legend className="block font-semibold text-foreground text-lg">
              3. What year are you in college? <span className="text-destructive" aria-hidden="true">*</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year or More"].map((year) => (
                <label
                  key={year}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                    watch("year_in_college") === year
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-border/80 text-foreground"
                  )}
                >
                  <input
                    type="radio"
                    value={year}
                    {...register("year_in_college")}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-2 accent-primary"
                    aria-invalid={!!errors.year_in_college}
                  />
                  <span className="font-medium">{year}</span>
                </label>
              ))}
            </div>
            {errors.year_in_college && (
              <p role="alert" className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {errors.year_in_college.message}
              </p>
            )}
          </fieldset>

          {/* Q4: Checkboxes */}
          <fieldset className="space-y-4">
            <legend className="block font-semibold text-foreground text-lg">
              4. What activities do you enjoy? <span className="font-normal text-base text-muted-foreground">(Check all that apply)</span> <span className="text-destructive" aria-hidden="true">*</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                name="activities"
                control={control}
                render={({ field }) => (
                  <>
                    {ACTIVITIES.map((activity) => {
                      const isChecked = field.value?.includes(activity);
                      return (
                        <label
                          key={activity}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                            isChecked
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border bg-background hover:border-border/80 text-foreground"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0",
                            isChecked ? "bg-primary border-primary" : "border-border/80 bg-background"
                          )} aria-hidden="true">
                            {isChecked && <Check className="w-3.5 h-3.5 text-primary-foreground stroke-[3]" />}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            value={activity}
                            checked={isChecked}
                            onChange={(e) => {
                              const currentValues = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...currentValues, activity]);
                              } else {
                                field.onChange(currentValues.filter(val => val !== activity));
                              }
                            }}
                          />
                          <span className="font-medium">{activity}</span>
                        </label>
                      );
                    })}
                  </>
                )}
              />
            </div>

            <AnimatePresence>
              {showOtherInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="other_activity" className="sr-only">Describe your other activity</label>
                  <input
                    {...register("other_activity")}
                    id="other_activity"
                    ref={(e) => {
                      register("other_activity").ref(e);
                      // @ts-ignore
                      otherInputRef.current = e;
                    }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-background border-2 transition-all duration-200 focus:outline-none focus:ring-4 text-foreground placeholder:text-muted-foreground",
                      errors.other_activity
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/10"
                    )}
                    placeholder="Please describe your other activity..."
                    aria-required="true"
                    aria-invalid={!!errors.other_activity}
                    aria-describedby={errors.other_activity ? "other-activity-error" : undefined}
                  />
                  {errors.other_activity && (
                    <p id="other-activity-error" role="alert" className="text-destructive text-sm font-medium mt-2 animate-in fade-in">
                      {errors.other_activity.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {errors.activities && (
              <p role="alert" className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {errors.activities.message}
              </p>
            )}
          </fieldset>

          {/* Q5: Dropdown */}
          <div className="space-y-3">
            <label htmlFor="study_hours" className="block font-semibold text-foreground text-lg">
              5. How many hours do you spend studying per week? <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                {...register("study_hours")}
                id="study_hours"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-background border-2 appearance-none transition-all duration-200 focus:outline-none focus:ring-4 text-foreground cursor-pointer",
                  errors.study_hours
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-primary/10"
                )}
                aria-required="true"
                aria-invalid={!!errors.study_hours}
                aria-describedby={errors.study_hours ? "q5-error" : undefined}
              >
                <option value="">Select an option...</option>
                <option value="0–5 hours">0–5 hours</option>
                <option value="6–10 hours">6–10 hours</option>
                <option value="11–15 hours">11–15 hours</option>
                <option value="16+ hours">16+ hours</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>
            {errors.study_hours && (
              <p id="q5-error" role="alert" className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {errors.study_hours.message}
              </p>
            )}
          </div>

          {/* Q6: Radio Buttons */}
          <fieldset className="space-y-4">
            <legend className="block font-semibold text-foreground text-lg">
              6. Do you prefer studying alone or with others? <span className="text-destructive" aria-hidden="true">*</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Alone", "With Others", "Both"].map((pref) => (
                <label
                  key={pref}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                    watch("study_preference") === pref
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-border/80 text-foreground"
                  )}
                >
                  <input
                    type="radio"
                    value={pref}
                    {...register("study_preference")}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-offset-2 accent-primary"
                  />
                  <span className="font-medium">{pref}</span>
                </label>
              ))}
            </div>
            {errors.study_preference && (
              <p role="alert" className="text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {errors.study_preference.message}
              </p>
            )}
          </fieldset>

          <div className="pt-6 border-t border-border mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full flex justify-center items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-primary-foreground bg-primary shadow-lg shadow-primary/25 transition-all duration-300",
                isSubmitting
                  ? "opacity-80 cursor-not-allowed"
                  : "hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 active:translate-y-0"
              )}
            >
              {isSubmitting ? (
                <>
                  <RefreshCcw className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                "Submit Survey"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

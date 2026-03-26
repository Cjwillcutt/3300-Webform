import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link, useRoute } from "wouter";
import { BarChart3, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [isHome] = useRoute("/");
  const [isSurvey] = useRoute("/survey");
  const [isResults] = useRoute("/results");

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
          <Link 
            href="/" 
            className="flex items-center gap-2 group transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">CampusLife Survey</span>
          </Link>

          <nav className="flex items-center gap-2">
            {!isSurvey && (
              <Link 
                href="/survey" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSurvey ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                Take Survey
              </Link>
            )}
            {!isResults && (
              <Link 
                href="/results" 
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isResults 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 hover:border-primary/20"
                )}
              >
                <BarChart3 className="w-4 h-4" />
                View Results
              </Link>
            )}
            {!isHome && isResults && (
               <Link 
               href="/" 
               className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
             >
               Home
             </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full relative">
        <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 relative z-10 flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex-1"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-border mt-auto bg-card">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <p className="text-sm text-muted-foreground">
            Survey by C. Willcutt, BAIS:3300 - spring 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}

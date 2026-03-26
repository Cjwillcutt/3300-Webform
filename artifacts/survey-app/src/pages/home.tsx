import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, GraduationCap, Users, Clock } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-12 sm:py-20">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-primary/10"
        >
          <GraduationCap className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6"
        >
          College Student <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-400">Lifestyle Survey</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
        >
          We're researching how modern college students balance their academic commitments with personal activities, study habits, and social lives. Add your voice to the data!
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/survey"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 hover:bg-primary/90 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            Take the Survey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/results"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-card border-2 border-border text-foreground rounded-2xl font-semibold text-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <BarChart3 className="w-5 h-5 text-primary" />
            View Results
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full"
        >
          {[
            { icon: Users, title: "Social Habits", desc: "Discover how peers connect." },
            { icon: Clock, title: "Time Mgmt", desc: "Analyze study vs. play." },
            { icon: BarChart3, title: "Live Data", desc: "See real-time analytics." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}

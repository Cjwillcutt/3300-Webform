import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-6">
          <FileQuestion className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-primary/90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Return Home
        </Link>
      </div>
    </Layout>
  );
}

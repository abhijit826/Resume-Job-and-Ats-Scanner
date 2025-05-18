
import AtsScannerForm from '@/components/ats/ats-scanner-form';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'ATS Resume Scanner | CareerCompass',
  description: 'Scan your resume against a job description to get ATS insights and improve your application.',
};

export default function AtsScannerPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <section aria-labelledby="ats-scanner-title">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-10 h-10 text-primary" />
          <h1 id="ats-scanner-title" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            ATS Resume Scanner
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
          Upload your resume (PDF) and paste a job description below. Our AI will analyze how well your resume aligns with the job,
          simulating an Applicant Tracking System (ATS) scan to provide you with actionable feedback.
        </p>
        <AtsScannerForm />
      </section>
    </div>
  );
}

    
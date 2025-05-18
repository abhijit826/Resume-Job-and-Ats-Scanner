
'use client';

import { useState, type FormEvent, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { atsScan, type AtsScanInput, type AtsScanOutput } from '@/ai/flows/ats-scan-flow';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info, ArrowRight, Sparkles, UploadCloud, FileText } from 'lucide-react';

export default function AtsScannerForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AtsScanOutput | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setResumeFile(selectedFile);
        setResumeFileName(selectedFile.name);
        setError(null);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file for the resume.",
          variant: "destructive",
        });
        setResumeFile(null);
        setResumeFileName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!resumeFile) {
      toast({
        title: "No Resume Selected",
        description: "Please select a PDF resume to upload.",
        variant: "destructive",
      });
      return;
    }
    if (!jobDescription.trim()) {
      toast({
        title: "No Job Description",
        description: "Please paste the job description.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(resumeFile);
      reader.onload = async () => {
        const resumeDataUri = reader.result as string;
        const input: AtsScanInput = { resumeDataUri, jobDescription };
        const scanResults = await atsScan(input);
        setResults(scanResults);
        toast({
          title: "ATS Scan Complete!",
          description: "Your resume has been analyzed against the job description.",
        });
      };
      reader.onerror = () => {
        console.error("Error reading resume file:", reader.error);
        setError("Failed to read the resume file. Please try again.");
        toast({
          title: "File Read Error",
          description: "Could not read the resume file. Please try again.",
          variant: "destructive",
        });
      };
    } catch (err) {
      console.error("Error processing ATS scan:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to process ATS scan: ${errorMessage}`);
      toast({
        title: "Processing Error",
        description: `An error occurred during the ATS scan: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg shadow-md border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="resume-upload" className="block text-sm font-medium text-foreground mb-1">
              Upload Resume (PDF only)
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-input hover:border-primary transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-muted-foreground">
                  <label
                    htmlFor="resume-upload-input"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                  >
                    <span>Upload a file</span>
                    <Input
                      id="resume-upload-input"
                      name="resume-upload-input"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
                {resumeFileName && <p className="text-sm text-foreground pt-2">Selected: {resumeFileName}</p>}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="job-description" className="block text-sm font-medium text-foreground mb-1">
              Paste Job Description
            </Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[200px] md:min-h-[258px] text-sm"
              rows={10}
            />
          </div>
        </div>

        <Button type="submit" className="w-full text-base py-3" disabled={isLoading || !resumeFile || !jobDescription.trim()}>
          {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
          Scan Resume
        </Button>
      </form>

      {isLoading && !results && (
        <div className="flex flex-col justify-center items-center py-10 text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-lg text-muted-foreground">Performing ATS scan...</p>
          <p className="text-sm text-muted-foreground">This might take a few moments.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>ATS Scan Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && !isLoading && (
        <Card className="shadow-xl border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground flex items-center">
              <FileText className="w-7 h-7 mr-3 text-primary" />
              ATS Scan Results
            </CardTitle>
            <CardDescription>
              Here's how your resume matches up against the job description.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary" />
                Overall Fit
              </h3>
              <p className="text-muted-foreground bg-secondary p-3 rounded-md">{results.overallFit}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Strengths Analysis
              </h3>
              <p className="text-muted-foreground bg-secondary p-3 rounded-md">{results.strengthsAnalysis}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-amber-500" />
                Improvement Suggestions
              </h3>
              <p className="text-muted-foreground bg-secondary p-3 rounded-md">{results.improvementSuggestions}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Missing Keywords
                </h3>
                {results.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-secondary rounded-md">
                    {results.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">{keyword}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground p-3 bg-secondary rounded-md">No significant keywords missing. Great job!</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-accent" />
                  Matching Keywords
                </h3>
                {results.matchingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-3 bg-secondary rounded-md">
                    {results.matchingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-green-500 text-green-700 text-xs">{keyword}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground p-3 bg-secondary rounded-md">No specific keywords matched. Consider aligning your resume more closely with the job description.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    
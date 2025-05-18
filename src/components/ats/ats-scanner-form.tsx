
'use client';

import { useState, type FormEvent, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { atsScan, type AtsScanInput, type AtsScanOutput } from '@/ai/flows/ats-scan-flow';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CheckCircle, AlertTriangle, Info, ArrowRight, Sparkles, UploadCloud, FileText, Target, BarChart2, ThumbsUp, Lightbulb, ListChecks, Percent, PieChartIcon, LineChartIcon } from 'lucide-react';
import { useTheme } from 'next-themes';


const CHART_COLORS_LIGHT = {
  matched: 'hsl(var(--primary))', // Blue
  missing: 'hsl(var(--destructive))', // Red
  other: 'hsl(var(--muted))', // Grey for pie chart
  scoreLine: 'hsl(var(--primary))',
  grid: 'hsl(var(--border))',
  text: 'hsl(var(--foreground))',
};

const CHART_COLORS_DARK = {
  matched: 'hsl(var(--primary))', // Blue (can be same or adjusted for dark)
  missing: 'hsl(var(--destructive))', // Red (can be same or adjusted for dark)
  other: 'hsl(var(--muted))', // Darker Grey for pie chart
  scoreLine: 'hsl(var(--primary))',
  grid: 'hsl(var(--border))', // Darker border
  text: 'hsl(var(--foreground))', // Lighter text
};


export default function AtsScannerForm() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AtsScanOutput | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { theme } = useTheme();
  const [currentChartColors, setCurrentChartColors] = useState(CHART_COLORS_LIGHT);

  useEffect(() => {
    setCurrentChartColors(theme === 'dark' ? CHART_COLORS_DARK : CHART_COLORS_LIGHT);
  }, [theme]);


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
  
  const keywordBarChartData = results ? [
    { name: 'Keywords', Matched: results.keywordStats.matchedKeywordsCount, Missing: results.keywordStats.missingKeywordsCount },
  ] : [];

  const keywordPieChartData = results ? [
    { name: 'Matched Keywords', value: results.keywordStats.matchedKeywordsCount },
    { name: 'Missing Keywords', value: results.keywordStats.missingKeywordsCount },
  ] : [];
  
  const overallScoreLineData = results ? [
    { name: 'Overall Score', score: results.overallScore }
  ] : [];


  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-xl shadow-xl border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <Label htmlFor="resume-upload-input" className="block text-sm font-medium text-foreground mb-2">
              Upload Resume (PDF only)
            </Label>
            <div className="mt-1 flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed rounded-lg border-input hover:border-primary transition-colors bg-background cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="flex text-sm text-muted-foreground mt-2">
                <span className="font-medium text-primary hover:text-primary/80">
                  Click to upload
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">PDF up to 10MB</p>
              <Input
                id="resume-upload-input"
                name="resume-upload-input"
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
               {resumeFileName && <p className="text-sm text-foreground pt-3 font-medium">Selected: {resumeFileName}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="job-description" className="block text-sm font-medium text-foreground mb-2">
              Paste Job Description
            </Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="min-h-[200px] md:min-h-[292px] text-sm resize-none"
              rows={12}
            />
          </div>
        </div>

        <Button type="submit" className="w-full text-base py-3 !mt-8" disabled={isLoading || !resumeFile || !jobDescription.trim()}>
          {isLoading ? <LoadingSpinner className="mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
          Scan Resume & Get Insights
        </Button>
      </form>

      {isLoading && !results && (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <LoadingSpinner size={56} />
          <p className="mt-6 text-xl text-muted-foreground">Performing ATS scan...</p>
          <p className="text-base text-muted-foreground/80">Our AI is analyzing your documents, this might take a few moments.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="max-w-3xl mx-auto shadow-lg">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>ATS Scan Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && !isLoading && (
        <div className="space-y-8">
          <Card className="shadow-xl border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b dark:bg-muted/20">
              <CardTitle className="text-2xl font-semibold text-foreground flex items-center">
                <Target className="w-7 h-7 mr-3 text-primary" />
                Overall Match Assessment
              </CardTitle>
              <CardDescription>
                Your resume's alignment with the job description based on AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-3xl font-bold text-primary">{results.overallScore}<span className="text-xl text-muted-foreground">/100</span></p>
                <Badge variant={results.overallScore > 75 ? "default" : results.overallScore > 50 ? "secondary" : "destructive"} className="text-lg px-4 py-2">
                  {results.overallFit}
                </Badge>
              </div>
              <Progress value={results.overallScore} className="h-3" />
            </CardContent>
             <CardFooter className="p-6">
                <div className="w-full h-[100px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overallScoreLineData} margin={{ top: 5, right: 20, left: -30, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={currentChartColors.grid}/>
                      <XAxis dataKey="name" stroke={currentChartColors.text} />
                      <YAxis domain={[0, 100]} stroke={currentChartColors.text} />
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'hsl(var(--popover))' : 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))', borderRadius: '0.5rem', borderColor: 'hsl(var(--border))' }} />
                      <Line type="monotone" dataKey="score" stroke={currentChartColors.scoreLine} strokeWidth={3} dot={{ r: 5, fill: currentChartColors.scoreLine }} activeDot={{ r: 7 }} name="Overall Score"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            </CardFooter>
          </Card>

          <Card className="shadow-xl border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b dark:bg-muted/20">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                <BarChart2 className="w-6 h-6 mr-3 text-primary" />
                Keyword Analysis
              </CardTitle>
              <CardDescription>
                 How well your resume's keywords match the job description. Match Percentage: {results.keywordStats.matchPercentage}%
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={keywordBarChartData} margin={{ top: 5, right: 0, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} stroke={currentChartColors.grid} />
                      <XAxis dataKey="name" stroke={currentChartColors.text}/>
                      <YAxis allowDecimals={false} stroke={currentChartColors.text}/>
                      <Tooltip
                          contentStyle={{ backgroundColor: theme === 'dark' ? 'hsl(var(--popover))' : 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))', borderRadius: '0.5rem', borderColor: 'hsl(var(--border))' }}
                          content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                              return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Matched
                                      </span>
                                      <span className="font-bold text-foreground">
                                      {payload[0].value}
                                      </span>
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Missing
                                      </span>
                                      <span className="font-bold text-destructive">
                                      {payload[1].value}
                                      </span>
                                  </div>
                                  </div>
                              </div>
                              )
                          }
                          return null
                          }}
                      />
                      <Legend wrapperStyle={{ color: currentChartColors.text }} />
                      <Bar dataKey="Matched" fill={currentChartColors.matched} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Missing" fill={currentChartColors.missing} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={keywordPieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell key={`cell-matched`} fill={currentChartColors.matched} />
                        <Cell key={`cell-missing`} fill={currentChartColors.missing} />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? 'hsl(var(--popover))' : 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))', borderRadius: '0.5rem', borderColor: 'hsl(var(--border))' }} />
                      <Legend wrapperStyle={{ color: currentChartColors.text }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-foreground mb-2 flex items-center">
                    <ListChecks className="w-5 h-5 mr-2 text-green-500" />
                    Matching Keywords ({results.matchingKeywords.length})
                  </h4>
                  {results.matchingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 dark:bg-secondary/30 rounded-md max-h-40 overflow-y-auto">
                      {results.matchingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-green-500/70 text-green-700 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 text-xs">{keyword}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground p-3 bg-secondary/50 dark:bg-secondary/30 rounded-md text-sm">No specific keywords matched.</p>
                  )}
                </div>
                <div>
                  <h4 className="text-md font-medium text-foreground mb-2 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                    Missing Keywords ({results.missingKeywords.length})
                  </h4>
                  {results.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 dark:bg-secondary/30 rounded-md max-h-40 overflow-y-auto">
                      {results.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-amber-500/70 text-amber-700 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 text-xs">{keyword}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground p-3 bg-secondary/50 dark:bg-secondary/30 rounded-md text-sm">Great! No significant keywords appear to be missing.</p>
                  )}
                </div>
              </div>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground p-4 border-t dark:border-border/50">
                Identified {results.keywordStats.totalKeywordsInJobDescription} important keywords in the job description.
             </CardFooter>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-xl border-border">
              <CardHeader className="bg-muted/30 dark:bg-muted/20">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <ThumbsUp className="w-6 h-6 mr-3 text-primary" />
                  Strengths Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{results.strengthsAnalysis}</p>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-border">
              <CardHeader className="bg-muted/30 dark:bg-muted/20">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3 text-primary" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{results.improvementSuggestions}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

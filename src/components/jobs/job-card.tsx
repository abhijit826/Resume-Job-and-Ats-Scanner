
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Building2, MapPin, ExternalLink } from "lucide-react";
import type { DisplayableJob } from '@/types';

interface JobCardProps {
  job: DisplayableJob;
  isSaved: boolean;
  onSaveToggle: (jobId: string) => void;
}

export default function JobCard({ job, isSaved, onSaveToggle }: JobCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 rounded-lg overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={`${job.company} logo`}
              width={50}
              height={50}
              className="rounded-md border border-border"
              data-ai-hint={`${job.company} logo`}
            />
          ) : (
            <div className="w-[50px] h-[50px] bg-muted rounded-md flex items-center justify-center">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <CardTitle className="text-xl font-semibold leading-tight">{job.title}</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">{job.company}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 shrink-0" />
          <span>{job.location}</span>
        </div>
        <CardDescription className="text-sm text-foreground/80 line-clamp-4 leading-relaxed">
          {job.matchReason || job.description || 'No further details available.'}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col sm:flex-row gap-2">
        <Button
          variant={isSaved ? "secondary" : "default"}
          onClick={() => onSaveToggle(job.id)}
          className="w-full"
          aria-label={isSaved ? `Unsave ${job.title}` : `Save ${job.title}`}
        >
          <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-primary' : ''}`} />
          {isSaved ? 'Unsave Job' : 'Save Job'}
        </Button>
        {job.applicationUrl && (
          <Button asChild variant="outline" className="w-full">
            <Link href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply Now
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

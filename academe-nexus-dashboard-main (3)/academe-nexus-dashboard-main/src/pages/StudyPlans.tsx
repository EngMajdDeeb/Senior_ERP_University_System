import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Calendar, CheckCircle, Users, Upload, FileText, Bell, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStudyPlans } from "@/hooks/use-api";

interface StudyPlan {
  id: number;
  subjectName: string;
  instructor_name: string;
  semester: string;
  submission_status: "submitted" | "not_submitted" | "pending_review" | "approved";
  created_at: string | null;
  students_count: number;
  planContent?: string;
}

export default function StudyPlans() {
  const { toast } = useToast();
  const { data: studyPlansData, isLoading } = useStudyPlans();

  // Ensure data is always an array and handle different API response formats
  const studyPlans = Array.isArray(studyPlansData) ? studyPlansData : 
  (studyPlansData as any)?.results ? (studyPlansData as any).results : 
  (studyPlansData as any)?.data ? (studyPlansData as any).data : [];

  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);

  const getStatusBadge = (status: StudyPlan["submission_status"]) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Submitted</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800"><Calendar className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "not_submitted":
        return <Badge className="bg-red-100 text-red-800">❌ Not Submitted</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleSendReminder = (plan: StudyPlan) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to ${plan.instructor_name} for ${plan.subjectName} study plan submission`,
    });
  };

  const formatcreated_at = (dateString: string | null) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const submittedCount = studyPlans.filter((p: any) => p.submission_status === "submitted").length;
  const pendingCount = studyPlans.filter((p: any) => p.submission_status === "pending_review").length;
  const notSubmittedCount = studyPlans.filter((p: any) => p.submission_status === "not_submitted").length;
  const approvedCount = studyPlans.filter((p: any) => p.submission_status === "approved").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading study plans...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Study Plan Tracking
            </h1>
            <p className="text-muted-foreground text-lg">
              Track and manage study plan submissions from faculty
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                  <p className="text-2xl font-bold text-foreground">{studyPlans.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-green-600">{submittedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Not Submitted</p>
                  <p className="text-2xl font-bold text-red-600">{notSubmittedCount}</p>
                </div>
                <Bell className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-blue-600">{approvedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Plans Table */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="text-xl">Study Plan Submissions</CardTitle>
            <CardDescription>Track the status of all study plan submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Instructor Name</TableHead>
                  <TableHead>Student Count</TableHead>
                  <TableHead>Submission Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studyPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div className="font-medium">{plan.subject_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{plan.instructor_name}</div>
                    </TableCell>
                    <TableCell>
                      {plan.students_count}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(plan.submission_status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatcreated_at(plan.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {plan.submission_status === "submitted" || plan.submission_status === "pending_review" || plan.submission_status === "approved" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedPlan(plan)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Plan
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Study Plan - {plan.subjectName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Instructor</label>
                                    <p className="text-sm text-muted-foreground">{plan.instructor_name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Students</label>
                                    <p className="text-sm text-muted-foreground">{plan.students_count} enrolled</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="mt-1">{getStatusBadge(plan.submission_status)}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Submitted</label>
                                    <p className="text-sm text-muted-foreground">{formatcreated_at(plan.created_at)}</p>
                                  </div>
                                </div>
                                {plan.planContent && (
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Plan Content</label>
                                    <div className="p-4 bg-muted rounded-md">
                                      <pre className="text-sm whitespace-pre-wrap">{plan.planContent}</pre>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : null}
                        
                        {plan.submission_status === "not_submitted" && (
                          <Button variant="outline" size="sm" onClick={() => handleSendReminder(plan)}>
                            <Bell className="h-4 w-4 mr-1" />
                            Send Reminder
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
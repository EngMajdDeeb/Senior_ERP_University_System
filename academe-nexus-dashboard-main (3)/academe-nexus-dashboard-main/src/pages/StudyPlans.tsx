import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Calendar, CheckCircle, Users, Upload, FileText, Bell, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyPlan {
  id: number;
  subjectName: string;
  instructorName: string;
  semester: string;
  submissionStatus: "submitted" | "not_submitted" | "pending_review";
  submittedAt: string | null;
  studentsCount: number;
  planContent?: string;
}

export default function StudyPlans() {
  const { toast } = useToast();
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([
    {
      id: 1,
      subjectName: "Computer Science Fundamentals",
      instructorName: "Dr. Smith",
      semester: "Fall 2024",
      submissionStatus: "submitted",
      submittedAt: "2024-01-10T10:30:00",
      studentsCount: 45,
      planContent: "Week 1-4: Introduction to Programming\nWeek 5-8: Data Structures\nWeek 9-12: Algorithms\nWeek 13-16: Final Projects",
    },
    {
      id: 2,
      subjectName: "Advanced Mathematics",
      instructorName: "Prof. Johnson",
      semester: "Fall 2024",
      submissionStatus: "pending_review",
      submittedAt: "2024-01-08T14:15:00",
      studentsCount: 38,
      planContent: "Week 1-4: Calculus Review\nWeek 5-8: Linear Algebra\nWeek 9-12: Differential Equations\nWeek 13-16: Applied Mathematics",
    },
    {
      id: 3,
      subjectName: "Modern Physics",
      instructorName: "Dr. Brown",
      semester: "Fall 2024",
      submissionStatus: "not_submitted",
      submittedAt: null,
      studentsCount: 52,
    },
    {
      id: 4,
      subjectName: "Organic Chemistry",
      instructorName: "Prof. Wilson",
      semester: "Fall 2024",
      submissionStatus: "submitted",
      submittedAt: "2024-01-12T09:45:00",
      studentsCount: 35,
      planContent: "Week 1-4: Basic Organic Structures\nWeek 5-8: Reaction Mechanisms\nWeek 9-12: Synthesis\nWeek 13-16: Advanced Topics",
    },
    {
      id: 5,
      subjectName: "Biology Lab",
      instructorName: "Dr. Davis",
      semester: "Fall 2024",
      submissionStatus: "not_submitted",
      submittedAt: null,
      studentsCount: 28,
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);

  const getStatusBadge = (status: StudyPlan["submissionStatus"]) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Submitted</Badge>;
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800"><Calendar className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "not_submitted":
        return <Badge className="bg-red-100 text-red-800">❌ Not Submitted</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleSendReminder = (plan: StudyPlan) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to ${plan.instructorName} for ${plan.subjectName} study plan submission`,
    });
  };

  const formatSubmittedAt = (dateString: string | null) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const submittedCount = studyPlans.filter(p => p.submissionStatus === "submitted").length;
  const pendingCount = studyPlans.filter(p => p.submissionStatus === "pending_review").length;
  const notSubmittedCount = studyPlans.filter(p => p.submissionStatus === "not_submitted").length;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <TableHead>Submission Status</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studyPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.subjectName}</div>
                        <div className="text-sm text-muted-foreground">{plan.semester}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plan.instructorName}</div>
                        <div className="text-sm text-muted-foreground">{plan.studentsCount} students</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(plan.submissionStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatSubmittedAt(plan.submittedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {plan.submissionStatus === "submitted" || plan.submissionStatus === "pending_review" ? (
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
                                    <p className="text-sm text-muted-foreground">{plan.instructorName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Students</label>
                                    <p className="text-sm text-muted-foreground">{plan.studentsCount} enrolled</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="mt-1">{getStatusBadge(plan.submissionStatus)}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Submitted</label>
                                    <p className="text-sm text-muted-foreground">{formatSubmittedAt(plan.submittedAt)}</p>
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
                        
                        {plan.submissionStatus === "not_submitted" && (
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
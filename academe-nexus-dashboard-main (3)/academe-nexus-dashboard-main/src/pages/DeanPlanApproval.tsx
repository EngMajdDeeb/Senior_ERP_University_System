import { useState } from "react";
import DeanNavbar from "@/components/DeanNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileCheck, Eye, MessageSquare, CheckCircle, Clock, AlertCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeanPlanApproval, useApprovePlan, useReturnPlan } from "@/hooks/use-api";

interface StudyPlan {
  id: number;
  subject_name: string;
  instructor_name: string;
  department: string;
  submitted_at: string;
  teacher: string;
  submission_status: "submitted" | "approved" | "needs_revision" | "not_submitted";
  plan_content?: string;
  teacher_username?: string; // Added for new button
}

export default function DeanPlanApproval() {
  const { toast } = useToast();
  const { data, isLoading, error } = useDeanPlanApproval();
  const plans: StudyPlan[] = Array.isArray((data as any)?.results) ? (data as any).results : [];
  const approvePlan = useApprovePlan();
  const returnPlan = useReturnPlan();

  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState("");

  const submittedPlans = plans.filter(plan => plan.submission_status === "submitted");

  const handleViewPlan = (plan: StudyPlan) => {
    setSelectedPlan(plan);
    setShowViewModal(true);
  };

  const handleAddNotes = (plan: StudyPlan) => {
    setSelectedPlan(plan);
    setNotes(plan.plan_content || "");
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    if (!selectedPlan) return;
    returnPlan.mutate({ id: selectedPlan.id, data: { notes } });
    setShowNotesModal(false);
    setNotes("");
    setSelectedPlan(null);
  };

  const handleApprovePlan = (plan: StudyPlan) => {
    approvePlan.mutate(plan.id);
  };

  const handleSendReminder = (plan: StudyPlan) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to ${plan.instructor_name || plan.teacher_username || "responsible"} for ${plan.subject_name} study plan submission.`,
    });
    // Optionally, call a backend endpoint to actually send the reminder email/notification.
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="outline" className="border-blue-500 text-blue-700"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "needs_revision":
        return <Badge variant="outline" className="border-orange-500 text-orange-700"><AlertCircle className="h-3 w-3 mr-1" />Needs Revision</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading study plans.</div>;

  return (
    <div className="min-h-screen bg-background">
      <DeanNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-6">
          <FileCheck className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Study Plan Approval</h1>
            <p className="text-muted-foreground">Review and approve submitted study plans from coordinators</p>
          </div>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-blue-600">{submittedPlans.length}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{plans.filter((p: StudyPlan) => p.submission_status === "approved").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Need Revision</p>
                  <p className="text-2xl font-bold text-orange-600">{plans.filter((p: StudyPlan) => p.submission_status === "needs_revision").length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Plans List */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle>Study Plans for Review</CardTitle>
            <CardDescription>Submitted study plans awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Subject</th>
                    <th className="text-left p-3">Instructor</th>
                    <th className="text-left p-3">Department</th>
                    <th className="text-left p-3">Submitted</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan: StudyPlan) => (
                    <tr key={plan.id} className="border-b hover:bg-accent/50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-foreground">{plan.subject_name}</p>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{plan.instructor_name}</td>
                      <td className="p-3 text-sm">{plan.department}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {plan.submitted_at ? new Date(plan.submitted_at).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-3">{getStatusBadge(plan.submission_status)}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewPlan(plan)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {(plan.submission_status === "submitted" || plan.submission_status === "pending_review") && (
                            <Button 
                              size="sm" 
                              onClick={() => handleApprovePlan(plan)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {plan.submission_status === "submitted" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddNotes(plan)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Notes
                            </Button>
                          )}
                          {plan.submission_status === "not_submitted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(plan)}
                              className="text-yellow-700 border-yellow-500"
                            >
                              <Bell className="h-4 w-4 mr-1" />
                              Send Reminder
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {/* View Plan Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Study Plan Details</DialogTitle>
              <DialogDescription>
                {selectedPlan?.subject_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Instructor</Label>
                  <p className="text-foreground">{selectedPlan?.instructor_name}</p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-foreground">{selectedPlan?.department}</p>
                </div>
              </div>
              <div>
                <Label>Plan Content</Label>
                <div className="mt-2">
                  <p className="text-foreground whitespace-pre-line">{selectedPlan?.plan_content || "No content provided."}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Add Notes Modal */}
        <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Revision Notes</DialogTitle>
              <DialogDescription>
                Provide feedback and revision notes for {selectedPlan?.subject_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="revision-notes">Revision Notes</Label>
                <Textarea
                  id="revision-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter your feedback and revision requirements..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveNotes} className="academic-button flex-1">
                  Save Notes & Return
                </Button>
                <Button variant="outline" onClick={() => setShowNotesModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
import { useState } from "react";
import DeanNavbar from "@/components/DeanNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileCheck, Eye, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyPlan {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  department: string;
  submittedAt: string;
  submittedBy: string;
  status: "submitted" | "approved" | "needs_revision";
  notes?: string;
}

export default function DeanPlanApproval() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<StudyPlan[]>([
    {
      id: "1",
      courseCode: "CS301",
      courseName: "Data Structures and Algorithms",
      instructor: "Dr. Smith",
      department: "Computer Science",
      submittedAt: "2024-01-15T10:30:00",
      submittedBy: "coordinator",
      status: "submitted"
    },
    {
      id: "2",
      courseCode: "EE205",
      courseName: "Circuit Analysis",
      instructor: "Dr. Johnson",
      department: "Electrical Engineering",
      submittedAt: "2024-01-14T14:20:00",
      submittedBy: "coordinator",
      status: "submitted"
    },
    {
      id: "3",
      courseCode: "ME401",
      courseName: "Thermodynamics",
      instructor: "Dr. Brown",
      department: "Mechanical Engineering",
      submittedAt: "2024-01-13T09:15:00",
      submittedBy: "coordinator",
      status: "submitted"
    },
    {
      id: "4",
      courseCode: "CS202",
      courseName: "Database Systems",
      instructor: "Dr. Davis",
      department: "Computer Science",
      submittedAt: "2024-01-12T16:45:00",
      submittedBy: "coordinator",
      status: "approved"
    }
  ]);

  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState("");

  const submittedPlans = plans.filter(plan => plan.status === "submitted");

  const handleViewPlan = (plan: StudyPlan) => {
    setSelectedPlan(plan);
    setShowViewModal(true);
  };

  const handleAddNotes = (plan: StudyPlan) => {
    setSelectedPlan(plan);
    setNotes(plan.notes || "");
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    if (!selectedPlan) return;

    setPlans(prev => prev.map(plan =>
      plan.id === selectedPlan.id
        ? { ...plan, status: "needs_revision" as const, notes }
        : plan
    ));

    toast({
      title: "Notes Added",
      description: `Study plan returned with revision notes. Coordinator and department head notified.`,
    });

    setShowNotesModal(false);
    setNotes("");
    setSelectedPlan(null);
  };

  const handleApprovePlan = (plan: StudyPlan) => {
    setPlans(prev => prev.map(p =>
      p.id === plan.id
        ? { 
            ...p, 
            status: "approved" as const,
            notes: `Approved by Dean on ${new Date().toLocaleDateString()}`
          }
        : p
    ));

    toast({
      title: "Plan Approved",
      description: `Study plan approved successfully. Coordinator and department head notified.`,
    });
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

  const mockSchedule = [
    { time: "08:00 - 09:30", monday: "CS301 - Lab A", tuesday: "", wednesday: "CS301 - Room 101", thursday: "", friday: "CS301 - Lab A" },
    { time: "09:45 - 11:15", monday: "", tuesday: "CS301 - Room 101", wednesday: "", thursday: "CS301 - Room 101", friday: "" },
    { time: "11:30 - 13:00", monday: "Office Hours", tuesday: "", wednesday: "Office Hours", thursday: "", friday: "Office Hours" },
  ];

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
                  <p className="text-2xl font-bold text-green-600">{plans.filter(p => p.status === "approved").length}</p>
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
                  <p className="text-2xl font-bold text-orange-600">{plans.filter(p => p.status === "needs_revision").length}</p>
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
                    <th className="text-left p-3">Course</th>
                    <th className="text-left p-3">Instructor</th>
                    <th className="text-left p-3">Department</th>
                    <th className="text-left p-3">Submitted</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b hover:bg-accent/50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-foreground">{plan.courseCode}</p>
                          <p className="text-sm text-muted-foreground">{plan.courseName}</p>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{plan.instructor}</td>
                      <td className="p-3 text-sm">{plan.department}</td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(plan.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">{getStatusBadge(plan.status)}</td>
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
                          
                          {plan.status === "submitted" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAddNotes(plan)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Notes
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleApprovePlan(plan)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </>
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
                {selectedPlan?.courseCode} - {selectedPlan?.courseName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Instructor</Label>
                  <p className="text-foreground">{selectedPlan?.instructor}</p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-foreground">{selectedPlan?.department}</p>
                </div>
              </div>
              
              <div>
                <Label>Schedule</Label>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full border rounded-lg">
                    <thead>
                      <tr className="bg-accent">
                        <th className="border p-2 text-left">Time</th>
                        <th className="border p-2 text-left">Monday</th>
                        <th className="border p-2 text-left">Tuesday</th>
                        <th className="border p-2 text-left">Wednesday</th>
                        <th className="border p-2 text-left">Thursday</th>
                        <th className="border p-2 text-left">Friday</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockSchedule.map((slot, index) => (
                        <tr key={index}>
                          <td className="border p-2 font-medium">{slot.time}</td>
                          <td className="border p-2">{slot.monday}</td>
                          <td className="border p-2">{slot.tuesday}</td>
                          <td className="border p-2">{slot.wednesday}</td>
                          <td className="border p-2">{slot.thursday}</td>
                          <td className="border p-2">{slot.friday}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                Provide feedback and revision notes for {selectedPlan?.courseCode}
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
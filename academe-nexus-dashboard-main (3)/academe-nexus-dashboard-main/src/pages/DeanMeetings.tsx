import { useState } from "react";
import DeanNavbar from "@/components/DeanNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, FileText, PenTool, CheckCircle, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  participants: string[];
  minutes?: string;
  deanSigned: boolean;
  department: string;
}

export default function DeanMeetings() {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Faculty Council Meeting",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "completed",
      participants: ["Dr. Smith", "Dr. Johnson", "Dr. Brown", "Dean"],
      minutes: "Discussed curriculum updates for the new semester. Approved budget allocation for new lab equipment. Reviewed student performance metrics for Q4. Next meeting scheduled for February 15th.",
      deanSigned: false,
      department: "General"
    },
    {
      id: "2",
      title: "CS Department Review",
      date: "2024-01-18",
      time: "2:00 PM",
      status: "completed",
      participants: ["Dr. Davis", "Dr. Wilson", "Dean"],
      minutes: "Reviewed computer science program outcomes. Discussed new course proposals for advanced AI and machine learning. Approved hiring for 2 new faculty positions.",
      deanSigned: true,
      department: "Computer Science"
    },
    {
      id: "3",
      title: "Budget Planning Session",
      date: "2024-01-25",
      time: "9:00 AM",
      status: "scheduled",
      participants: ["Finance Director", "Department Heads", "Dean"],
      deanSigned: false,
      department: "General"
    },
    {
      id: "4",
      title: "Engineering Accreditation Review",
      date: "2024-01-16",
      time: "11:00 AM",
      status: "completed",
      participants: ["Dr. Anderson", "Dr. Taylor", "Dean"],
      minutes: "Reviewed accreditation requirements and compliance status. Prepared documentation for upcoming ABET visit. Assigned action items to department heads.",
      deanSigned: false,
      department: "Engineering"
    }
  ]);

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showMinutesModal, setShowMinutesModal] = useState(false);

  const relevantMeetings = meetings.filter(meeting => 
    meeting.participants.includes("Dean") || meeting.department === "General"
  );

  const pendingSignature = relevantMeetings.filter(meeting => 
    meeting.status === "completed" && meeting.minutes && !meeting.deanSigned
  );

  const handleViewMinutes = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMinutesModal(true);
  };

  const handleSignMeeting = (meetingId: string) => {
    setMeetings(prev => prev.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, deanSigned: true }
        : meeting
    ));

    toast({
      title: "Meeting Signed",
      description: "Meeting minutes have been officially signed by the Dean.",
    });

    setShowMinutesModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline" className="border-blue-500 text-blue-700"><Calendar className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DeanNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meeting Signatures</h1>
            <p className="text-muted-foreground">Review meeting minutes and provide official signatures</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Signature</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingSignature.length}</p>
                </div>
                <PenTool className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Signed Meetings</p>
                  <p className="text-2xl font-bold text-green-600">
                    {relevantMeetings.filter(m => m.deanSigned).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="academic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Meetings</p>
                  <p className="text-2xl font-bold text-blue-600">{relevantMeetings.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings List */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle>Your Meetings</CardTitle>
            <CardDescription>Meetings requiring your attention or signature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Meeting</th>
                    <th className="text-left p-3">Date & Time</th>
                    <th className="text-left p-3">Department</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Signature</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantMeetings.map((meeting) => (
                    <tr key={meeting.id} className="border-b hover:bg-accent/50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-foreground">{meeting.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {meeting.participants.length} participants
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm text-foreground">{formatDate(meeting.date)}</p>
                          <p className="text-sm text-muted-foreground">{meeting.time}</p>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{meeting.department}</td>
                      <td className="p-3">{getStatusBadge(meeting.status)}</td>
                      <td className="p-3">
                        {meeting.status === "completed" && meeting.minutes ? (
                          meeting.deanSigned ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Signed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-orange-500 text-orange-700">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          {meeting.status === "completed" && meeting.minutes && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewMinutes(meeting)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Minutes
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

        {/* Meeting Minutes Modal */}
        <Dialog open={showMinutesModal} onOpenChange={setShowMinutesModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Meeting Minutes</DialogTitle>
              <DialogDescription>
                {selectedMeeting?.title} - {selectedMeeting?.date}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Participants</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedMeeting?.participants.join(", ")}
                </p>
              </div>
              
              <div>
                <Label>Meeting Minutes</Label>
                <div className="mt-2 p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedMeeting?.minutes}</p>
                </div>
              </div>

              {selectedMeeting && !selectedMeeting.deanSigned && (
                <div className="flex space-x-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleSignMeeting(selectedMeeting.id)}
                    className="academic-button flex-1"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Sign as Dean
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMinutesModal(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              )}

              {selectedMeeting?.deanSigned && (
                <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Officially Signed by Dean</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
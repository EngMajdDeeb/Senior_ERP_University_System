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
import { useDeanMeetings, useUpdateMeeting } from "@/hooks/use-api";

interface Meeting {
  id: string | number;
  title: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled" | "upcoming";
  participants: string[];
  minutes?: string;
  signedByDean: boolean;
  department?: string;
  location?: string;
  description?: string;
  attendees?: number;
  agenda?: string;
  signature?: string; // Added signature field
}

export default function DeanMeetings() {
  const { toast } = useToast();
  const { data: meetingsData, isLoading } = useDeanMeetings();
  const updateMeetingMutation = useUpdateMeeting();

  // Ensure data is always an array and handle different API response formats
  const meetings = Array.isArray(meetingsData) ? meetingsData : 
                  (meetingsData as any)?.results ? (meetingsData as any).results : 
                  (meetingsData as any)?.data ? (meetingsData as any).data : [];

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showMinutesModal, setShowMinutesModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DeanNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading meetings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relevantMeetings = meetings;

  const pendingSignature = relevantMeetings.filter((meeting: any) => 
    meeting.status === "completed" && meeting.minutes && !meeting.signedByDean
  );

  const handleViewMinutes = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMinutesModal(true);
  };

  const handleSignMeeting = (meetingId: string | number) => {
    updateMeetingMutation.mutate(
      { id: typeof meetingId === 'string' ? parseInt(meetingId) : meetingId, data: { signedByDean: true } },
      {
        onSuccess: (data) => {
          setSelectedMeeting((prev) => prev ? { ...prev, ...data } : prev);
        },
      }
    );
    // setShowMinutesModal(false); // Remove this line so modal stays open and updates
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
                    {relevantMeetings.filter((m: any) => m.signedByDean).length}
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
                          meeting.signature ? (
                            <span className="text-green-800 font-semibold">{meeting.signature}</span>
                          ) : meeting.signedByDean ? (
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewMinutes(meeting)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          {meeting.status === "completed" && meeting.minutes && !meeting.signedByDean && (
                            <Button 
                              size="sm"
                              variant="default"
                              onClick={() => handleSignMeeting(meeting.id)}
                            >
                              <PenTool className="h-4 w-4 mr-1" />
                              Sign as Dean
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

              {selectedMeeting && !selectedMeeting.signedByDean && (
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

              {selectedMeeting?.signedByDean && (
                <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Officially Signed by Dean</span>
                  {selectedMeeting.signature && (
                    <div className="ml-4">
                      <Label>Signature:</Label>
                      <span className="text-green-800 font-semibold ml-2">{selectedMeeting.signature}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Users, Plus, FileText, Edit, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeetings, useCreateMeeting, useUpdateMeeting, useDeleteMeeting } from "@/hooks/use-api";
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: number;
  status: "upcoming" | "completed";
  description: string;
  location: string;
  agenda?: string;
  participants?: string[];
  minutes?: string;
  signedByDean?: boolean;
}

export default function Meetings() {
  const { toast } = useToast();
  const { data: meetingsData, isLoading } = useMeetings();
  const createMeetingMutation = useCreateMeeting();
  const updateMeetingMutation = useUpdateMeeting();
  const deleteMeetingMutation = useDeleteMeeting();

  // Ensure data is always an array and handle different API response formats
  const meetings = Array.isArray(meetingsData) ? meetingsData : 
                  (meetingsData as any)?.results ? (meetingsData as any).results : 
                  (meetingsData as any)?.data ? (meetingsData as any).data : [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [minutesDialog, setMinutesDialog] = useState<Meeting | null>(null);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    agenda: "",
    participants: [],
    status: "upcoming",
  });

  // Fetch users for participant options
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });
  const participantOptions = users.map((u: any) => {
    const name = [u.first_name, u.last_name].filter(Boolean).join(' ');
    return name ? `${name} (${u.username})` : u.username;
  });

  const handleSaveMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const meetingData = {
      title: newMeeting.title,
      date: newMeeting.date,
      time: newMeeting.time,
      description: newMeeting.description,
      location: newMeeting.location,
      agenda: newMeeting.agenda,
      participants: newMeeting.participants,
      status: newMeeting.status || "upcoming",
    };

    if (editingMeeting) {
      updateMeetingMutation.mutate({ id: editingMeeting.id, data: meetingData });
    } else {
      createMeetingMutation.mutate(meetingData);
    }

    setIsDialogOpen(false);
    setEditingMeeting(null);
    setNewMeeting({
      title: "",
      date: "",
      time: "",
      description: "",
      location: "",
      agenda: "",
      participants: [],
      status: "upcoming",
    });
  };

  const handleSendInvitations = () => {
    toast({
      title: "Invitations Sent",
      description: "Meeting invitations have been sent to all participants"
    });
  };

  const handleSaveMinutes = (meetingId: number, minutes: string) => {
    updateMeetingMutation.mutate({ 
      id: meetingId, 
      data: { minutes, status: "completed" } 
    });
    setMinutesDialog(null);
  };

  const handleSignByDean = (meetingId: number) => {
    updateMeetingMutation.mutate({ 
      id: meetingId, 
      data: { signedByDean: true } 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading meetings...</p>
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
              College Council Meetings
            </h1>
            <p className="text-muted-foreground text-lg">
              Organize and track college council meetings and decisions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="academic-button" onClick={() => {
                setEditingMeeting(null);
                setNewMeeting({
                  title: "",
                  date: "",
                  time: "",
                  description: "",
                  location: "",
                  agenda: "",
                  participants: [],
                  status: "upcoming",
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input 
                      value={newMeeting.title || ""} 
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      placeholder="Meeting title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input 
                      value={newMeeting.location || ""} 
                      onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                      placeholder="Meeting location"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input 
                      type="date" 
                      value={newMeeting.date || ""} 
                      onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time</label>
                    <Input 
                      value={newMeeting.time || ""} 
                      onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                      placeholder="e.g., 14:00 - 16:00"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea 
                    value={newMeeting.description || ""} 
                    onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                    placeholder="Meeting description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Agenda</label>
                  <Textarea 
                    value={newMeeting.agenda || ""} 
                    onChange={(e) => setNewMeeting({...newMeeting, agenda: e.target.value})}
                    placeholder="Meeting agenda"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Participants</label>
                  <Select value="" onValueChange={(value) => {
                    const current = newMeeting.participants || [];
                    if (!current.includes(value)) {
                      setNewMeeting({...newMeeting, participants: [...current, value]});
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add participants" />
                    </SelectTrigger>
                    <SelectContent>
                      {participantOptions.map(participant => (
                        <SelectItem key={participant} value={participant}>{participant}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(newMeeting.participants || []).map(participant => (
                      <Badge key={participant} variant="secondary" className="cursor-pointer" onClick={() => {
                        const updated = (newMeeting.participants || []).filter(p => p !== participant);
                        setNewMeeting({...newMeeting, participants: updated});
                      }}>
                        {participant} ×
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveMeeting}>
                    {editingMeeting ? "Update Meeting" : "Schedule Meeting"}
                  </Button>
                  <Button variant="outline" onClick={handleSendInvitations}>
                    <Mail className="h-4 w-4 mr-1" />
                    Send Invitations
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="academic-card-hover">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{meeting.title}</CardTitle>
                      <Badge className={getStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                      {meeting.signedByDean && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Signed by Dean
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{meeting.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setMinutesDialog(meeting)}>
                          <FileText className="h-4 w-4 mr-1" />
                          Minutes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Meeting Minutes - {meeting.title}</DialogTitle>
                        </DialogHeader>
                        <MinutesDialog meeting={meeting} onSave={handleSaveMinutes} onSign={handleSignByDean} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => {
                      setEditingMeeting(meeting);
                      setNewMeeting({
                        title: meeting.title,
                        date: meeting.date,
                        time: meeting.time,
                        description: meeting.description,
                        location: meeting.location,
                        agenda: meeting.agenda,
                        participants: meeting.participants,
                        status: meeting.status,
                      });
                      setIsDialogOpen(true);
                    }}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">{meeting.attendees} attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">📍 {meeting.location}</span>
                  </div>
                </div>
                {meeting.agenda && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Agenda:</h4>
                    <pre className="text-sm whitespace-pre-wrap">{meeting.agenda}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

interface MinutesDialogProps {
  meeting: Meeting;
  onSave: (meetingId: number, minutes: string) => void;
  onSign: (meetingId: number) => void;
}

function MinutesDialog({ meeting, onSave, onSign }: MinutesDialogProps) {
  const [minutes, setMinutes] = useState(meeting.minutes || "");

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Meeting Minutes</label>
        <Textarea
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Enter meeting minutes here..."
          rows={8}
          className="w-full"
        />
      </div>
      
      {meeting.minutes && (
        <div className="p-3 bg-muted rounded-md">
          <h4 className="font-medium mb-2">Current Minutes:</h4>
          <p className="text-sm whitespace-pre-wrap">{meeting.minutes}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button onClick={() => onSave(meeting.id, minutes)} disabled={!minutes.trim()}>
          Save Minutes
        </Button>
        {meeting.minutes && !meeting.signedByDean && (
          <Button variant="outline" onClick={() => onSign(meeting.id)}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Sign by Dean
          </Button>
        )}
      </div>
    </div>
  );
}
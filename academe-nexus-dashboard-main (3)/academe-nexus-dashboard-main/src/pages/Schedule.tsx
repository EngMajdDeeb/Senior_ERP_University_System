import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Plus, Check, X, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
  id: number;
  courseName: string;
  instructor: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function Schedule() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      courseName: "Computer Science Lecture",
      instructor: "Dr. Smith",
      room: "Room A-101",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:30",
    },
    {
      id: 2,
      courseName: "Mathematics Lab",
      instructor: "Prof. Johnson",
      room: "Lab B-205",
      day: "Monday",
      startTime: "11:00",
      endTime: "12:30",
    },
    {
      id: 3,
      courseName: "Physics Seminar",
      instructor: "Dr. Brown",
      room: "Hall C-301",
      day: "Tuesday",
      startTime: "14:00",
      endTime: "15:30",
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    courseName: "",
    instructor: "",
    room: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  const courses = ["Computer Science Lecture", "Mathematics Lab", "Physics Seminar", "Chemistry Lab", "Biology Workshop"];
  const instructors = ["Dr. Smith", "Prof. Johnson", "Dr. Brown", "Prof. Wilson", "Dr. Davis"];
  const rooms = ["Room A-101", "Lab B-205", "Hall C-301", "Room A-102", "Lab B-206"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const checkConflict = (schedule: Partial<Schedule>, excludeId?: number) => {
    return schedules.some(s => {
      if (excludeId && s.id === excludeId) return false;
      return s.day === schedule.day && 
             s.room === schedule.room &&
             ((schedule.startTime! >= s.startTime && schedule.startTime! < s.endTime) ||
              (schedule.endTime! > s.startTime && schedule.endTime! <= s.endTime) ||
              (schedule.startTime! <= s.startTime && schedule.endTime! >= s.endTime));
    });
  };

  const handleAddSchedule = () => {
    if (Object.values(newSchedule).some(v => !v)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (checkConflict(newSchedule)) {
      toast({
        title: "Conflict Detected",
        description: "This schedule conflicts with an existing one",
        variant: "destructive"
      });
      return;
    }

    const id = Math.max(...schedules.map(s => s.id)) + 1;
    setSchedules([...schedules, { ...newSchedule, id } as Schedule]);
    setNewSchedule({
      courseName: "",
      instructor: "",
      room: "",
      day: "",
      startTime: "",
      endTime: "",
    });
    setIsAdding(false);
    toast({
      title: "Success",
      description: "Schedule added successfully"
    });
  };

  const handleUpdateSchedule = (id: number, updatedSchedule: Partial<Schedule>) => {
    if (checkConflict(updatedSchedule, id)) {
      toast({
        title: "Conflict Detected",
        description: "This schedule conflicts with an existing one",
        variant: "destructive"
      });
      return;
    }

    setSchedules(schedules.map(s => s.id === id ? { ...s, ...updatedSchedule } : s));
    setEditingId(null);
    toast({
      title: "Success",
      description: "Schedule updated successfully"
    });
  };

  const handleDeleteSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
    toast({
      title: "Success",
      description: "Schedule deleted successfully"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Schedule Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage course schedules and classroom assignments
            </p>
          </div>
          <Button className="academic-button" onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        <div className="grid gap-6">
          {schedules.map((schedule) => (
            <ScheduleCard 
              key={schedule.id} 
              schedule={schedule} 
              isEditing={editingId === schedule.id}
              onEdit={() => setEditingId(schedule.id)}
              onSave={(updatedSchedule) => handleUpdateSchedule(schedule.id, updatedSchedule)}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDeleteSchedule(schedule.id)}
              courses={courses}
              instructors={instructors}
              rooms={rooms}
              days={days}
            />
          ))}
          
          {isAdding && (
            <AddScheduleCard
              schedule={newSchedule}
              onUpdate={setNewSchedule}
              onSave={handleAddSchedule}
              onCancel={() => {
                setIsAdding(false);
                setNewSchedule({
                  courseName: "",
                  instructor: "",
                  room: "",
                  day: "",
                  startTime: "",
                  endTime: "",
                });
              }}
              courses={courses}
              instructors={instructors}
              rooms={rooms}
              days={days}
            />
          )}
        </div>
      </main>
    </div>
  );
}

interface ScheduleCardProps {
  schedule: Schedule;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (schedule: Partial<Schedule>) => void;
  onCancel: () => void;
  onDelete: () => void;
  courses: string[];
  instructors: string[];
  rooms: string[];
  days: string[];
}

function ScheduleCard({ schedule, isEditing, onEdit, onSave, onCancel, onDelete, courses, instructors, rooms, days }: ScheduleCardProps) {
  const [editData, setEditData] = useState<Partial<Schedule>>(schedule);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <Card className="academic-card-hover border-primary">
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Course Name</label>
              <Select value={editData.courseName} onValueChange={(value) => setEditData({...editData, courseName: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Instructor</label>
              <Select value={editData.instructor} onValueChange={(value) => setEditData({...editData, instructor: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Room</label>
              <Select value={editData.room} onValueChange={(value) => setEditData({...editData, room: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map(room => (
                    <SelectItem key={room} value={room}>{room}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Day</label>
              <Select value={editData.day} onValueChange={(value) => setEditData({...editData, day: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Start Time</label>
              <Input 
                type="time" 
                value={editData.startTime} 
                onChange={(e) => setEditData({...editData, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Time</label>
              <Input 
                type="time" 
                value={editData.endTime} 
                onChange={(e) => setEditData({...editData, endTime: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} size="sm">
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="academic-card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{schedule.courseName}</CardTitle>
            <CardDescription>
              {schedule.instructor}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm">{schedule.day}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm">{schedule.startTime} - {schedule.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm">{schedule.room}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AddScheduleCardProps {
  schedule: Partial<Schedule>;
  onUpdate: (schedule: Partial<Schedule>) => void;
  onSave: () => void;
  onCancel: () => void;
  courses: string[];
  instructors: string[];
  rooms: string[];
  days: string[];
}

function AddScheduleCard({ schedule, onUpdate, onSave, onCancel, courses, instructors, rooms, days }: AddScheduleCardProps) {
  return (
    <Card className="academic-card-hover border-dashed border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-lg mb-4">Add New Schedule</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Course Name</label>
            <Select value={schedule.courseName} onValueChange={(value) => onUpdate({...schedule, courseName: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Instructor</label>
            <Select value={schedule.instructor} onValueChange={(value) => onUpdate({...schedule, instructor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map(instructor => (
                  <SelectItem key={instructor} value={instructor}>{instructor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Room</label>
            <Select value={schedule.room} onValueChange={(value) => onUpdate({...schedule, room: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room} value={room}>{room}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Day</label>
            <Select value={schedule.day} onValueChange={(value) => onUpdate({...schedule, day: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Start Time</label>
            <Input 
              type="time" 
              value={schedule.startTime || ""} 
              onChange={(e) => onUpdate({...schedule, startTime: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">End Time</label>
            <Input 
              type="time" 
              value={schedule.endTime || ""} 
              onChange={(e) => onUpdate({...schedule, endTime: e.target.value})}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={onSave} size="sm">
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" onClick={onCancel} size="sm">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Plus, Check, X, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from "@/hooks/use-api";

interface Schedule {
  id: number;
  course_name: string;
  instructor: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

export default function Schedule() {
  const { toast } = useToast();
  const { data: schedulesData, isLoading } = useSchedules();
  const createScheduleMutation = useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  const mapFromBackendSchedule = (schedule: any): Schedule => ({
    id: schedule.id,
    course_name: schedule.course_name,
    instructor: schedule.instructor,
    room: schedule.room,
    day: schedule.day,
    startTime: schedule.start_time,
    endTime: schedule.end_time,
  });

  // Ensure data is always an array and handle different API response formats
  const schedules = Array.isArray(schedulesData)
    ? schedulesData.map(mapFromBackendSchedule)
    : (schedulesData as any)?.results
      ? (schedulesData as any).results.map(mapFromBackendSchedule)
      : (schedulesData as any)?.data
        ? (schedulesData as any).data.map(mapFromBackendSchedule)
        : [];

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    course_name: "",
    instructor: "",
    room: "",
    day: "",
    startTime: "",
    endTime: "",
  });

  const courses = Array.from(new Set(schedules.map(s => s.course_name))) as string[];
  const instructors = Array.from(new Set(schedules.map(s => s.instructor))) as string[];
  const rooms = Array.from(new Set(schedules.map(s => s.room))) as string[];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const checkConflict = (schedule: Partial<Schedule>, excludeId?: number) => {
    return schedules.some((s: any) => {
      if (excludeId && s.id === excludeId) return false;
      return s.day === schedule.day && 
             s.room === schedule.room &&
             ((schedule.startTime! >= s.startTime && schedule.startTime! < s.endTime) ||
              (schedule.endTime! > s.startTime && schedule.endTime! <= s.endTime) ||
              (schedule.startTime! <= s.startTime && schedule.endTime! >= s.endTime));
    });
  };

  const mapToBackendSchedule = (schedule: Partial<Schedule>) => ({
    course_name: schedule.course_name,
    instructor: schedule.instructor,
    room: schedule.room,
    day: schedule.day,
    start_time: schedule.startTime,
    end_time: schedule.endTime,
  });

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

    createScheduleMutation.mutate(mapToBackendSchedule(newSchedule));
    setNewSchedule({
      course_name: "",
      instructor: "",
      room: "",
      day: "",
      startTime: "",
      endTime: "",
    });
    setIsAdding(false);
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

    updateScheduleMutation.mutate({ id, data: mapToBackendSchedule(updatedSchedule) });
    setEditingId(null);
  };

  const handleDeleteSchedule = (id: number) => {
    deleteScheduleMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading schedules...</p>
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

        {/* Table Header and Schedules Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-accent">
                <th className="p-3 text-left">Course Name</th>
                <th className="p-3 text-left">Instructor</th>
                <th className="p-3 text-left">Room</th>
                <th className="p-3 text-left">Day</th>
                <th className="p-3 text-left">Start Time</th>
                <th className="p-3 text-left">End Time</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b hover:bg-accent/50">
                  <td className="p-3 font-medium">{schedule.course_name}</td>
                  <td className="p-3">{schedule.instructor}</td>
                  <td className="p-3">{schedule.room}</td>
                  <td className="p-3">{schedule.day}</td>
                  <td className="p-3">{schedule.startTime}</td>
                  <td className="p-3">{schedule.endTime}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingId(schedule.id)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteSchedule(schedule.id)}>
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Add/Edit Schedule Cards remain below for inline editing/adding */}
        <div className="grid gap-6 mt-6">
          {editingId !== null && (
            <ScheduleCard 
              key={editingId} 
              schedule={schedules.find(s => s.id === editingId)!}
              isEditing={true}
              onEdit={() => {}}
              onSave={(updatedSchedule) => handleUpdateSchedule(editingId, updatedSchedule)}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDeleteSchedule(editingId)}
              courses={courses}
              instructors={instructors}
              rooms={rooms}
              days={days}
            />
          )}
          {isAdding && (
            <AddScheduleCard
              schedule={newSchedule}
              onUpdate={setNewSchedule}
              onSave={handleAddSchedule}
              onCancel={() => {
                setIsAdding(false);
                setNewSchedule({
                  course_name: "",
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
              <Select value={editData.course_name} onValueChange={(value) => setEditData({...editData, course_name: value})}>
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
            <CardTitle className="text-xl">{schedule.course_name}</CardTitle>
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
            <Select value={schedule.course_name} onValueChange={(value) => onUpdate({...schedule, course_name: value})}>
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
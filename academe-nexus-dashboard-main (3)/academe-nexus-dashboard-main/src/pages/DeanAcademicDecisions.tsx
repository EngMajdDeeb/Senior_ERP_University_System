import { useState } from "react";
import DeanNavbar from "@/components/DeanNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Filter, FileWarning } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDeanStudentsAttention, useIssueDeanDecision } from "@/hooks/use-api";

interface Student {
  id: string;
  fullName: string;
  studentId: string;
  gpa: number;
  previousWarnings: number;
  department: string;
  selected: boolean;
}

export default function DeanAcademicDecisions() {
  const { toast } = useToast();
  const { data: students, isLoading, error } = useDeanStudentsAttention();
  const issueDecision = useIssueDeanDecision();

  const [filters, setFilters] = useState({
    gpaThreshold: "2.0",
    warningsCount: "all",
    department: "all"
  });
  const [selected, setSelected] = useState<{ [id: string]: boolean }>({});
  const [decisionType, setDecisionType] = useState("");
  const [deanPassword, setDeanPassword] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const departments = [
    ...new Set((students || []).map((s: any) => s.department).filter(Boolean))
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading students.</div>;

  const filteredStudents = (students || []).filter(student => {
    const meetsGPA = student.gpa < parseFloat(filters.gpaThreshold);
    const meetsWarnings = filters.warningsCount === "all" || student.previousWarnings === parseInt(filters.warningsCount);
    const meetsDepartment = filters.department === "all" || student.department === filters.department;
    return meetsGPA && meetsWarnings && meetsDepartment;
  });

  const selectedStudents = filteredStudents.filter(student => selected[student.id]);

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    setSelected(prev => ({ ...prev, [studentId]: checked }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected: { [id: string]: boolean } = {};
    filteredStudents.forEach(s => { newSelected[s.id] = checked; });
    setSelected(newSelected);
  };

  const handleConfirmDecision = () => {
    if (!decisionType) {
      toast({ title: "Error", description: "Please select a decision type", variant: "destructive" });
      return;
    }
    if (selectedStudents.length === 0) {
      toast({ title: "Error", description: "Please select at least one student", variant: "destructive" });
      return;
    }
    setShowConfirmModal(true);
  };

  const handlePasswordConfirm = () => {
    if (!deanPassword) {
      toast({ title: "Error", description: "Please enter your password to confirm", variant: "destructive" });
      return;
    }
    selectedStudents.forEach(student => {
      issueDecision.mutate({ student: student.id, decision_type: decisionType, notes: "" });
    });
    toast({
      title: "Decision Issued Successfully",
      description: `${decisionType} issued for ${selectedStudents.length} students. Email notifications sent.`,
    });
    setSelected({});
    setDecisionType("");
    setDeanPassword("");
    setShowConfirmModal(false);
  };

  const getWarningBadge = (warnings: number) => {
    if (warnings === 0) return <Badge variant="secondary">No Warnings</Badge>;
    if (warnings === 1) return <Badge variant="outline" className="border-yellow-500 text-yellow-700">1 Warning</Badge>;
    return <Badge variant="destructive">{warnings} Warnings</Badge>;
  };

  const getGPABadge = (gpa: number) => {
    if (gpa < 1.5) return <Badge variant="destructive">{gpa.toFixed(1)}</Badge>;
    if (gpa < 2.0) return <Badge variant="outline" className="border-orange-500 text-orange-700">{gpa.toFixed(1)}</Badge>;
    return <Badge variant="secondary">{gpa.toFixed(1)}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <DeanNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Decisions</h1>
            <p className="text-muted-foreground">Review students with low GPA and issue academic warnings or dismissals</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="academic-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>GPA Threshold</Label>
                <Select value={filters.gpaThreshold} onValueChange={(value) => setFilters(prev => ({ ...prev, gpaThreshold: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2.0">Below 2.0</SelectItem>
                    <SelectItem value="2.5">Below 2.5</SelectItem>
                    <SelectItem value="3.0">Below 3.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Previous Warnings</Label>
                <Select value={filters.warningsCount} onValueChange={(value) => setFilters(prev => ({ ...prev, warningsCount: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="0">0 Warnings</SelectItem>
                    <SelectItem value="1">1 Warning</SelectItem>
                    <SelectItem value="2">2 Warnings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={filters.department} onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="academic-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Students Requiring Attention</CardTitle>
                <CardDescription>Students with GPA below threshold: {filteredStudents.length} found</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filteredStudents.length > 0 && filteredStudents.every(s => selected[s.id])}
                  onCheckedChange={handleSelectAll}
                />
                <Label>Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Select</th>
                    <th className="text-left p-3">Full Name</th>
                    <th className="text-left p-3">Student ID</th>
                    <th className="text-left p-3">GPA</th>
                    <th className="text-left p-3">Previous Warnings</th>
                    <th className="text-left p-3">Department</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-accent/50">
                      <td className="p-3">
                        <Checkbox
                          checked={selected[student.id]}
                          onCheckedChange={(checked) => handleStudentSelect(student.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-3 font-medium">{student.fullName}</td>
                      <td className="p-3 text-muted-foreground">{student.studentId}</td>
                      <td className="p-3">{getGPABadge(student.gpa)}</td>
                      <td className="p-3">{getWarningBadge(student.previousWarnings)}</td>
                      <td className="p-3 text-sm">{student.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Decision Section */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileWarning className="h-5 w-5" />
              <span>Issue Decision</span>
            </CardTitle>
            <CardDescription>
              {selectedStudents.length} student(s) selected for decision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={decisionType} onValueChange={setDecisionType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="first-warning" id="first-warning" />
                <Label htmlFor="first-warning">📌 First Warning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="second-warning" id="second-warning" />
                <Label htmlFor="second-warning">📌 Second Warning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dismissal" id="dismissal" />
                <Label htmlFor="dismissal">📌 Academic Dismissal</Label>
              </div>
            </RadioGroup>

            <Button 
              onClick={handleConfirmDecision}
              className="academic-button"
              disabled={selectedStudents.length === 0 || !decisionType}
            >
              ✅ Confirm Decision
            </Button>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Academic Decision</DialogTitle>
              <DialogDescription>
                Please enter your password to confirm this decision for {selectedStudents.length} student(s).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dean-password">Dean Password</Label>
                <Input
                  id="dean-password"
                  type="password"
                  value={deanPassword}
                  onChange={(e) => setDeanPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handlePasswordConfirm} className="academic-button flex-1">
                  Confirm Decision
                </Button>
                <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="flex-1">
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
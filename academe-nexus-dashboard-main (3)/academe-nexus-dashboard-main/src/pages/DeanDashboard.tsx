import DeanNavbar from "@/components/DeanNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, FileCheck, Users, AlertTriangle, Calendar, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeanDashboardStats, useDeanDashboardActivity, useDeanStudentsAttention, useDeanPlanApproval, useDeanMeetings } from "@/hooks/use-api";
import { useAuth } from "@/contexts/AuthContext";

export default function DeanDashboard() {
  const { user } = useAuth();
  const { data: dashboardStats, isLoading: statsLoading } = useDeanDashboardStats();
  const { data: recentActivityData, isLoading: activityLoading } = useDeanDashboardActivity();
  const { data: studentsAttentionData } = useDeanStudentsAttention();
  const { data: planApprovalsData } = useDeanPlanApproval();
  const { data: deanMeetingsData } = useDeanMeetings();

  // Ensure data is always an array and handle different API response formats
  const recentActivity = Array.isArray(recentActivityData) ? recentActivityData : 
                        recentActivityData?.results ? recentActivityData.results : 
                        recentActivityData?.data ? recentActivityData.data : [];
  
  const studentsAttention = Array.isArray(studentsAttentionData) ? studentsAttentionData : 
                           studentsAttentionData?.results ? studentsAttentionData.results : 
                           studentsAttentionData?.data ? studentsAttentionData.data : [];
  
  const planApprovals = Array.isArray(planApprovalsData) ? planApprovalsData : 
                       planApprovalsData?.results ? planApprovalsData.results : 
                       planApprovalsData?.data ? planApprovalsData.data : [];
  
  const deanMeetings = Array.isArray(deanMeetingsData) ? deanMeetingsData : 
                      deanMeetingsData?.results ? deanMeetingsData.results : 
                      deanMeetingsData?.data ? deanMeetingsData.data : [];

  const pendingDecisions = studentsAttention.length;
  const plansToReview = planApprovals.filter((plan: any) => plan.status === 'pending').length;
  const meetingsToSign = deanMeetings.filter((meeting: any) => meeting.status === 'completed' && !meeting.signedByDean).length;
  const approvedPlans = planApprovals.filter((plan: any) => plan.status === 'approved').length;

  const quickStats = [
    { label: "Pending Decisions", value: pendingDecisions.toString(), icon: AlertTriangle, color: "text-orange-600" },
    { label: "Plans to Review", value: plansToReview.toString(), icon: FileCheck, color: "text-blue-600" },
    { label: "Meetings to Sign", value: meetingsToSign.toString(), icon: Calendar, color: "text-purple-600" },
    { label: "Approved Plans", value: approvedPlans.toString(), icon: CheckCircle, color: "text-green-600" },
  ];

  const serviceCards = [
    {
      title: "Academic Decisions",
      description: "Review student performance and issue academic warnings or dismissals",
      icon: UserCheck,
      href: "/dean/academic-decisions",
      color: "border-red-200 hover:border-red-300",
      badge: `${pendingDecisions} Pending`
    },
    {
      title: "Study Plan Approval",
      description: "Review and approve submitted study plans from coordinators",
      icon: FileCheck,
      href: "/dean/plan-approval",
      color: "border-blue-200 hover:border-blue-300",
      badge: `${plansToReview} To Review`
    },
    {
      title: "Meeting Signatures",
      description: "Sign completed meeting minutes and review proceedings",
      icon: Users,
      href: "/dean/meetings",
      color: "border-purple-200 hover:border-purple-300",
      badge: `${meetingsToSign} To Sign`
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DeanNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user?.first_name || user?.username || 'Dean'}!
          </h1>
          <p className="text-muted-foreground">Manage academic decisions, approve study plans, and oversee university operations.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="academic-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCards.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className={`academic-card ${service.color} transition-all duration-200 hover:shadow-academic-lg group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {service.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild className="w-full academic-button">
                    <Link to={service.href}>
                      Access {service.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="academic-card mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description} - {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-accent/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">No recent activity</p>
                    <p className="text-xs text-muted-foreground">Activity will appear here as it occurs</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
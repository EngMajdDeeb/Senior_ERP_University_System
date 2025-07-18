import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BookOpen, BarChart3, Clock, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useMeetings, useStudyPlans, useRecentActivities } from "@/hooks/use-api";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: meetingsData } = useMeetings();
  const { data: studyPlansData } = useStudyPlans();
  const { data: recentActivitiesData } = useRecentActivities();

  // Ensure data is always an array and handle different API response formats
  const meetings = Array.isArray(meetingsData) ? meetingsData : 
                  meetingsData?.results ? meetingsData.results : 
                  meetingsData?.data ? meetingsData.data : [];
  
  const studyPlans = Array.isArray(studyPlansData) ? studyPlansData : 
                    studyPlansData?.results ? studyPlansData.results : 
                    studyPlansData?.data ? studyPlansData.data : [];
  
  const recentActivities = Array.isArray(recentActivitiesData) ? recentActivitiesData : 
                          recentActivitiesData?.results ? recentActivitiesData.results : 
                          recentActivitiesData?.data ? recentActivitiesData.data : [];

  const serviceCards = [
    {
      title: "Schedule Management",
      description: "Manage course schedules, classroom assignments, and academic calendar",
      icon: Calendar,
      href: "/schedule",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "College Council Meetings",
      description: "Organize and track college council meetings and decisions",
      icon: Users,
      href: "/meetings",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Study Plan Tracking",
      description: "Monitor and manage student study plans and academic progress",
      icon: BookOpen,
      href: "/study-plans",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const upcomingMeetings = meetings.filter((meeting: any) => 
    new Date(meeting.date) > new Date() && meeting.status === 'upcoming'
  );

  const quickStats = [
    { label: "Upcoming Meetings", value: upcomingMeetings.length.toString(), icon: Clock },
    { label: "Active Students", value: studyPlans.length.toString(), icon: Users },
    { label: "Pending Tasks", value: "12", icon: Bell },
    { label: "Completion Rate", value: "94%", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user?.first_name || user?.username || 'College Coordinator'}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your academic responsibilities efficiently with our comprehensive ERP system.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="academic-card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Academic Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="academic-card-hover group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={service.href}>
                      <Button className="w-full academic-button">
                        Access Service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Stay updated with the latest activities and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">No recent activities</p>
                    <p className="text-xs text-muted-foreground">Activities will appear here as they occur</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
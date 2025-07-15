from rest_framework.routers import DefaultRouter
from .views import ScheduleViewSet, MeetingViewSet, StudyPlanViewSet, RecentActivityViewSet, DeanMeetingViewSet, DeanAcademicDecisionViewSet, DeanPlanApprovalViewSet, DeanDashboardStatsView, DeanRecentActivityView

router = DefaultRouter()
router.register(r'schedules', ScheduleViewSet)
router.register(r'meetings', MeetingViewSet)
router.register(r'study-plans', StudyPlanViewSet)
router.register(r'recent-activities', RecentActivityViewSet)
router.register(r'dean/meetings', DeanMeetingViewSet, basename='dean-meetings')
router.register(r'dean/academic-decisions', DeanAcademicDecisionViewSet, basename='dean-academic-decisions')
router.register(r'dean/plan-approval', DeanPlanApprovalViewSet, basename='dean-plan-approval')

from django.urls import path
urlpatterns = router.urls + [
    path('dean/dashboard/stats/', DeanDashboardStatsView.as_view(), name='dean-dashboard-stats'),
    path('dean/dashboard/recent-activity/', DeanRecentActivityView.as_view(), name='dean-dashboard-recent-activity'),
]
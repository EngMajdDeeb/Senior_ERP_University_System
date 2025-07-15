from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Schedule, Meeting, StudyPlan, RecentActivity, AcademicDecision, User
from .serializers import ScheduleSerializer, MeetingSerializer, StudyPlanSerializer, RecentActivitySerializer, AcademicDecisionSerializer
from .permissions import IsDean
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

class DeanMeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsDean]

class StudyPlanViewSet(viewsets.ModelViewSet):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the student to the logged-in user
        serializer.save(student=self.request.user)

    def get_queryset(self):
        # Only show study plans for the logged-in user, or all for admin
        if self.request.user.is_staff: # or self.request.user.is_coordinator if you add that field
            return StudyPlan.objects.all()
        return StudyPlan.objects.filter(student=self.request.user)

class RecentActivityViewSet(viewsets.ReadOnlyModelViewSet): # Read-only as activities are logged, not created via API
    queryset = RecentActivity.objects.all()
    serializer_class = RecentActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # In a real scenario, you might filter activities per user or per department
        # For simplicity, returning all or filtering by logged-in user (if user field is set)
        return RecentActivity.objects.all()

class DeanAcademicDecisionViewSet(viewsets.ModelViewSet):
    queryset = AcademicDecision.objects.all()
    serializer_class = AcademicDecisionSerializer
    permission_classes = [IsDean]

    @action(detail=False, methods=['get'], url_path='students')
    def students_needing_attention(self, request):
        # Example: filter students with GPA < 2.0 or with previous warnings
        gpa_threshold = float(request.query_params.get('gpa', 2.0))
        warnings_count = request.query_params.get('warnings', None)
        department = request.query_params.get('department', None)
        students = User.objects.filter(is_staff=False)
        if department:
            students = students.filter(groups__name=department)
        filtered = []
        for student in students:
            # Assume GPA and warnings are stored in profile or related model; here, mock logic
            gpa = getattr(student, 'gpa', 1.8)  # Replace with real field
            prev_warnings = AcademicDecision.objects.filter(student=student).count()
            if gpa < gpa_threshold and (warnings_count is None or prev_warnings == int(warnings_count)):
                filtered.append({
                    'id': student.id,
                    'fullName': student.get_full_name(),
                    'studentId': student.username,
                    'gpa': gpa,
                    'previousWarnings': prev_warnings,
                    'department': department or 'N/A',
                })
        return Response(filtered)

    @action(detail=False, methods=['post'], url_path='issue')
    def issue_decision(self, request):
        # Expects: student, decision_type, notes
        student_id = request.data.get('student')
        decision_type = request.data.get('decision_type')
        notes = request.data.get('notes', '')
        try:
            student = User.objects.get(id=student_id)
        except User.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        decision = AcademicDecision.objects.create(
            student=student,
            decision_type=decision_type,
            issued_by=request.user,
            notes=notes
        )
        serializer = self.get_serializer(decision)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DeanPlanApprovalViewSet(viewsets.ModelViewSet):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    permission_classes = [IsDean]

    @action(detail=True, methods=['post'], url_path='approve')
    def approve_plan(self, request, pk=None):
        plan = self.get_object()
        plan.submission_status = 'approved'
        plan.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'], url_path='return')
    def return_plan(self, request, pk=None):
        plan = self.get_object()
        notes = request.data.get('notes', '')
        plan.submission_status = 'needs_revision'
        plan.plan_content = notes
        plan.save()
        return Response({'status': 'needs_revision', 'notes': notes})

class DeanDashboardStatsView(APIView):
    permission_classes = [IsDean]
    def get(self, request):
        pending_decisions = AcademicDecision.objects.filter(decision_type__in=['first-warning', 'second-warning'], student__isnull=False).count()
        plans_to_review = StudyPlan.objects.filter(submission_status='submitted').count()
        meetings_to_sign = Meeting.objects.filter(status='completed', signedByDean=False).count()
        approved_plans = StudyPlan.objects.filter(submission_status='approved').count()
        return Response({
            'pending_decisions': pending_decisions,
            'plans_to_review': plans_to_review,
            'meetings_to_sign': meetings_to_sign,
            'approved_plans': approved_plans,
        })

class DeanRecentActivityView(APIView):
    permission_classes = [IsDean]
    def get(self, request):
        activities = RecentActivity.objects.all()[:10]
        data = [
            {
                'description': a.description,
                'timestamp': a.timestamp,
                'user': a.user.username if a.user else None
            }
            for a in activities
        ]
        return Response(data)
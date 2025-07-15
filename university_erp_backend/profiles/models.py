from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('dean', 'Dean'),
        ('coordinator', 'Coordinator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='coordinator')
    # Custom fields if needed
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        related_query_name='custom_user',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        related_query_name='custom_user',
        blank=True,
    )

    class Meta:
        db_table = 'profiles_user'  # Explicit table name

    def __str__(self):
        return self.username

class Schedule(models.Model):
    """Manages course schedules and classroom assignments."""
    # Renamed from 'title' to 'course_name' to match React's 'courseName'
    course_name = models.CharField(max_length=255)
    instructor = models.CharField(max_length=255)
    # Renamed from 'day_of_week' to 'day' to match React's 'day'
    day = models.CharField(max_length=10, choices=[
        ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday')
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    # Renamed from 'location' to 'room' to match React's 'room'
    room = models.CharField(max_length=100)
    # You might want to add a 'course' foreign key here if you have a Course model

    def __str__(self):
        return f"{self.course_name} by {self.instructor} on {self.day} at {self.start_time}"

class Meeting(models.Model):
    """Organizes and tracks college council meetings and decisions."""
    title = models.CharField(max_length=255)
    date = models.DateField()
    time = models.CharField(max_length=50) # e.g., "14:00 - 16:00"
    location = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    attendees = models.IntegerField(default=0) # Represents the count of attendees
    status = models.CharField(max_length=10, choices=[
        ('upcoming', 'upcoming'),
        ('completed', 'completed'),
    ])
    agenda = models.TextField(blank=True, null=True)
    participants = models.JSONField(blank=True, null=True, default=list)
    minutes = models.TextField(blank=True, null=True)
    signedByDean = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} on {self.date} at {self.time}"

class StudyPlan(models.Model):
    """Monitors and manages student study plans and academic progress."""
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_plans')

    # Renamed from 'course_name' to 'subject_name' to match React's 'subjectName'
    subject_name = models.CharField(max_length=255)
    # Added 'instructor_name' to match React's 'instructorName'
    instructor_name = models.CharField(max_length=255, blank=True, null=True)
    # Added 'semester' to match React's 'semester'
    semester = models.CharField(max_length=50, blank=True, null=True)

    # Updated choices to match React's 'submissionStatus' options
    submission_status = models.CharField(max_length=50, choices=[
        ('submitted', 'Submitted'),
        ('not_submitted', 'Not Submitted'),
        ('pending_review', 'Pending Review'),
    ], default='not_submitted')

    # Added 'submitted_at' to match React's 'submittedAt'
    submitted_at = models.DateTimeField(blank=True, null=True)
    # Added 'students_count' to match React's 'studentsCount'
    students_count = models.IntegerField(default=0)

    # Renamed from 'notes' to 'plan_content' to match React's 'planContent'
    plan_content = models.TextField(blank=True, null=True)

    # This field was present in your previous model, but not in React's variable.
    # Keeping it as it might be a backend-derived or internal metric.
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Study Plans"

    def __str__(self):
        return f"Study Plan for {self.student.username} - {self.subject_name} ({self.submission_status})"

class RecentActivity(models.Model):
    # ... (Keep your RecentActivity model as it was) ...
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='activities')

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Recent Activities"

    def __str__(self):
        return f"{self.description} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"

class AcademicDecision(models.Model):
    DECISION_TYPE_CHOICES = [
        ('first-warning', 'First Warning'),
        ('second-warning', 'Second Warning'),
        ('dismissal', 'Academic Dismissal'),
    ]
    student = models.ForeignKey('User', on_delete=models.CASCADE, related_name='academic_decisions')
    decision_type = models.CharField(max_length=20, choices=DECISION_TYPE_CHOICES)
    issued_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='issued_decisions')  # Dean
    issued_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.decision_type} for student ID {str(self.student_id)} by Dean ID {str(self.issued_by_id)}"
from rest_framework import serializers
from .models import Schedule, Meeting, StudyPlan, RecentActivity, User, AcademicDecision
from djoser.serializers import UserCreateSerializer, UserSerializer

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password')

class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name') # Add more fields if needed

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = '__all__'

class StudyPlanSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = StudyPlan
        fields = '__all__'
        read_only_fields = ['student'] # Student should be set based on the logged-in user

class RecentActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = RecentActivity
        fields = '__all__'

class AcademicDecisionSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    issued_by_username = serializers.CharField(source='issued_by.username', read_only=True)

    class Meta:
        model = AcademicDecision
        fields = '__all__'
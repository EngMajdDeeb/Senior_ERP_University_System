from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')
    fieldsets = (
        (None, {'fields': ('username', 'password', 'role')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'role', 'password1', 'password2'),
        }),
    )

admin.site.register(User, UserAdmin)
admin.site.register(StudyPlan)
admin.site.register(Schedule)
admin.site.register(Meeting)
admin.site.register(RecentActivity)
admin.site.register(AcademicDecision)
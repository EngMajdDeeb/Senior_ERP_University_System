from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsDean(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'dean'

class IsCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'coordinator'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsTeacherOrAdminOrReadOnly(BasePermission):
    """
    Only allow teachers and admins to create/update/delete. Coordinators can only read.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['teacher', 'admin'] 
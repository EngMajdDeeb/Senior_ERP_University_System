from rest_framework.permissions import BasePermission

class IsDean(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'dean'

class IsCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'coordinator'

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin' 
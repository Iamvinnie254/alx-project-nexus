from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'user_type', 'phone_number', 'location', 'is_verified', 'is_active', 'date_joined']
    list_filter = ['user_type', 'is_verified', 'is_active', 'date_joined']
    fieldsets = UserAdmin.fieldsets + (
        ('FreshHarvest Info', {
            'fields': ('user_type', 'phone_number', 'location', 'is_verified')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('FreshHarvest Info', {
            'fields': ('user_type', 'phone_number', 'location'),
        }),
    )
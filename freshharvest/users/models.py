from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    USER_TYPES = (
        ('farmer', 'Farmer'),
        ('consumer', 'Consumer'),
    )
    
    email = models.EmailField(
        _('email address'),
        unique=True
    )

    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPES,
        default='consumer',
        verbose_name=_('User Type')
    )

    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name=_('Phone Number')
    )

    location = models.CharField(
        max_length=200,
        blank=True,
        verbose_name=_('Location')
    )

    is_verified = models.BooleanField(
        default=False,
        verbose_name=_('Is Verified')
    )

    # Email login setup
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']

    class Meta:
        indexes = [
            models.Index(fields=['user_type', 'is_verified']),
            models.Index(fields=['location']),
        ]
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()}) - {self.email}"

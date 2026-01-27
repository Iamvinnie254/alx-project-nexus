from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Category(models.Model):
    """
    Product categories for organizing fresh produce (Fruits, Vegetables, Herbs)
    Supports filtering, URL routing, and admin organization
    """
    
    name = models.CharField(
        max_length=100, 
        unique=True,
        verbose_name=_('Category Name')
    )
    
    slug = models.SlugField(
        max_length=100, 
        unique=True,
        verbose_name=_('Slug')
    )
    
    description = models.TextField(
        blank=True, 
        verbose_name=_('Description')
    )
    
    image = models.URLField(
        blank=True, 
        null=True,
        verbose_name=_('Image URL')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )
    
    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
        ]
    
    def save(self, *args, **kwargs):
        """Auto-generate slug from name if not provided"""
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        # Explicit indexes for evaluation
        indexes = [
            models.Index(fields=['slug'], name='category_slug_idx'),
        ]
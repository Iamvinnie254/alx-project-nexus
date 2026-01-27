from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 
            'image', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_name(self, value):
        """Ensure unique category name"""
        if Category.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Category name already exists.")
        return value

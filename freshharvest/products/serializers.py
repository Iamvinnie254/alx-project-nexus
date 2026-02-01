from rest_framework import serializers
from .models import Category, Product

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

####
####
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_quantity',
            'category', 'category_name', 'farmer', 'farmer_name',
            'harvest_date', 'is_available', 'image', 'weight_per_unit',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'category_name', 'farmer_name']
    
    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be positive")
        return value
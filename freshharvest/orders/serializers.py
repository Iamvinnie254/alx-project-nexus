from rest_framework import serializers
from .models import Order, OrderItem, CartItem
from products.models import Product
from users.models import User

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price_at_purchase', 'subtotal']
        read_only_fields = ['id', 'subtotal']
    
    def get_subtotal(self, obj):
        return float(obj.quantity * obj.price_at_purchase)

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_name', 'product_price', 
            'quantity', 'subtotal', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'subtotal']
    
    def get_subtotal(self, obj):
        return float(obj.product.price * obj.quantity)
    
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be positive")
        return value

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)
    item_count = serializers.SerializerMethodField()
    consumer_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'consumer_name', 'total_amount', 'status', 
            'delivery_address', 'order_notes', 'created_at', 'items', 'item_count'
        ]
        read_only_fields = ['id', 'created_at', 'items', 'item_count', 'consumer_name']
    
    def get_item_count(self, obj):
        return obj.items.count()

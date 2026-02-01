from rest_framework import serializers
from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Order, OrderItem, CartItem
from products.models import Product
from products.serializers import ProductSerializer

class CheckoutCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class CheckoutSerializer(serializers.Serializer):
    delivery_address = serializers.CharField(max_length=500)
    order_notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    cart_items = CheckoutCartItemSerializer(many=True, min_length=1)

    def create(self, validated_data):
        user = self.context['request'].user
        cart_items_data = validated_data.pop('cart_items')
        
        with transaction.atomic():
            product_ids = [item['product_id'] for item in cart_items_data]
            products = Product.objects.filter(
                id__in=product_ids, is_available=True
            ).select_for_update(nowait=True)
            
            if len(products) != len(product_ids):
                raise ValidationError("Product not available")
            
            product_dict = {p.id: p for p in products}
            total_amount = Decimal('0.00')
            order_items_data = []
            
            for item in cart_items_data:
                product = product_dict[item['product_id']]
                if item['quantity'] > product.stock_quantity:
                    raise ValidationError(f"Insufficient stock for {product.name}")
                
                subtotal = product.price * item['quantity']
                total_amount += subtotal
                
                order_items_data.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'price_at_purchase': product.price
                })
            
            # Create Order
            order = Order.objects.create(
                user=user,
                total_amount=total_amount,
                delivery_address=validated_data['delivery_address'],
                order_notes=validated_data.get('order_notes', '')
            )
            
            # Create OrderItems + Deduct Stock
            for item_data in order_items_data:
                OrderItem.objects.create(**item_data, order=order)
                item_data['product'].stock_quantity -= item_data['quantity']
                item_data['product'].save(update_fields=['stock_quantity'])
            
            # Update availability
            depleted = [p for p in products if p.stock_quantity == 0]
            Product.objects.filter(id__in=[p.id for p in depleted]).update(is_available=False)
        
        return order

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    product_image = serializers.CharField(source='product.image', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_price', 'product_image', 'quantity', 'subtotal', 'created_at', 'updated_at']
    
    def get_subtotal(self, obj):
        return float(obj.product.price * obj.quantity)
    
    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        quantity = validated_data.get('quantity', 1)
        
        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return cart_item

class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'total_amount', 'status', 'delivery_address', 'order_notes', 'created_at', 'order_items', 'total_items']
    
    def get_order_items(self, obj):
        items = OrderItem.objects.filter(order=obj).select_related('product')
        return [{
            'product_name': item.product.name,
            'quantity': item.quantity,
            'price_at_purchase': item.price_at_purchase,
            'subtotal': item.price_at_purchase * item.quantity
        } for item in items]
    
    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.order_items.all())
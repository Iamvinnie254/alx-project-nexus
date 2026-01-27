from django.contrib import admin
from .models import Order, OrderItem, CartItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    fields = ['product', 'quantity', 'price_at_purchase']
    readonly_fields = ['subtotal']
    extra = 0
    
    def subtotal(self, obj):
        return f"KSh {obj.price_at_purchase * obj.quantity:.2f}"
    subtotal.short_description = 'Subtotal'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'consumer_link', 'total_amount', 'status', 'delivery_address_snip', 'created_at']
    list_filter = ['status', 'created_at']
    inlines = [OrderItemInline]
    readonly_fields = ['total_amount']
    
    def consumer_link(self, obj):
        return obj.user.username
    consumer_link.short_description = 'Consumer'
    
    def delivery_address_snip(self, obj):
        return obj.delivery_address[:30] + '...'
    delivery_address_snip.short_description = 'Address'

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity', 'subtotal', 'updated_at']
    list_filter = ['user', 'updated_at']
    
    def subtotal(self, obj):
        return f"KSh {obj.product.price * obj.quantity:.2f}"
    subtotal.short_description = 'Subtotal'

admin.site.register(OrderItem)
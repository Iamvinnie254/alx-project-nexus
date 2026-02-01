from django.contrib import admin
from .models import Order, OrderItem, CartItem

# ✅ DEFINE INLINE FIRST
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price_at_purchase']

# ✅ THEN REGISTER MODELS
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'status', 'delivery_address', 'created_at']
    list_filter = ['status', 'created_at', 'user']
    readonly_fields = ['created_at']
    inlines = [OrderItemInline]  # ✅ NOW OrderItemInline exists!

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price_at_purchase']
    list_filter = ['order__status']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'quantity', 'updated_at']
    list_filter = ['user']

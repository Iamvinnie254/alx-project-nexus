from django.contrib import admin
from .models import Category, Product


class ProductInline(admin.TabularInline):
    model = Product
    fields = ['name', 'price', 'stock_quantity', 'is_available']
    readonly_fields = ['is_available']
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description', 'slug']
    ordering = ['name']
    list_filter = ['created_at']
    inlines = [ProductInline]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'farmer', 'category', 'price',
        'stock_quantity', 'is_available', 'harvest_date'
    ]
    list_filter = ['category', 'farmer', 'is_available', 'harvest_date']
    search_fields = ['name', 'description']
    list_editable = ['price', 'stock_quantity']
    date_hierarchy = 'harvest_date'

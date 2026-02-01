from django.shortcuts import render
from django.db import models
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Production-ready Category API
    Supports: CRUD, search, filtering, pagination
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]
    filterset_fields = ['id']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        """Public read, authenticated write"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get categories with most products (business metric)"""
        from django.db.models import Count
        queryset = Category.objects.annotate(
            product_count=Count('products')
        ).filter(product_count__gt=0).order_by('-product_count')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

####
####
    from .serializers import ProductSerializer
from .models import Product

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'farmer').all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_available', 'farmer']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'harvest_date', 'created_at']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        harvest_fresh = self.request.query_params.get('harvest_fresh')
        if harvest_fresh == 'true':
            qs = qs.filter(harvest_date__gte=models.functions.TruncDate(models.functions.Now()))
        return qs
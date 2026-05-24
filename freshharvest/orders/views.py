from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem, CartItem
from .serializers import (
    CheckoutSerializer,
    FarmerOrderSerializer,
    OrderSerializer,
    CartItemSerializer,
)

class CheckoutViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='checkout')
    def checkout(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related('user')

    @action(detail=False, methods=['get'], url_path='farmer')
    def farmer_orders(self, request):
        if request.user.user_type != 'farmer':
            return Response(
                {'detail': 'Only farmer accounts can view farmer orders.'},
                status=status.HTTP_403_FORBIDDEN
            )
        orders = (
            Order.objects
            .filter(order_items__product__farmer=request.user)
            .select_related('user')
            .prefetch_related('order_items__product')
            .distinct()
        )
        page = self.paginate_queryset(orders)
        serializer_context = {'request': request}
        if page is not None:
            serializer = FarmerOrderSerializer(page, many=True, context=serializer_context)
            return self.get_paginated_response(serializer.data)
        serializer = FarmerOrderSerializer(orders, many=True, context=serializer_context)
        return Response(serializer.data)

class CartItemViewSet(viewsets.ModelViewSet):
    """
    **Cart Management API**
    
    Smart cart handles duplicates automatically:
    - Multiple POST → Increments quantity
    - UNIQUE(user, product) constraint
    - Full CRUD operations
    """
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       return CartItem.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """
        **Place Order + Clear Cart**
        
        Converts cart → Order + OrderItems, then clears cart
        
        Request:
        ```json
        {
          "delivery_address": "Kilimani, Nairobi",
          "order_notes": "Call before delivery",
          "cart_items": [{"product_id": 1, "quantity": 2}]
        }
        ```
        """
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            order = serializer.save()
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CheckoutViewSet, OrderViewSet, CartItemViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'cart/items', CartItemViewSet, basename='cartitem')

urlpatterns = [
    path('', include(router.urls)),
    path('cart/items/', include(router.urls)),
    path('checkout/', CheckoutViewSet.as_view({'post': 'checkout'}), name='checkout'),
]

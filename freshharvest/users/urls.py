from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('auth/register/', views.UserViewSet.as_view({'post': 'create'}), name='register'),
    path('auth/login/', views.UserViewSet.as_view({'post': 'me'}), name='login'),  # Will override with custom
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
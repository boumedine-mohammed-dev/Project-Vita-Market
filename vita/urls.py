
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet,AuthLoginViewSet,MeAuthViewSet,ProductViewSet,CategoryViewSet

router = DefaultRouter()
router.register('register', AuthViewSet, basename='register')
router.register('login', AuthLoginViewSet, basename='login')
router.register('auth', MeAuthViewSet, basename='auth')
router.register("products", ProductViewSet, basename="products")
router.register("categories", CategoryViewSet)
urlpatterns = [
    path('', include(router.urls))
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet,AuthLoginViewSet,MeAuthViewSet,ProductViewSet,CategoryViewSet,PanierViewSet,CommandeViewSet,FavoriViewSet,AvisViewSet,VendorDashboardViewSet,LigneCommandeViewSet,NotificationViewSet,ForgotPasswordViewSet,ResetPasswordViewSet

router = DefaultRouter()
router.register('register', AuthViewSet, basename='register')
router.register('login', AuthLoginViewSet, basename='login')
router.register('auth', MeAuthViewSet, basename='auth')
router.register("products", ProductViewSet, basename="products")
router.register("categories", CategoryViewSet)
router.register("panier", PanierViewSet, basename="panier")
router.register("commandes", CommandeViewSet, basename="commandes")
router.register("favoris", FavoriViewSet, basename="favoris")
router.register("avis", AvisViewSet, basename="avis")
router.register("reviews", AvisViewSet, basename="reviews")
router.register('auth/me', MeAuthViewSet, basename='me')
router.register('dashboard', VendorDashboardViewSet, basename='dashboard')
router.register("lignes", LigneCommandeViewSet, basename="lignes")
router.register("notifications", NotificationViewSet, basename="notifications")
router.register("forgot-password", ForgotPasswordViewSet, basename="forgot-password")
router.register("reset-password", ResetPasswordViewSet, basename="reset-password")
urlpatterns = [
    path('', include(router.urls))
]
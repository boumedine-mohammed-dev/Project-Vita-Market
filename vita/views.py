from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin
from .models import User,Produit,Categorie
from .serializers import RegisterSerializer,LoginSerializer,MeSerializer,ProductSerializer,CategorySerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django.contrib.auth import authenticate
import cloudinary.uploader
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class AuthViewSet(CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            response = Response({
                "message": "User created successfully",
                "user":{
                    'username':user.username,
                    'email':user.email,
                    'nom':user.nom,
                    'prenom':user.prenom,
                    'telephone':user.telephone,
                    'type_user':user.type_user,
                },
            }, status=status.HTTP_201_CREATED)

            # 🍪 Cookies
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=False,
                samesite="Lax"
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite="Lax"
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthLoginViewSet(viewsets.GenericViewSet):
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            remember_me = serializer.validated_data['remember_me']
            user = authenticate(username=username, password=password)

            if user is None:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # 🔥 generate JWT
            refresh = RefreshToken.for_user(user)
       
            if remember_me:
                access_expiry = 60 * 60 * 24 * 30  # 30 days
            else:
                access_expiry = 60 * 60 * 24  # 1 day
            response = Response({
                "message": "Login successful",
                'user':{
                    'username':user.username,
                    'email':user.email,
                    'nom':user.nom,
                    'prenom':user.prenom,
                    'telephone':user.telephone,
                    'type_user':user.type_user,
                }
            })

            # 🍪 cookies
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                max_age=access_expiry,
                httponly=True,
                secure=False,
                samesite="Lax"
            )

            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                max_age=access_expiry,
                httponly=True,
                secure=False,
                samesite="Lax"
            )

            return response

        return Response(serializer.errors, status=400)

class MeAuthViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = MeSerializer(request.user)
        return Response(serializer.data)


###############################----Products Vendor

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Produit.objects.all()
    

    def create(self, request):
        data = request.data.copy()
        print(data)
        # ✅ رفع الصورة إلى Cloudinary
        image = request.FILES.get("url")

        if image:
            upload_result = cloudinary.uploader.upload(image)
            data["url"] = upload_result["secure_url"]

        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            print(request.user)
            serializer.save(id_vendeur=request.user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def get_queryset(self):
       
        # ترجع فقط المنتجات الخاصة بالـ user الحالي
        return Produit.objects.filter(id_vendeur=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[])
    def all(self, request):
        # Client (كل المنتجات)
        products = Produit.objects.select_related("id_categorie", "id_vendeur")
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorySerializer

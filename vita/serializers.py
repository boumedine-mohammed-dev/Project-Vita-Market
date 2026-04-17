from rest_framework import serializers
from .models import User,Produit,Categorie
import re


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'nom',
            'prenom',
            'telephone',
            'type_user',
        ]

    # ✅ Email unique
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    # ✅ Password strong
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")

        if not re.search(r"[A-Z]", value):
            raise serializers.ValidationError("Must contain uppercase letter")

        if not re.search(r"[a-z]", value):
            raise serializers.ValidationError("Must contain lowercase letter")

        if not re.search(r"[0-9]", value):
            raise serializers.ValidationError("Must contain number")

        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    remember_me = serializers.BooleanField(default=False)

class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email","nom","prenom","telephone","type_user","date_joined"]

# serializer
class CategorySerializer(serializers.ModelSerializer):
    categorie_parente = serializers.CharField(source='categorie_parente.nom', read_only=True)
    class Meta:
        model = Categorie
        fields = ["id", "nom","description","created_at", "categorie_parente"]

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='id_categorie.nom', read_only=True)
    seller_name = serializers.CharField(source='id_vendeur.username', read_only=True)
    class Meta:
        model = Produit
        fields = ["id", "nom", "description", "prix", "quantite_stock", "note_moyenne", "url", "id_categorie", "category_name", "id_vendeur", "seller_name","tag"]


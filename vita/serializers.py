from rest_framework import serializers
from .models import User,Produit,Categorie,LignePanier,Panier,ProfilClient,ProfilVendeur,Commande,LigneCommande,Favori,Avis,Notification
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

class ProfilClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilClient
        fields = '__all__'

class ProfilVendeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilVendeur
        fields = '__all__'

class MeSerializer(serializers.ModelSerializer):
    info = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "username", "email","nom","prenom","telephone","type_user","date_joined","info"]

    def get_info(self, obj):
        if obj.type_user == "client":
            return ProfilClientSerializer(ProfilClient.objects.get(user=obj)).data
        else:
            return ProfilVendeurSerializer(ProfilVendeur.objects.get(user=obj)).data



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

class LignePanierSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source="id_produit.nom", read_only=True)
    produit_url = serializers.CharField(source="id_produit.url", read_only=True)
    produit_vendeur = serializers.CharField(source="id_produit.id_vendeur", read_only=True)
    produit_ID = serializers.CharField(source="id_produit.id", read_only=True)
    produit_stock = serializers.CharField(source="id_produit.quantite_stock", read_only=True)
    class Meta:
        model = LignePanier
        fields = ["id", "quantite", "prix_unitaire","produit_nom","produit_url","produit_vendeur","produit_stock","produit_ID"]

class LignePanierUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LignePanier
        fields = ["quantite"]

class PanierSerializer(serializers.ModelSerializer):
    lignes = LignePanierSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Panier
        fields = ["id", "created_at", "lignes", "total"]

    def get_total(self, obj):
        return sum(
            ligne.quantite * ligne.prix_unitaire
            for ligne in obj.lignes.all()
        )

class LigneCommandeSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source="id_produit.nom", read_only=True)
    produit_url = serializers.CharField(source="id_produit.url", read_only=True)
    produit_vendeur = serializers.CharField(source="id_produit.id_vendeur.username", read_only=True)
    vendeur_boutique = serializers.CharField(source="id_produit.id_vendeur.profil_vendeur.nom_boutique", read_only=True)
    has_avis = serializers.SerializerMethodField()

    class Meta:
        model = LigneCommande
        fields = [
            "id", "produit_nom", "produit_url", "quantite",
            "prix_unitaire", "sous_total", "produit_vendeur",
            "vendeur_boutique", "statut", "numero_suivi", "has_avis"
        ]

    def get_has_avis(self, obj):
        return hasattr(obj, 'avis') and obj.avis is not None

class CommandeSerializer(serializers.ModelSerializer):
    lignes = LigneCommandeSerializer(many=True, read_only=True)
    class Meta:
        model = Commande
        fields = "__all__"
        read_only_fields = ["user"]

class FavoriSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source="id_produit.nom", read_only=True)
    produit_url = serializers.CharField(source="id_produit.url", read_only=True)
    produit_prix = serializers.DecimalField(source="id_produit.prix", max_digits=10, decimal_places=2, read_only=True)
    quantite_stock = serializers.CharField(source="id_produit.quantite_stock", read_only=True)
    class Meta:
        model = Favori
        fields = ["id", "id_produit", "produit_nom", "produit_url", "produit_prix", "quantite_stock", "created_at"]

class AvisSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source="id_ligne_commande.id_produit.nom", read_only=True)
    user = serializers.CharField(source="id_ligne_commande.id_commande.id_client.username", read_only=True)

    class Meta:
        model = Avis
        fields = ["id", "note", "commentaire", "produit_nom", "user", "created_at"]

class MeUpdateSerializer(serializers.ModelSerializer):
    adresse_livraison = serializers.CharField(required=False)

    # vendor fields
    nom_boutique = serializers.CharField(required=False)
    adresse_boutique = serializers.CharField(required=False)
    description = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "nom",
            "prenom",
            "telephone",
            "email",
            "adresse_livraison",
            "nom_boutique",
            "adresse_boutique",
            "description",
        ]

    def update(self, instance, validated_data):
        # 1️⃣ update user fields
        user_fields = ["nom", "prenom", "telephone", "email","username"]

        for field in user_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()

        # 2️⃣ CLIENT update
        if instance.type_user == "client":
            from .serializers import ClientProfileUpdateSerializer

            profile_data = {
                "adresse_livraison": validated_data.get("adresse_livraison")
            }

            if hasattr(instance, "profil_client"):
                serializer = ClientProfileUpdateSerializer(
                    instance.profil_client,
                    data=profile_data,
                    partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

        # 3️⃣ VENDOR update
        elif instance.type_user == "vendeur":
            from .serializers import VendorProfileUpdateSerializer

            profile_data = {
                "nom_boutique": validated_data.get("nom_boutique"),
                "adresse_boutique": validated_data.get("adresse_boutique"),
                "description": validated_data.get("description"),
            }

            if hasattr(instance, "profil_vendeur"):
                serializer = VendorProfileUpdateSerializer(
                    instance.profil_vendeur,
                    data=profile_data,
                    partial=True
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

        return instance

class ClientProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilClient
        fields = ["adresse_livraison"]

class VendorProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilVendeur
        fields = ["nom_boutique", "adresse_boutique", "description"]

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["user", "created_at"]

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect")
        return value

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Le nouveau mot de passe doit faire au moins 8 caractères")
        return value
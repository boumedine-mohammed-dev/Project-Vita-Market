from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings

# =========================
# Custom User
# =========================
class User(AbstractUser):
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[\w\s]+$",
                message="Username can contain letters, numbers and spaces"
            )
        ]
    )
    class TypeUser(models.TextChoices):
        CLIENT = "client", "Client"
        VENDEUR = "vendeur", "Vendeur"

    # نقدر نحتفظ بـ username أو نحذفه لاحقاً
    email = models.EmailField(unique=True)

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, blank=True, null=True)

    type_user = models.CharField(
        max_length=10,
        choices=TypeUser.choices
    )

    date_inscription = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


# =========================
# Profil Client
# =========================
class ProfilClient(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="profil_client",
    )
    adresse_livraison = models.TextField()

    def __str__(self):
        return f"Client: {self.user.username}"


# =========================
# Profil Vendeur
# =========================
class ProfilVendeur(models.Model):
    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        APPROUVE = "approuve", "Approuvé"
        REJETE = "rejete", "Rejeté"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="profil_vendeur",
    )

    nom_boutique = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    adresse_boutique = models.TextField(blank=True, null=True)
    date_approbation = models.DateTimeField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=Statut.choices)

    def __str__(self):
        return self.nom_boutique


# =========================
# Categorie
# =========================
class Categorie(models.Model):
    categorie_parente = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sous_categories",
    )
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.nom


# =========================
# Produit
# =========================
class Produit(models.Model):
    id_vendeur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="produits",
    )
    id_categorie = models.ForeignKey(
        Categorie,
        on_delete=models.PROTECT,
        related_name="produits",
    )
    nom = models.CharField(max_length=200)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    url = models.URLField(max_length=500)
    quantite_stock = models.IntegerField(default=0)
    note_moyenne = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    class Tag(models.TextChoices):
        MEILLEURES_VENTES = 'MEILLEURES_VENTES', 'Meilleures ventes'
        NOUVEAUTES = 'NOUVEAUTES', 'Nouveautés'
        MIEUX_NOTES = 'MIEUX_NOTES', 'Les mieux notés'
    tag = models.CharField(max_length=20, choices=Tag.choices, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.nom


# =========================
# Panier
# =========================
class Panier(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="paniers",
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Panier #{self.id}"


# =========================
# Ligne Panier
# =========================
class LignePanier(models.Model):
    id_panier = models.ForeignKey(
        Panier,
        on_delete=models.CASCADE,
        related_name="lignes",
    )
    id_produit = models.ForeignKey(
        Produit,
        on_delete=models.CASCADE,
        related_name="lignes_panier",
    )
    quantite = models.IntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = [("id_panier", "id_produit")]

    def __str__(self):
        return f"LignePanier #{self.id}"


# =========================
# Commande
# =========================
class Commande(models.Model):
    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente", "En attente"
        CONFIRMEE = "confirmee", "Confirmée"
        EN_PREPARATION = "en_preparation", "En préparation"
        EXPEDIEE = "expediee", "Expédiée"
        LIVREE = "livree", "Livrée"
        COLLECTEE = "collectee", "Collectée"
        ANNULEE = "annulee", "Annulée"

    numero_commande = models.CharField(max_length=50, unique=True)

    id_client = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="commandes_client",
    )

    nom = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)

    statut = models.CharField(max_length=30, choices=Statut.choices, default=Statut.EN_ATTENTE)
    sous_total = models.DecimalField(max_digits=10, decimal_places=2)
    frais_livraison = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    adresse_livraison = models.TextField()
    numero_suivi = models.CharField(max_length=100, blank=True, null=True)
    is_deleted_by_client = models.BooleanField(default=False)
    is_deleted_by_vendor = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.numero_commande


# =========================
# Ligne Commande
# =========================
class LigneCommande(models.Model):
    class Statut(models.TextChoices):
        EN_ATTENTE = "en_attente"
        CONFIRMEE = "confirmee"
        EXPEDIEE = "expediee"
        LIVREE = "livree"
        ANNULEE = "annulee"

    statut = models.CharField(
        max_length=20,
        choices=Statut.choices,
        default=Statut.EN_ATTENTE
    )
    is_deleted_by_vendor = models.BooleanField(default=False)
    id_commande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name="lignes",
    )
    id_produit = models.ForeignKey(
        Produit,
        on_delete=models.PROTECT,
        related_name="lignes_commande",
    )
    id_vendeur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="commandes_vendeur",
    )
    quantite = models.IntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    sous_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"LigneCommande #{self.id}"


# =========================
# Avis
# =========================
class Avis(models.Model):
    id_ligne_commande = models.OneToOneField(
        LigneCommande,
        on_delete=models.CASCADE,
        related_name="avis",
    )
    note = models.IntegerField()
    commentaire = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Avis #{self.id} — note: {self.note}"


# =========================
# Favori
# =========================
class Favori(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favoris",
    )
    id_produit = models.ForeignKey(
        Produit,
        on_delete=models.CASCADE,
        related_name="favoris",
    )
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = [("user", "id_produit")]

    def __str__(self):
        return f"Favori: {self.user} → {self.id_produit}"

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    titre = models.CharField(max_length=255)
    message = models.TextField()
    lu = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre
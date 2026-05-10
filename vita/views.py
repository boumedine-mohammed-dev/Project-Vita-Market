from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin
from .models import User,Produit,Categorie,Panier,LignePanier,ProfilClient,ProfilVendeur,Commande,LigneCommande,Favori,Avis,Notification
from .serializers import RegisterSerializer,LoginSerializer,MeSerializer,ProductSerializer,CategorySerializer,PanierSerializer,LignePanierUpdateSerializer,ProfilClientSerializer,ProfilVendeurSerializer,CommandeSerializer,FavoriSerializer,AvisSerializer,MeUpdateSerializer,NotificationSerializer,PasswordChangeSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from django.contrib.auth import authenticate
import cloudinary.uploader
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.db.models import Avg, Sum, Count
from django.core.mail import send_mail
from rest_framework import serializers
from rest_framework.views import APIView
from django.conf import settings

import requests
# Create your views here.

class AuthViewSet(CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # 📧 Send Welcome Email
            try:
                if user.type_user == "vendeur":
                    subject = "Bienvenue chez Vita Market - Inscription Vendeur"
                    html_message = f"""
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                        <div style="background-color: #81e240; padding: 20px; text-align: center;">
                            <h1 style="color: #182111; margin: 0;">Vita Market</h1>
                        </div>
                        <div style="padding: 30px; color: #334155;">
                            <h2 style="color: #182111;">Bienvenue, {user.prenom} !</h2>
                            <p>Nous sommes ravis de vous compter parmi nos nouveaux vendeurs.</p>
                            <p><strong>Note importante :</strong> Votre compte est actuellement en attente d'approbation par notre équipe administrative. Vous recevrez une notification dès que votre boutique sera activée.</p>
                            <p>En attendant, vous pouvez commencer à configurer votre profil dans votre espace vendeur.</p>
                            <div style="margin: 30px 0; text-align: center;">
                                <a href="http://localhost:3000/login" style="background-color: #182111; color: #81e240; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Accéder à mon espace
                                </a>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                        </div>
                        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
                            &copy; 2026 Vita Market. Tous droits réservés.
                        </div>
                    </div>
                    """
                else:
                    subject = "Bienvenue chez Vita Market !"
                    html_message = f"""
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                        <div style="background-color: #81e240; padding: 20px; text-align: center;">
                            <h1 style="color: #182111; margin: 0;">Vita Market</h1>
                        </div>
                        <div style="padding: 30px; color: #334155;">
                            <h2 style="color: #182111;">Bienvenue, {user.prenom} !</h2>
                            <p>Merci d'avoir rejoint la communauté Vita Market.</p>
                            <p>Vous pouvez désormais découvrir et acheter les meilleurs produits locaux et biologiques directement auprès de nos producteurs.</p>
                            <div style="margin: 30px 0; text-align: center;">
                                <a href="http://localhost:3000/products" style="background-color: #182111; color: #81e240; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Découvrir nos produits
                                </a>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">À bientôt sur Vita Market !</p>
                        </div>
                        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
                            &copy; 2026 Vita Market. Tous droits réservés.
                        </div>
                    </div>
                    """

                send_mail(
                    subject=subject,
                    message=f"Bonjour {user.prenom}, bienvenue sur Vita Market !",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                    html_message=html_message
                )
            except Exception as e:
                print(f"Error sending welcome email: {e}")

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

class ForgotPasswordViewSet(viewsets.ViewSet):
    def create(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "L'adresse email est requise"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            
            # Django Email config
            reset_link = f"http://localhost:3000/reset-password?token=mock_token_{user.id}"
            
            html_message = f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #81e240;">Vita Market</h2>
                <p>Bonjour {user.prenom},</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
                <div style="margin: 30px 0;">
                    <a href="{reset_link}" style="background-color: #81e240; color: #182111; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Réinitialiser mon mot de passe
                    </a>
                </div>
                <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
                <p>À bientôt,<br>L'équipe Vita Market</p>
            </div>
            """
            
            try:
                send_mail(
                    subject="Réinitialisation de votre mot de passe - Vita Market",
                    message=f"Bonjour {user.prenom},\nVous avez demandé la réinitialisation de votre mot de passe.\nCliquez sur ce lien: {reset_link}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                    html_message=html_message
                )
            except Exception as e:
                print(f"Error calling Django send_mail: {e}")
                return Response({"error": f"Erreur interne lors de l'envoi de l'email: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({"message": "Si cette adresse existe, un email a été envoyé avec les instructions de réinitialisation."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # Prevent email enumeration by returning the same success message
            return Response({"message": "Si cette adresse existe, un email a été envoyé avec les instructions de réinitialisation."}, status=status.HTTP_200_OK)

class ResetPasswordViewSet(viewsets.ViewSet):
    def create(self, request):
        token = request.data.get('token')
        new_password = request.data.get('password')
        
        if not token or not new_password:
            return Response({"error": "Token et mot de passe requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validation du mock token: mock_token_{id}
        if not token.startswith("mock_token_"):
            return Response({"error": "Token invalide"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_id = token.replace("mock_token_", "")
            user = User.objects.get(id=user_id)
            
            # Mise à jour réelle du mot de passe
            user.set_password(new_password)
            user.save()
            
            return Response({"message": "Mot de passe réinitialisé avec succès !"}, status=status.HTTP_200_OK)
        except (User.DoesNotExist, ValueError):
            return Response({"error": "Utilisateur non trouvé ou token invalide"}, status=status.HTTP_400_BAD_REQUEST)

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
                    {"error": "Nom d'utilisateur ou mot de passe incorrect"},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # 🔥 generate JWT
            refresh = RefreshToken.for_user(user)
       
            if remember_me:
                access_expiry = 60 * 60 * 24 * 30  # 30 days
            else:
                access_expiry = 60 * 60 * 24  # 1 day



            if user.type_user == "client":
                profil = ProfilClient.objects.get(user=user)
                info = ProfilClientSerializer(profil).data
            else:
                profil = ProfilVendeur.objects.get(user=user)
                info = ProfilVendeurSerializer(profil).data
            response = Response({
                "message": "Login successful",
                'user':{
                    'username':user.username,
                    'email':user.email,
                    'nom':user.nom,
                    'prenom':user.prenom,
                    'telephone':user.telephone,
                    'type_user':user.type_user,
                    'info':info,
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
    @action(detail=False, methods=["patch"], url_path="update")
    def update_me(self, request):
        user = request.user

        # 🔒 checks (تبقى كما هي)
        if "email" in request.data:
            if User.objects.exclude(id=user.id).filter(email=request.data["email"]).exists():
                return Response({"error": "Email already used"}, status=400)

        if "username" in request.data:
            if User.objects.exclude(id=user.id).filter(username=request.data["username"]).exists():
                return Response({"error": "Username already used"}, status=400)

        # 🔥 unified serializer (router)
        serializer = MeUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            user = serializer.save()

            return Response(MeSerializer(user).data)

        return Response(serializer.errors, status=400)
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def logout(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response

    @action(detail=False, methods=["post"], url_path="change-password", permission_classes=[IsAuthenticated])
    def change_password(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Mot de passe modifié avec succès"})
        return Response(serializer.errors, status=400)


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
        user = self.request.user

        # ✅ client (مش مسجل أو مسجل كـ client)
        if not user.is_authenticated or user.type_user == "client":
            return Produit.objects.all()

        # ✅ vendor
        return Produit.objects.filter(id_vendeur=user)

    @action(detail=False, methods=['get'], permission_classes=[])
    def all(self, request):
        # Client (كل المنتجات)
        products = Produit.objects.select_related("id_categorie", "id_vendeur")
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        data = request.data.copy()

        # ✅ image upload
        image = request.FILES.get("url")

        if image:
            upload_result = cloudinary.uploader.upload(image)
            data["url"] = upload_result["secure_url"]

        serializer = self.get_serializer(instance, data=data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorySerializer


class PanierViewSet(viewsets.ModelViewSet):
    serializer_class = PanierSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Panier.objects.filter(user=self.request.user)

    def get_or_create_panier(self):
        panier, created = Panier.objects.get_or_create(user=self.request.user)
        return panier

    @action(detail=False, methods=["post"])
    def add_product(self, request):
        produit_id = request.data.get("produit")
        quantite = int(request.data.get("quantite", 1))

        try:
            produit = Produit.objects.get(id=produit_id)
        except Produit.DoesNotExist:
            return Response({"error": "Produit not found"}, status=404)

        panier = self.get_or_create_panier()

        ligne, created = LignePanier.objects.get_or_create(
            id_panier=panier,
            id_produit=produit,
            defaults={
                "quantite": quantite,
                "prix_unitaire": produit.prix,
            },
        )

        if not created:
            ligne.quantite += quantite
            ligne.save()

        return Response({"message": "Produit ajouté au panier"})
    @action(detail=False, methods=["get"])
    def my_panier(self, request):
        panier = self.get_or_create_panier()
        serializer = self.get_serializer(panier)
        return Response(serializer.data)

    @action(detail=False, methods=["delete"], url_path="retirer_ligne/(?P<ligne_id>[^/.]+)")
    def retirer_ligne(self, request, ligne_id=None):
        ligne = get_object_or_404(LignePanier, id=ligne_id, id_panier__user=request.user)
        ligne.delete()
        return Response({"message": "deleted"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["patch"], url_path="modifier_ligne/(?P<ligne_id>[^/.]+)")
    def modifier_ligne(self, request, ligne_id=None):
        ligne = get_object_or_404(LignePanier, id=ligne_id, id_panier__user=request.user)
        quantite = request.data.get("quantite")

        if int(quantite) <= 0:
            ligne.delete()
            return Response({"message": "deleted"}, status=204)
        serializer = LignePanierUpdateSerializer(ligne, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

class CommandeViewSet(viewsets.ModelViewSet):
    serializer_class = CommandeSerializer


    def get_queryset(self):
        user = self.request.user

        # 👤 CLIENT
        if user.type_user == "client":
            return Commande.objects.filter(
            id_client=user,
            is_deleted_by_client=False
        )

    # 🏪 VENDOR
        if user.type_user == "vendeur":
            commande_ids = LigneCommande.objects.filter(
                id_vendeur=user
            ).values_list("id_commande", flat=True)

            return Commande.objects.filter(
            id__in=commande_ids,
            is_deleted_by_vendor=False
        ).distinct()

        return Commande.objects.none()
    @transaction.atomic
    def create(self, request, *args, **kwargs):

        user = request.user if request.user.is_authenticated else None

    # =========================
    # 👤 CLIENT CONNECTÉ
    # =========================
        if user:
            panier = Panier.objects.filter(user=user).first()

            if not panier or not panier.lignes.exists():
                return Response({"error": "Panier vide"}, status=400)

            lignes_panier = list(LignePanier.objects.filter(id_panier=panier))

    # =========================
    # 👤 INVITE (GUEST)
    # =========================
        else:
            lignes_data = request.data.get("lignes", [])

            if not lignes_data:
                return Response({"error": "Panier vide (invite)"}, status=400)

            lignes_panier = lignes_data

    # =========================
    # 🔥 STOCK CHECK
    # =========================
        for ligne in lignes_panier:

            if user:
                produit = ligne.id_produit
                quantite = ligne.quantite
            else:
                produit = Produit.objects.get(id=ligne["produit"])
                quantite = ligne["quantite"]

            if produit.quantite_stock < quantite:
                return Response(
                    {"error": f"Stock insuffisant pour {produit.nom}"},
                    status=400
                )

    # =========================
    # 🧾 CREATE COMMANDE
    # =========================
        commande = Commande.objects.create(
            id_client=user,
            nom=request.data.get("nom"),
            email=request.data.get("email"),
            telephone=request.data.get("telephone"),
            adresse_livraison=request.data.get("adresse_livraison"),
            sous_total=request.data.get("sous_total"),
            frais_livraison=request.data.get("frais_livraison"),
            total=request.data.get("total"),
            numero_commande=request.data.get("numero_commande"),
        )

        vendeurs = set()

    # =========================
    # 📦 CREATE LIGNES
    # =========================
        for ligne in lignes_panier:

            if user:
                produit = ligne.id_produit
                quantite = ligne.quantite
                prix = ligne.prix_unitaire
            else:
                produit = Produit.objects.get(id=ligne["produit"])
                quantite = ligne["quantite"]
                prix = produit.prix

            LigneCommande.objects.create(
                id_commande=commande,
                id_produit=produit,
                quantite=quantite,
                prix_unitaire=prix,
                id_vendeur=produit.id_vendeur,
                sous_total=quantite * prix,
            )

            produit.quantite_stock -= quantite
            produit.save()

            vendeurs.add(produit.id_vendeur)

    # =========================
    # 🔔 NOTIFICATIONS
    # =========================
        for vendeur in vendeurs:
            Notification.objects.create(
                user=vendeur,
                titre="Nouvelle commande",
                message=f"Commande #{commande.numero_commande} reçue"
            )

    # =========================
    # 🧹 CLEAR PANIER CLIENT
    # =========================
        if user:
            panier.lignes.all().delete()

        return Response(self.get_serializer(commande).data, status=201)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        commande = self.get_object()

        lignes = LigneCommande.objects.filter(id_commande=commande)

        # If ALL lines are already cancelled, reject
        if lignes.exists() and all(l.statut == "annulee" for l in lignes):
            return Response({"error": "Déjà annulée"}, status=400)

        vendeurs = set()
        for ligne in lignes:
            if ligne.statut != "annulee":
                ligne.statut = "annulee"
                ligne.save()
                produit = ligne.id_produit
                produit.quantite_stock += ligne.quantite
                produit.save()
            vendeurs.add(ligne.id_vendeur)

        for vendeur in vendeurs:
            Notification.objects.create(
                user=vendeur,
                titre="Commande annulée",
                message=f"Commande #{commande.numero_commande} annulée par le client"
            )

        return Response({"message": "Commande annulée"})

    @action(detail=False, methods=["get"], url_path="vendeur", permission_classes=[IsAuthenticated])
    def commandes_vendeur(self, request):
        user = request.user

        if user.type_user != "vendeur":
            return Response({"error": "Unauthorized"}, status=403)

        # Exclude lines soft-deleted by this vendor
        qs = LigneCommande.objects.filter(
            id_vendeur=user,
            is_deleted_by_vendor=False,
        ).select_related("id_commande", "id_produit")

        if request.query_params.get("limit"):
            qs = qs[:10]

        commandes_map = {}

        for ligne in qs:
            cmd = ligne.id_commande

            if cmd.id not in commandes_map:
                commandes_map[cmd.id] = {
                    "id": cmd.id,
                    "numero_commande": cmd.numero_commande,
                    "nom": cmd.nom,
                    "email": cmd.email,
                    "telephone": cmd.telephone,
                    "adresse_livraison": cmd.adresse_livraison,
                    "statut": ligne.statut,
                    "created_at": cmd.created_at,
                    "total": 0,
                    "lignes": [],
                    "frais_livraison":cmd.frais_livraison
                }

            commandes_map[cmd.id]["total"] += ligne.sous_total

            commandes_map[cmd.id]["lignes"].append({
                "id": ligne.id,
                "produit_nom": ligne.id_produit.nom,
                "produit_url": ligne.id_produit.url,
                "quantite": ligne.quantite,
                "prix_unitaire": ligne.prix_unitaire,
                "sous_total": ligne.sous_total,
                "statut": ligne.statut,
            })

        return Response(list(commandes_map.values()))

    @action(detail=True, methods=["patch"], url_path="delete_for_vendor", permission_classes=[IsAuthenticated])
    def delete_for_vendor(self, request, pk=None):
        """Soft-delete: hide this order from the vendor's view (keep for revenue)."""
        commande = self.get_object()
        user = request.user

        if user.type_user != "vendeur":
            return Response({"error": "Unauthorized"}, status=403)

        lignes = LigneCommande.objects.filter(id_commande=commande, id_vendeur=user)

        # Only allow soft-delete for terminal lines (annulee or collectee/livree)
        non_terminal = lignes.exclude(statut__in=["annulee", "livree", "collectee"])
        if non_terminal.exists():
            return Response(
                {"error": "Seules les commandes annulées ou terminées peuvent être supprimées."},
                status=400
            )

        lignes.update(is_deleted_by_vendor=True)
        return Response({"message": "Commande masquée pour le vendeur."})
    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated])
    def delete_for_client(self, request, pk=None):
        commande = self.get_object()

        if commande.id_client != request.user:
            return Response({"error": "Unauthorized"}, status=403)

        commande.is_deleted_by_client = True
        commande.save()

        return Response({"message": "Commande masquée pour le client"})

class LigneCommandeViewSet(viewsets.ModelViewSet):
    queryset = LigneCommande.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.type_user == "vendeur":
            return LigneCommande.objects.filter(id_vendeur=user)

        return LigneCommande.objects.none()

    def update(self, request, *args, **kwargs):
        ligne = self.get_object()

        # 🔒 Only the owning vendor can modify their line
        if ligne.id_vendeur != request.user:
            return Response({"error": "Unauthorized"}, status=403)

        new_status = request.data.get("statut")

        # 🚫 A cancelled line cannot be changed anymore
        if ligne.statut == "annulee":
            return Response(
                {"error": "Cette ligne a été annulée et ne peut plus être modifiée."},
                status=400
            )

        # 📦 If vendor cancels a line, restore the product stock
        if new_status == "annulee" and ligne.statut != "annulee":
            produit = ligne.id_produit
            produit.quantite_stock += ligne.quantite
            produit.save()

        ligne.statut = new_status

        # Also update tracking number if provided
        if "numero_suivi" in request.data:
            ligne.numero_suivi = request.data["numero_suivi"]

        # Notify the client
        if ligne.id_commande.id_client:
            Notification.objects.create(
                user=ligne.id_commande.id_client,
                titre="Mise à jour de votre commande",
                message=f"La commande #{ligne.id_commande.numero_commande} a été mise à jour : {new_status}"
            )

        ligne.save()
        return Response({"message": "Status updated"})

class FavoriViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favori.objects.filter(user=self.request.user)
    @action(detail=False, methods=["POST"])
    def toggle(self, request):
        user = request.user
        produit_id = request.data.get("id_produit")

        if not produit_id:
            return Response({"error": "Produit manquant"}, status=400)

        favori = Favori.objects.filter(user=user, id_produit_id=produit_id).first()

        if favori:
            favori.delete()
            return Response({"message": "Retiré des favoris", "favori": False})

        Favori.objects.create(user=user, id_produit_id=produit_id)
        return Response({"message": "Ajouté aux favoris", "favori": True})

    @action(detail=False, methods=["GET"])
    def ids(self, request):
        ids = Favori.objects.filter(user=request.user).values_list("id_produit_id", flat=True)
        return Response(list(ids))

class AvisViewSet(viewsets.ModelViewSet):
    serializer_class = AvisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Avis.objects.select_related(
            "id_ligne_commande__id_produit",
            "id_ligne_commande__id_commande__id_client"
        )

        produit_id = self.request.query_params.get("produit")

        if produit_id:
            queryset = queryset.filter(
                id_ligne_commande__id_produit_id=produit_id
            )

        return queryset.order_by("-created_at")

    def create(self, request):
        ligne_id = request.data.get("ligne_commande")
        note = request.data.get("note")
        commentaire = request.data.get("commentaire")

        ligne = get_object_or_404(
            LigneCommande,
            id=ligne_id,
            id_commande__id_client=request.user  # 🔥 حماية
        )

        # ❌ منع duplicate review
        if Avis.objects.filter(id_ligne_commande=ligne).exists():
            return Response({"error": "Review already exists"}, status=400)

        avis = Avis.objects.create(
            id_ligne_commande=ligne,
            note=note,
            commentaire=commentaire
        )

        return Response(AvisSerializer(avis).data, status=201)

    @action(detail=False, methods=["GET"])
    def stats(self, request):
        produit_id = request.query_params.get("produit")

        avg = Avis.objects.filter(
            id_ligne_commande__id_produit_id=produit_id
        ).aggregate(avg=Avg("note"))

        return Response({
            "average": avg["avg"] or 0
        })

from datetime import timedelta
from django.utils import timezone

class VendorDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["GET"])
    def stats(self, request):
        user = request.user
        if user.type_user != "vendeur":
            return Response({"error": "Unauthorized"}, status=403)

        # Total products
        total_products = Produit.objects.filter(id_vendeur=user).count()

        # Commande lines for this vendor
        lignes = LigneCommande.objects.filter(id_vendeur=user)
        
        # Calculate revenue — only from completed (livree / collectee) lines
        revenue = lignes.filter(statut__in=["livree", "collectee"]).aggregate(total=Sum("sous_total"))["total"] or 0

        # Unique orders for this vendor (all, including soft-deleted — for totals)
        total_orders = lignes.values("id_commande").distinct().count()

        # Pending orders (lines still en_attente, not soft-deleted)
        pending_orders = lignes.filter(statut="en_attente", is_deleted_by_vendor=False).values("id_commande").distinct().count()

        return Response({
            "total_products": total_products,
            "revenue": revenue,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
        })

    @action(detail=False, methods=["GET"])
    def chart(self, request):
        user = request.user
        if user.type_user != "vendeur":
            return Response({"error": "Unauthorized"}, status=403)
            
        period = request.query_params.get("period", "30") # 7, 30, year
        now = timezone.now()
        
        if period == "year":
            start_date = now - timedelta(days=365)
        elif period == "7":
            start_date = now - timedelta(days=7)
        else:
            start_date = now - timedelta(days=30)
            
        # Only count completed (livree / collectee) lines for sales evolution
        lignes = LigneCommande.objects.filter(
            id_vendeur=user,
            id_commande__created_at__gte=start_date,
            statut__in=["livree", "collectee"]
        )
        
        data = []
        # Grouping by day
        from django.db.models.functions import TruncDate
        sales_per_day = lignes.annotate(date=TruncDate('id_commande__created_at')).values('date').annotate(
            daily_revenue=Sum('sous_total')
        ).order_by('date')
        
        for sale in sales_per_day:
            data.append({
                "date": sale['date'].strftime("%Y-%m-%d"),
                "revenue": float(sale['daily_revenue'] or 0)
            })
            
        return Response(data)

    @action(detail=False, methods=["GET"])
    def orders(self, request):
        user = request.user
        if user.type_user != "vendeur":
            return Response({"error": "Unauthorized"}, status=403)
        
        # Get unique Commande IDs that have products from this vendor
        commande_ids = LigneCommande.objects.filter(id_vendeur=user).values_list("id_commande", flat=True).distinct()
        
        commandes = Commande.objects.filter(id__in=commande_ids).prefetch_related("lignes__id_produit")
        
        data = []
        for cmd in commandes:
            # Filter lines to only include this vendor's products
            v_lignes = cmd.lignes.filter(id_vendeur=user)
            if not v_lignes.exists():
                continue
            
            # Calculate total for THIS vendor from this order
            total_vendeur = sum(l.sous_total for l in v_lignes)
            
            data.append({
                "id": f"#ORD-{cmd.id}",
                "raw_id": cmd.id,
                "customer": {
                    "name": cmd.nom,
                    "initials": "".join([part[0] for part in cmd.nom.split() if part]).upper()[:2] if cmd.nom else "C",
                    "email": cmd.email,
                    "phone": cmd.telephone,
                },
                "products": [l.id_produit.url for l in v_lignes if l.id_produit.url][:3],
                "extra": max(0, v_lignes.count() - 3),
                "total": f"{total_vendeur.normalize() if isinstance(total_vendeur, __import__('decimal').Decimal) else total_vendeur} دج",
                "status": "Pending" if v_lignes.first().statut in ["en_attente", "en attente"] else "Validated" if v_lignes.first().statut == "confirmee" else "Shipped" if v_lignes.first().statut == "expediee" else "Delivered" if v_lignes.first().statut == "livree" else "Pending",
                "created_at": cmd.created_at.strftime("%b %d, %Y")
            })
            
        return Response(data)
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

    @action(detail=True, methods=["patch"])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.lu = True
        notif.save()
        return Response({"status": "ok"})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, lu=False).update(lu=True)
        return Response({"status": "ok"})
    @action(detail=False, methods=["delete"])
    def delete_all(self, request):
        Notification.objects.filter(user=request.user).delete()
        return Response({"status": "ok"})
    
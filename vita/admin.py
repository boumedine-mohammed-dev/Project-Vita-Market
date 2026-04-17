from django.contrib import admin
from .models import (User,ProfilClient,ProfilVendeur,Categorie,Produit,Panier,LignePanier,Commande,LigneCommande,Avis,Favori)
# Register your models here.
admin.site.register(User)
admin.site.register(ProfilClient)
admin.site.register(ProfilVendeur)
admin.site.register(Categorie)
admin.site.register(Produit)
admin.site.register(Panier)
admin.site.register(LignePanier)
admin.site.register(Commande)
admin.site.register(LigneCommande)
admin.site.register(Avis)
admin.site.register(Favori)
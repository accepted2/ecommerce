from django.contrib import admin
from .models import Products, Order


admin.site.site_header = "E-commerce Site"
admin.site.site_title = "ADC Shopping"
admin.site.index_title = "Manage ABC Shopping"


class ProductADmin(admin.ModelAdmin):
    def change_category_to_default(self, request, queryset):
        queryset.update(category="default")

    change_category_to_default.short_description = "Default Category"

    list_display = ("title", "price", "category", "image")
    search_fields = ("title", "category", "price")
    actions = [
        "change_category_to_default",
    ]
    list_editable = ["price"]


# Register your models here.
admin.site.register(Products, ProductADmin)
admin.site.register(Order)

import json
from django.shortcuts import render
from .models import Products, Order
from django.core.paginator import Paginator

# Create your views here.


def index(request):
    products = Products.objects.all().order_by("id")

    # search code
    item_name = request.GET.get("item_name")
    if item_name != "" and item_name is not None:
        products = products.filter(title__icontains=item_name)

    # paginator code
    paginator = Paginator(products, 6)
    page = request.GET.get("page")
    products_page = paginator.get_page(page)
    return render(
        request, "shop/index.html", {"products": products_page, "paginator": paginator}
    )


def detail(request, pk):

    product = Products.objects.get(id=pk)
    return render(request, "shop/detail_page.html", {"product": product})


def checkout(request):

    if request.method == "POST":
        items = request.POST.get("items", {})

        items = json.loads(items)
        name = request.POST.get("name", "")
        email = request.POST.get("email", "")
        address = request.POST.get("address", "")
        products_ids = list(items.keys())
        products = Products.objects.filter(id__in=products_ids)
        total = request.POST.get("totalQuantity")
        print(total)
        items_with_keys = {}
        for product in products:
            items_with_keys[product.title] = items[str(product.id)]

        order = Order(
            name=name,
            email=email,
            address=address,
            items=json.dumps(items_with_keys),
            total=total,
        )

        order.save()
    return render(
        request,
        "shop/checkout.html",
    )

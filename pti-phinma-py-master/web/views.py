import json
import requests
from django.contrib import messages
from django.shortcuts import HttpResponse, render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from .adapter import PaynamicsAdapter
from .forms import BillingInfoForm

CHANNELS = {
    "dp_ph": "Dragon Pay",
    "cliqq_ph": "711 Cliqq Network",
    "711_ph": "711",
    "mlhuillier_ph": "Mlhuillier Pawnshop",
    "cebuana_ph": "Cebuana Pawnshop",
    "da5_ph": "Direct Agent 5",
    "smbills_ph": "SM Bills Payment",
    "truemoney_ph": "True Money",
    "posible_ph": "Possible.net",
    "expresspay_ph": "ExpressPay",
    "etap_ph": "Etap",
}


# Create your views here.
def index(request):
    form = BillingInfoForm()

    if request.method == "POST":
        form = BillingInfoForm(request.POST)
        if _validate_captcha(request).get("success"):

            if form.is_valid():
                paynamics = PaynamicsAdapter()
                data = form.cleaned_data
                print(data)
                if data["payment_particular"] == "Rental":
                    data[
                        "payment_particular_type"
                    ] = f"{data['rental_month']} {data['rental_year']}"

                if data.get("rental_count") == 1:
                    data[
                        "payment_particular_type"
                    ] = f"{data['rental_month']} {data['rental_year']} (Php{data['rental_amount']}) | {data['rental2_month']} {data['rental2_year']} (Php{data['rental2_amount']})"

                if data.get("rental_count") == 2:
                    data[
                        "payment_particular_type"
                    ] = f"{data['rental_month']} {data['rental_year']} (Php{data['rental_amount']}) | {data['rental2_month']} {data['rental2_year']} (Php{data['rental2_amount']}) | {data['rental3_month']} {data['rental3_year']} (Php{data['rental3_amount']})"

                if data.get("rental_count") == 3:
                    data[
                        "payment_particular_type"
                    ] = f"{data['rental_month']} {data['rental_year']} (Php{data['rental_amount']}) | {data['rental2_month']} {data['rental2_year']} (Php{data['rental2_amount']}) | {data['rental3_month']} {data['rental3_year']} (Php{data['rental3_amount']}) | {data['rental4_month']} {data['rental4_year']} (Php{data['rental4_amount']})"

                    if data.get("rental_count") == 4:
                        data[
                            "payment_particular_type"
                        ] = f"{data['rental_month']} {data['rental_year']} (Php{data['rental_amount']}) | {data['rental2_month']} {data['rental2_year']} (Php{data['rental2_amount']}) | {data['rental3_month']} {data['rental3_year']} (Php{data['rental3_amount']}) | {data['rental4_month']} {data['rental4_year']} (Php{data['rental4_amount']}) | {data['rental5_month']} {data['rental5_year']} (Php{data['rental5_amount']})"

                result = paynamics.make_payment(data)
                print(json.dumps(result, indent=2))
                print(result.get("payment_action_info"))
                if result.get("payment_action_info", None):
                    return redirect(result.get("payment_action_info"))

                ctx = {"channel": CHANNELS[data["pchannel"]], "result": result}
                return render(
                    request, template_name="web/instructions.html", context=ctx
                )

            else:
                print(form.errors)
        else:
            messages.error(request, "Invalid Captcha")

    ctx = {
        "form": form,
        "site_key": settings.CAPTCHA_SITE_KEY,
    }
    return render(request, template_name="web/index.html", context=ctx)


@csrf_exempt
def paynamics_notification(request):
    print(request.POST)
    return HttpResponse(request.POST)


def paynamics_response(request):
    print(request.POST)
    return render(request, template_name="web/response.html")


def paynamics_cancel(request):
    print(request.POST)
    return render(request, template_name="web/cancel.html")


def _validate_captcha(request):
    endpoint = " https://www.google.com/recaptcha/api/siteverify"
    payload = {
        "secret": settings.CAPTCHA_SECRET_KEY,
        "response": request.POST.get("g-recaptcha-response"),
    }
    print(payload)
    resp = requests.post(
        endpoint,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"},
    )
    return resp.json()

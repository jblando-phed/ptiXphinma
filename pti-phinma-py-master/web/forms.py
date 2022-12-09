from datetime import datetime
from django.core.exceptions import ValidationError

from django import forms


class BillingInfoForm(forms.Form):
    campus = forms.CharField()
    student_number = forms.CharField()
    # school_year = forms.CharField()
    fname = forms.CharField()
    lname = forms.CharField()
    mname = forms.CharField()
    email = forms.EmailField()
    mobile = forms.RegexField(regex='^(09)\\d{9}$')

    parent_name = forms.CharField()
    parent_email = forms.CharField()
    parent_mobile = forms.RegexField(regex='^(09)\\d{9}$')
    parent_address1 = forms.CharField()
    parent_address2 = forms.CharField(required=False)
    parent_city = forms.CharField()
    parent_region = forms.CharField()
    parent_country = forms.CharField()
    parent_zip = forms.CharField()

    payment_particular = forms.CharField()
    payment_particular_type = forms.CharField(required=False)
    payment_particular_type_other = forms.CharField(required=False)
    payment_amount = forms.DecimalField(required=False)

    rental_month = forms.CharField(required=False)
    rental_year = forms.CharField(required=False)
    rental_amount = forms.DecimalField(required=False)

    rental_count = forms.BooleanField(required=False)

    rental2_month = forms.CharField(required=False)
    rental2_year = forms.CharField(required=False)
    rental2_amount = forms.DecimalField(required=False)

    rental3_month = forms.CharField(required=False)
    rental3_year = forms.CharField(required=False)
    rental3_amount = forms.DecimalField(required=False)

    rental4_month = forms.CharField(required=False)
    rental4_year = forms.CharField(required=False)
    rental4_amount = forms.DecimalField(required=False)

    rental5_month = forms.CharField(required=False)
    rental5_year = forms.CharField(required=False)
    rental5_amount = forms.DecimalField(required=False)

    pmethod = forms.CharField()
    pchannel = forms.CharField()
    total_payment = forms.DecimalField()

    def clean(self):
        data = super().clean()
        if data.get("rental_count") >= 1:
            rental2_month = data.get("rental2_month")
            rental2_year = data.get("rental2_year")
            if not rental2_month or not rental2_year:
                raise ValidationError(
                    "Rental2 month and year are required fields"
                )

        if data.get("rental_count") >= 2:
            rental3_month = data.get("rental3_month")
            rental3_year = data.get("rental3_year")
            if not rental3_month or not rental3_year:
                raise ValidationError(
                    "Rental4 month and year are required fields"
                )

        if data.get("rental_count") >= 3:
            rental4_month = data.get("rental4_month")
            rental4_year = data.get("rental4_year")
            if not rental4_month or not rental4_year:
                raise ValidationError(
                    "Rental4 month and year are required fields"
                )

        if data.get("rental_count") >= 4:
            rental5_month = data.get("rental5_month")
            rental5_year = data.get("rental5_year")
            if not rental5_month or not rental5_year:
                raise ValidationError(
                    "Rental5 month and year are required fields"
                )

        if data.get("payment_particular") != "Rental":
            if not data.get("payment_particular_type"):
                raise ValidationError(
                    "Please select type of payment."
                )

        return data

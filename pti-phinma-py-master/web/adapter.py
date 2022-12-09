import hashlib
import json
import random
import string
import uuid

import requests
from django.conf import settings
from requests.auth import HTTPBasicAuth


class PaynamicsException(Exception):
    pass


class PaynamicsAdapter:
    BASE_URL = settings.PAYNAMICS_WORKFLOW_URL
    MERCHANT_ID = settings.PAYNAMICS_MERCHANT_ID
    MERCHANT_KEY = settings.PAYNAMICS_MERCHANT_KEY
    USERNAME = settings.PAYNAMICS_AUTH_USERNAME
    PASSWORD = settings.PAYNAMICS_AUTH_PASSWORD
    NOTIFICATION_URL = settings.APP_URL + "notification/"
    RESPONSE_URL = settings.APP_URL + "response/"
    CANCEL_URL = settings.APP_URL + "cancel/"

    PAYMENT_DESCRIPTOR = "PHINMA_WF_MIGS_PHP"

    def sign(self, for_sign: str):
        return hashlib.sha512(for_sign.encode("utf-8")).hexdigest()

    def for_sign_transaction(self, data: dict) -> str:
        return (
            self.MERCHANT_ID
            + data["request_id"]
            + self.NOTIFICATION_URL
            + self.RESPONSE_URL
            + self.CANCEL_URL
            + data["pmethod"]
            + data["payment_action"]
            + data["collection_method"]
            + data["amount"]
            + data["currency"]
            + self.PAYMENT_DESCRIPTOR
            + data["payment_notification_status"]
            + data["payment_notification_channel"]
            + self.MERCHANT_KEY
        )

    def for_sign_customer(self, data: dict) -> str:
        return (
            data["fname"]
            + data["lname"]
            + data["mname"]
            + data["email"]
            + data["mobile"]
            + self.MERCHANT_KEY
        )

    def for_sign_response(self, data: dict) -> str:
        return (
            self.MERCHANT_ID
            + data["request_id"]
            + data["response_id"]
            + data["gateway_id"]
            + data["response_code"]
            + data["response_message"]
            + data["response_advise"]
            + data["timestamp"]
            + data["processor_response_id"]
            + data["processor_response_authcode"]
            + data["pay_reference"]
            + self.MERCHANT_KEY
        )

    def response_valid(self, data: dict) -> bool:
        return data["signature"] == self.sign(self.for_sign_response(data))

    @staticmethod
    def generate_reference():
        return (
            "PHN"
            + "".join(random.choice(string.ascii_uppercase) for _ in range(3))
            + str(random.randint(0, 999)).zfill(3)
        )

    @staticmethod
    def generate_id():
        return (
            "PHN"
            + "".join(random.choice(string.ascii_uppercase) for _ in range(5))
            + str(random.randint(0, 99999)).zfill(5)
        )

    def make_payment(self, data: dict):
        request_id = self.generate_id()
        pay_reference = self.generate_reference()
        data["request_id"] = request_id
        # data["pmethod"] = "onlinebanktransfer"
        # data["pchannel"] = "bpi_ph"
        data["payment_action"] = "url_link"
        data["collection_method"] = "single_pay"
        data["currency"] = "PHP"
        data["payment_notification_status"] = "1"
        data["payment_notification_channel"] = "3"
        data["payment_particular_type"] = (
            "-"
            if data["payment_particular_type"] == ""
            else data["payment_particular_type"]
        )
        data[
            "payment_description"
        ] = f"{data['payment_particular']} - {data['payment_particular_type']}"
        data["amount"] = "{:.2f}".format(data["total_payment"])

        payload = {
            "transaction": {
                "merchant_id": self.MERCHANT_ID,
                "request_id": data["request_id"],
                "notification_url": self.NOTIFICATION_URL,
                "response_url": self.RESPONSE_URL,
                "cancel_url": self.CANCEL_URL,
                "user_token": "",
                "pmethod": data["pmethod"],
                "pchannel": data["pchannel"],
                "payment_action": data["payment_action"],
                "collection_method": data["collection_method"],
                "pay_reference": pay_reference,
                "payment_notification_status": data["payment_notification_status"],
                "payment_notification_channel": data["payment_notification_channel"],
                "amount": data["amount"],
                "currency": data["currency"],
                "descriptor_note": self.PAYMENT_DESCRIPTOR,
                "signature": self.sign(self.for_sign_transaction(data)),
            },
            "customer_info": {
                "fname": data["fname"],
                "lname": data["lname"],
                "mname": data["mname"],
                "email": data["email"],
                "phone": "",
                "mobile": data["mobile"],
                "dob": "",
                "signature": self.sign(self.for_sign_customer(data)),
            },
            "billing_info": {
                "billing_address1": data["parent_address1"],
                "billing_address2": data["parent_address2"],
                "billing_city": data["parent_city"],
                "billing_state": data["parent_region"],
                "billing_country": data["parent_country"],
                "billing_zip": data["parent_zip"],
            },
            "order_details": {
                "orders": [
                    {
                        "itemname": data["payment_description"]
                        + " - "
                        + data["student_number"],
                        "quantity": "1",
                        "unitprice": data["amount"],
                        "totalprice": data["amount"],
                    }
                ],
                "subtotalprice": data["amount"],
                "shippingprice": "0",
                "discountamount": "0",
                "totalorderamount": data["amount"],
            },
            "custom_merchant_params": [
                {
                    "system_id": f"{request_id}-1",
                    "field": "campus",
                    "label": "Campus",
                    "value": data["campus"],
                },
                {
                    "system_id": f"{request_id}-2",
                    "field": "student_number",
                    "label": "Student Number",
                    "value": data["student_number"],
                },
                {
                    "system_id": f"{request_id}-3",
                    "field": "school_year",
                    "label": "School Year",
                    "value": "-",
                },
                {
                    "system_id": f"{request_id}-4",
                    "field": "parent_name",
                    "label": "Parent Name",
                    "value": data["parent_name"],
                },
                {
                    "system_id": f"{request_id}-5",
                    "field": "parent_email",
                    "label": "Parent Email",
                    "value": data["parent_email"],
                },
                {
                    "system_id": f"{request_id}-6",
                    "field": "parent_mobile",
                    "label": "Parent Mobile",
                    "value": data["parent_mobile"],
                },
                {
                    "system_id": f"{request_id}-7",
                    "field": "parent_addressA",
                    "label": "Parent Address A",
                    "value": data["parent_address1"],
                },
                {
                    "system_id": f"{request_id}-8",
                    "field": "parent_addressB",
                    "label": "Parent Address B",
                    "value": "-"
                    if data["parent_address2"] == ""
                    else data["parent_address2"],
                },
                {
                    "system_id": f"{request_id}-9",
                    "field": "parent_city",
                    "label": "Parent City",
                    "value": data["parent_city"],
                },
                {
                    "system_id": f"{request_id}-10",
                    "field": "parent_region",
                    "label": "Parent Region",
                    "value": data["parent_region"],
                },
                {
                    "system_id": f"{request_id}-11",
                    "field": "parent_country",
                    "label": "Parent County",
                    "value": data["parent_country"],
                },
                {
                    "system_id": f"{request_id}-12",
                    "field": "parent_zip",
                    "label": "Parent Zip",
                    "value": data["parent_zip"],
                },
                {
                    "system_id": f"{request_id}-13",
                    "field": "payment_particular",
                    "label": "Payment Particular",
                    "value": data["payment_particular"],
                },
                {
                    "system_id": f"{request_id}-14",
                    "field": "payment_particular_type",
                    "label": "Payment Particular Description",
                    "value": data["payment_particular_type"],
                },
            ],
        }

        endpoint = self.BASE_URL
        headers = {"Content-Type": "application/json"}

        # print(endpoint)
        print(json.dumps(payload, indent=2))

        response = requests.post(
            endpoint,
            data=json.dumps(payload),
            headers=headers,
            auth=HTTPBasicAuth(self.USERNAME, self.PASSWORD),
        )

        # print(response.request.headers)
        print(response.status_code, response.reason)
        print(response.text)
        if response.status_code != 200:
            raise PaynamicsException(
                f"Returned {response.status_code} {response.reason}: {response.text}"
            )

        return response.json()

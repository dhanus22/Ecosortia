from .models import CreditTransaction
from django.contrib.auth import get_user_model

User = get_user_model()

def add_credits(user, points, reason="waste cleaned"):
    user.credits += points
    user.save(update_fields=["credits"])

    CreditTransaction.objects.create(user=user, points=points, reason=reason)

def calculate_credits(waste_type):
    credit_map = {
        "Plastic": 10,
        "Organic": 8,
        "Paper": 5,
        "Glass": 12,
        "Metal": 15,
        "Electronic": 25,
        "Construction": 20,
        "Medical": 20,
        "Mixed": 10,
        "Other": 5,
    }

    return credit_map.get(waste_type, 5)
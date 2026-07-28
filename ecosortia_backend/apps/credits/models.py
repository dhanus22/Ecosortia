from django.db import models
from django.conf import settings

# Create your models here.
User = settings.AUTH_USER_MODEL

class CreditTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="credit_transactions")
    points = models.PositiveIntegerField()
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.points}"


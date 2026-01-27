from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='orders',
        limit_choices_to={'user_type': 'consumer'},
        verbose_name=_('Consumer')
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name=_('Total (KES)'), default=0
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivery_address = models.TextField(verbose_name=_('Delivery Address'))
    order_notes = models.TextField(blank=True, verbose_name=_('Order Notes'))
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [models.Index(fields=['user', 'status', 'created_at'])]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.username} ({self.status})"

    def update_total_amount(self):
        """Calculate total_amount from related OrderItems"""
        total = sum(item.get_subtotal() for item in self.items.all())
        self.total_amount = total
        return total

    def save(self, *args, **kwargs):
        """Ensure total_amount is always updated before saving"""
        # If instance already exists, recalc total_amount from items
        if self.pk:
            self.update_total_amount()
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Line items within an Order - captures price snapshot"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        indexes = [models.Index(fields=['order', 'product'])]
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
    
    def get_subtotal(self):
        return self.quantity * self.price_at_purchase

    def save(self, *args, **kwargs):
        """Update order total when an item is saved"""
        super().save(*args, **kwargs)
        self.order.update_total_amount()
        self.order.save(update_fields=['total_amount'])


class CartItem(models.Model):
    """Consumer's temporary shopping cart"""
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='cart_items',
        limit_choices_to={'user_type': 'consumer'}
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'product'], name='unique_cart_item')
        ]
        indexes = [models.Index(fields=['user', 'product'])]
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.quantity}x {self.product.name}"
    
    def get_subtotal(self):
        return self.product.price * self.quantity

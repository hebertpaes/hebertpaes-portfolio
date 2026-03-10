from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        EDITOR = 'editor', 'Editor'
        AUTHOR = 'author', 'Author'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.AUTHOR)

    class Meta:
        db_table = 'platform_users'


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_categories'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_tags'
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True)
    excerpt = models.TextField(blank=True, null=True)
    content = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    author = models.ForeignKey(User, on_delete=models.PROTECT, related_name='posts')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name='posts',
        null=True,
        blank=True,
    )
    tags = models.ManyToManyField(Tag, through='PostTag', related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_posts'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.title


class PostTag(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        db_table = 'platform_post_tags'
        unique_together = ('post', 'tag')


class MediaAsset(models.Model):
    title = models.CharField(max_length=255)
    file_url = models.URLField(max_length=1024)
    asset_type = models.CharField(max_length=50, default='image')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='media_assets',
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_media_assets'


class SiteSetting(models.Model):
    key = models.CharField(max_length=120, unique=True)
    value = models.JSONField(default=dict)
    description = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'platform_site_settings'
        ordering = ['key']

    def __str__(self) -> str:
        return self.key

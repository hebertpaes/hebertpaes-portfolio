from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from cms.models import Category, MediaAsset, Post, PostTag, SiteSetting, Tag, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('role',)}),)
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'updated_at')
    search_fields = ('name', 'slug')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'updated_at')
    search_fields = ('name', 'slug')


class PostTagInline(admin.TabularInline):
    model = PostTag
    extra = 1


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'author', 'category', 'updated_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'slug', 'content')
    inlines = [PostTagInline]


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ('title', 'asset_type', 'uploaded_by', 'updated_at')
    search_fields = ('title', 'file_url')


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'updated_at')
    search_fields = ('key',)

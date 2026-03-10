from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class TagBase(BaseModel):
    name: str
    slug: str


class TagCreate(TagBase):
    pass


class TagRead(TagBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PostBase(BaseModel):
    title: str
    slug: str
    excerpt: str | None = None
    content: str
    status: str = 'draft'
    author_id: int
    category_id: int | None = None
    tag_ids: list[int] = Field(default_factory=list)


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    status: str | None = None
    author_id: int | None = None
    category_id: int | None = None
    tag_ids: list[int] | None = None


class PostRead(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str | None
    content: str
    status: str
    author_id: int
    category_id: int | None
    created_at: datetime
    updated_at: datetime
    tag_ids: list[int]
    model_config = ConfigDict(from_attributes=True)


class MediaAssetBase(BaseModel):
    title: str
    file_url: str
    asset_type: str = 'image'
    alt_text: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    uploaded_by_id: int | None = None


class MediaAssetCreate(MediaAssetBase):
    pass


class MediaAssetRead(MediaAssetBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    username: str
    email: str | None = None
    role: str = 'author'


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    is_active: bool
    is_staff: bool
    model_config = ConfigDict(from_attributes=True)


class SiteSettingBase(BaseModel):
    key: str
    value: dict[str, Any]
    description: str | None = None


class SiteSettingUpsert(SiteSettingBase):
    pass


class SiteSettingRead(SiteSettingBase):
    id: int
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

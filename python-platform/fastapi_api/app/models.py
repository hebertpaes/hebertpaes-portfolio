from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from shared.database import Base

post_tags = Table(
    'platform_post_tags',
    Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('post_id', ForeignKey('platform_posts.id', ondelete='CASCADE'), nullable=False),
    Column('tag_id', ForeignKey('platform_tags.id', ondelete='CASCADE'), nullable=False),
)


class User(Base):
    __tablename__ = 'platform_users'

    id = Column(Integer, primary_key=True, index=True)
    password = Column(String(128), nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    is_superuser = Column(Boolean, default=False, nullable=False)
    username = Column(String(150), unique=True, nullable=False)
    first_name = Column(String(150), default='', nullable=False)
    last_name = Column(String(150), default='', nullable=False)
    email = Column(String(254), default='', nullable=False)
    is_staff = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    date_joined = Column(DateTime(timezone=True), nullable=False)
    role = Column(String(20), default='author', nullable=False)


class Category(Base):
    __tablename__ = 'platform_categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False)
    slug = Column(String(140), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Tag(Base):
    __tablename__ = 'platform_tags'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class Post(Base):
    __tablename__ = 'platform_posts'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(280), unique=True, nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    status = Column(String(20), default='draft', nullable=False)
    author_id = Column(Integer, ForeignKey('platform_users.id', ondelete='RESTRICT'), nullable=False)
    category_id = Column(Integer, ForeignKey('platform_categories.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    tags = relationship('Tag', secondary=post_tags, lazy='selectin')


class MediaAsset(Base):
    __tablename__ = 'platform_media_assets'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    file_url = Column(String(1024), nullable=False)
    asset_type = Column(String(50), default='image', nullable=False)
    alt_text = Column(String(255), nullable=True)
    extra_metadata = Column('metadata', JSON, default=dict, nullable=False)
    uploaded_by_id = Column(Integer, ForeignKey('platform_users.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class SiteSetting(Base):
    __tablename__ = 'platform_site_settings'

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(120), unique=True, nullable=False)
    value = Column(JSON, default=dict, nullable=False)
    description = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

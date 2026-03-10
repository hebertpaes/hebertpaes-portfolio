from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from shared.schemas import (
    CategoryCreate,
    CategoryRead,
    MediaAssetCreate,
    MediaAssetRead,
    PostCreate,
    PostRead,
    PostUpdate,
    SiteSettingRead,
    SiteSettingUpsert,
    TagCreate,
    TagRead,
    UserCreate,
    UserRead,
)

from .deps import get_db_session, require_bearer_token
from .models import Category, MediaAsset, Post, SiteSetting, Tag, User

app = FastAPI(title='Hybrid Platform FastAPI', version='0.1.0')
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


@app.get('/health')
def health_check():
    return {'service': 'fastapi', 'status': 'ok'}


@app.get('/api/categories', response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db_session)):
    return db.scalars(select(Category).order_by(Category.name)).all()


@app.post('/api/categories', response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@app.put('/api/categories/{category_id}', response_model=CategoryRead)
def update_category(
    category_id: int,
    payload: CategoryCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail='Category not found')
    for field, value in payload.model_dump().items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category


@app.delete('/api/categories/{category_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    category = db.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail='Category not found')
    db.delete(category)
    db.commit()


@app.get('/api/tags', response_model=list[TagRead])
def list_tags(db: Session = Depends(get_db_session)):
    return db.scalars(select(Tag).order_by(Tag.name)).all()


@app.post('/api/tags', response_model=TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(
    payload: TagCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    tag = Tag(**payload.model_dump())
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


@app.put('/api/tags/{tag_id}', response_model=TagRead)
def update_tag(
    tag_id: int,
    payload: TagCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail='Tag not found')
    for field, value in payload.model_dump().items():
        setattr(tag, field, value)
    db.commit()
    db.refresh(tag)
    return tag


@app.delete('/api/tags/{tag_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail='Tag not found')
    db.delete(tag)
    db.commit()


@app.get('/api/posts', response_model=list[PostRead])
def list_posts(db: Session = Depends(get_db_session)):
    posts = db.scalars(select(Post).order_by(Post.created_at.desc())).all()
    return [
        PostRead(
            id=post.id,
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            content=post.content,
            status=post.status,
            author_id=post.author_id,
            category_id=post.category_id,
            created_at=post.created_at,
            updated_at=post.updated_at,
            tag_ids=[tag.id for tag in post.tags],
        )
        for post in posts
    ]


@app.post('/api/posts', response_model=PostRead, status_code=status.HTTP_201_CREATED)
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    post = Post(
        title=payload.title,
        slug=payload.slug,
        excerpt=payload.excerpt,
        content=payload.content,
        status=payload.status,
        author_id=payload.author_id,
        category_id=payload.category_id,
    )
    if payload.tag_ids:
        tags = db.scalars(select(Tag).where(Tag.id.in_(payload.tag_ids))).all()
        post.tags = list(tags)

    db.add(post)
    db.commit()
    db.refresh(post)
    return PostRead(
        id=post.id,
        title=post.title,
        slug=post.slug,
        excerpt=post.excerpt,
        content=post.content,
        status=post.status,
        author_id=post.author_id,
        category_id=post.category_id,
        created_at=post.created_at,
        updated_at=post.updated_at,
        tag_ids=[tag.id for tag in post.tags],
    )


@app.put('/api/posts/{post_id}', response_model=PostRead)
def update_post(
    post_id: int,
    payload: PostUpdate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')

    payload_data = payload.model_dump(exclude_none=True)
    tag_ids = payload_data.pop('tag_ids', None)
    for field, value in payload_data.items():
        setattr(post, field, value)

    if tag_ids is not None:
        tags = db.scalars(select(Tag).where(Tag.id.in_(tag_ids))).all()
        post.tags = list(tags)

    db.commit()
    db.refresh(post)
    return PostRead(
        id=post.id,
        title=post.title,
        slug=post.slug,
        excerpt=post.excerpt,
        content=post.content,
        status=post.status,
        author_id=post.author_id,
        category_id=post.category_id,
        created_at=post.created_at,
        updated_at=post.updated_at,
        tag_ids=[tag.id for tag in post.tags],
    )


@app.delete('/api/posts/{post_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail='Post not found')
    db.delete(post)
    db.commit()


@app.get('/api/media', response_model=list[MediaAssetRead])
def list_media(db: Session = Depends(get_db_session)):
    assets = db.scalars(select(MediaAsset).order_by(MediaAsset.created_at.desc())).all()
    return [
        MediaAssetRead(
            id=asset.id,
            title=asset.title,
            file_url=asset.file_url,
            asset_type=asset.asset_type,
            alt_text=asset.alt_text,
            metadata=asset.extra_metadata,
            uploaded_by_id=asset.uploaded_by_id,
            created_at=asset.created_at,
            updated_at=asset.updated_at,
        )
        for asset in assets
    ]


@app.post('/api/media', response_model=MediaAssetRead, status_code=status.HTTP_201_CREATED)
def create_media(
    payload: MediaAssetCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    payload_data = payload.model_dump()
    media = MediaAsset(
        title=payload_data['title'],
        file_url=payload_data['file_url'],
        asset_type=payload_data['asset_type'],
        alt_text=payload_data['alt_text'],
        extra_metadata=payload_data['metadata'],
        uploaded_by_id=payload_data['uploaded_by_id'],
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    return MediaAssetRead(
        id=media.id,
        title=media.title,
        file_url=media.file_url,
        asset_type=media.asset_type,
        alt_text=media.alt_text,
        metadata=media.extra_metadata,
        uploaded_by_id=media.uploaded_by_id,
        created_at=media.created_at,
        updated_at=media.updated_at,
    )


@app.put('/api/media/{media_id}', response_model=MediaAssetRead)
def update_media(
    media_id: int,
    payload: MediaAssetCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    media = db.get(MediaAsset, media_id)
    if not media:
        raise HTTPException(status_code=404, detail='Media asset not found')
    payload_data = payload.model_dump()
    media.title = payload_data['title']
    media.file_url = payload_data['file_url']
    media.asset_type = payload_data['asset_type']
    media.alt_text = payload_data['alt_text']
    media.extra_metadata = payload_data['metadata']
    media.uploaded_by_id = payload_data['uploaded_by_id']
    db.commit()
    db.refresh(media)
    return MediaAssetRead(
        id=media.id,
        title=media.title,
        file_url=media.file_url,
        asset_type=media.asset_type,
        alt_text=media.alt_text,
        metadata=media.extra_metadata,
        uploaded_by_id=media.uploaded_by_id,
        created_at=media.created_at,
        updated_at=media.updated_at,
    )


@app.delete('/api/media/{media_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    media = db.get(MediaAsset, media_id)
    if not media:
        raise HTTPException(status_code=404, detail='Media asset not found')
    db.delete(media)
    db.commit()


@app.get('/api/users', response_model=list[UserRead])
def list_users(
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    return db.scalars(select(User).order_by(User.id)).all()


@app.post('/api/users', response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    existing = db.scalars(select(User).where(User.username == payload.username)).first()
    if existing:
        raise HTTPException(status_code=409, detail='Username already exists')

    user = User(
        username=payload.username,
        email=payload.email or '',
        role=payload.role,
        is_active=True,
        is_staff=payload.role in {'admin', 'editor'},
        is_superuser=payload.role == 'admin',
        first_name='',
        last_name='',
        date_joined=datetime.now(timezone.utc),
        password=pwd_context.hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.put('/api/users/{user_id}', response_model=UserRead)
def update_user(
    user_id: int,
    payload: UserCreate,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    user.username = payload.username
    user.email = payload.email or ''
    user.role = payload.role
    user.is_staff = payload.role in {'admin', 'editor'}
    user.is_superuser = payload.role == 'admin'
    if payload.password:
        user.password = pwd_context.hash(payload.password)

    db.commit()
    db.refresh(user)
    return user


@app.delete('/api/users/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    db.delete(user)
    db.commit()


@app.get('/api/settings', response_model=list[SiteSettingRead])
def list_settings(
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    return db.scalars(select(SiteSetting).order_by(SiteSetting.key)).all()


@app.put('/api/settings/{key}', response_model=SiteSettingRead)
def upsert_setting(
    key: str,
    payload: SiteSettingUpsert,
    db: Session = Depends(get_db_session),
    _claims: dict = Depends(require_bearer_token),
):
    setting = db.scalars(select(SiteSetting).where(SiteSetting.key == key)).first()
    if setting is None:
        setting = SiteSetting(key=key, value=payload.value, description=payload.description)
        db.add(setting)
    else:
        setting.value = payload.value
        setting.description = payload.description

    db.commit()
    db.refresh(setting)
    return setting

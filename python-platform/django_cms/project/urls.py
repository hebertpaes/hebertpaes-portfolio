from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from cms.views_auth import SessionLoginView, SessionLogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/session/login/', SessionLoginView.as_view(), name='session-login'),
    path('auth/session/logout/', SessionLogoutView.as_view(), name='session-logout'),
    path('auth/jwt/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('cms.urls')),
]

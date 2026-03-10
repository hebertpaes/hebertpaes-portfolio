from django.http import JsonResponse
from django.urls import path


def cms_health(_request):
    return JsonResponse({'service': 'django-cms', 'status': 'ok'})


urlpatterns = [
    path('health/', cms_health, name='cms-health'),
]

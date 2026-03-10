from django.contrib.auth import authenticate, login, logout
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class SessionLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        return Response({'detail': 'Session authenticated'})


class SessionLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'detail': 'Session logged out'})

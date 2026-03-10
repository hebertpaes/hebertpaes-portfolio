from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from shared.database import get_db

bearer_scheme = HTTPBearer(auto_error=False)


def get_db_session(db=Depends(get_db)):
    return db


def require_bearer_token(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> dict:
    """
    Placeholder JWT hook.

    Replace this with real JWT verification (issuer, audience, exp, signature)
    once auth provider details are finalized.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Missing bearer token',
        )

    token = credentials.credentials
    if not token.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid bearer token',
        )

    return {'sub': 'placeholder-user', 'token': token}

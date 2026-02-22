# OpenClaw Integration Setup Guide

## Current Status

### Local Setup (Working)
- OpenClaw Gateway running on Mac: `127.0.0.1:18789`
- Azure VM Gateway running: `azureuser@74.235.188.0` (port 18789, localhost only)
- Chat interface created at `/openclaw/chat`

### Production Setup (Pending)

The chat interface is ready but requires public access to the OpenClaw Gateway.

## Architecture Options

### Option 1: Cloudflare Workers (Recommended)
**Pros:**
- No infrastructure changes needed
- Handles WebSocket proxying
- Easy to deploy
- Built-in SSL/TLS

**Steps:**
1. Create Cloudflare Worker
2. Configure route: `hebertpaes.com/openclaw/ws/*`
3. Proxy to Azure VM: `74.235.188.0:18789`
4. Set environment variable: `NEXT_PUBLIC_OPENCLAW_WS_URL=wss://hebertpaes.com/openclaw/ws`

### Option 2: Azure Application Gateway
**Pros:**
- Full control over routing
- Native Azure integration

**Cons:**
- More expensive
- More complex setup

### Option 3: Subdomain with Direct Connection
**Pros:**
- Simple setup
- Direct connection

**Cons:**
- Requires VM to handle SSL
- Exposes VM directly

## Environment Variables

Add to Azure Static Web App configuration:

```bash
NEXT_PUBLIC_OPENCLAW_WS_URL=wss://hebertpaes.com/openclaw/ws
NEXT_PUBLIC_OPENCLAW_TOKEN=<your-token-here>
```

## Security Considerations

1. **Token Authentication**: The gateway token should be kept secure
2. **Rate Limiting**: Implement rate limiting on the proxy
3. **CORS**: Configure appropriate CORS headers
4. **SSL/TLS**: Always use WSS (WebSocket Secure) in production

## Next Steps

1. Choose routing solution (recommend Cloudflare Workers)
2. Implement WebSocket proxy
3. Configure environment variables
4. Test end-to-end connection
5. Deploy to production

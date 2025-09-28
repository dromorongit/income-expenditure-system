# SSL/HTTPS Configuration Guide

This guide explains how to set up SSL certificates for your Income & Expenditure System Backend.

## 🔒 Why SSL is Important

- **Security**: Encrypts data between client and server
- **SEO**: Search engines favor HTTPS sites
- **Trust**: Users trust sites with SSL certificates
- **Compliance**: Required for production applications

## 📋 SSL Options

### Option 1: Let's Encrypt (Free, Recommended)

#### Prerequisites
- Domain name pointing to your server
- Port 80 accessible from the internet

#### Installation
```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# For multiple domains
sudo certbot certonly --standalone -d your-domain.com -d api.your-domain.com
```

#### Certificate Location
- **Certificate**: `/etc/letsencrypt/live/your-domain.com/fullchain.pem`
- **Private Key**: `/etc/letsencrypt/live/your-domain.com/privkey.pem`

#### Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto-renewal
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet
```

### Option 2: Self-Signed Certificate (Development)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Move to SSL directory
mkdir -p ssl
mv cert.pem ssl/
mv key.pem ssl/

# Update .env
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem
```

### Option 3: Commercial SSL Certificate

1. **Purchase SSL Certificate** from a CA (Comodo, DigiCert, etc.)
2. **Generate CSR** (Certificate Signing Request)
3. **Submit CSR** to CA and receive certificate files
4. **Install Certificate** files in your SSL directory

## ⚙️ Configuration

### Update .env file
```env
# SSL Configuration
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem

# Or for self-signed
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # SSL Session Cache
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Docker Configuration
```yaml
services:
  backend:
    environment:
      - SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
      - SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

## 🔍 Testing SSL Configuration

### Online SSL Checkers
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Qualys SSL Test**: https://www.ssllabs.com/ssltest/
- **DigiCert SSL Tool**: https://ssltools.digicert.com/checker/

### Command Line Tests
```bash
# Test SSL connection
curl -vI https://your-domain.com

# Test certificate details
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check certificate expiry
openssl x509 -in certificate.pem -text -noout | grep "Not After"
```

### Browser Tests
1. Open your site in Chrome/Firefox
2. Check the address bar shows a lock icon
3. Click the lock to view certificate details
4. Verify certificate is valid and not expired

## 🚨 Troubleshooting

### Common Issues

1. **Certificate Not Found**
   ```bash
   # Check certificate paths
   ls -la /etc/letsencrypt/live/your-domain.com/

   # Verify file permissions
   sudo chmod 644 /etc/letsencrypt/live/your-domain.com/fullchain.pem
   sudo chmod 600 /etc/letsencrypt/live/your-domain.com/privkey.pem
   ```

2. **Port 80/443 Blocked**
   ```bash
   # Check if ports are open
   sudo ufw status

   # Allow HTTPS traffic
   sudo ufw allow 443
   sudo ufw allow 80
   ```

3. **Firewall Issues**
   ```bash
   # Check firewall rules
   sudo iptables -L

   # Allow HTTP and HTTPS
   sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
   sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
   ```

4. **Domain Not Pointing to Server**
   ```bash
   # Check DNS resolution
   nslookup your-domain.com

   # Verify A record points to your server IP
   dig your-domain.com A
   ```

### Debug Commands
```bash
# Test SSL handshake
openssl s_client -connect your-domain.com:443 -servername your-domain.com < /dev/null

# Check certificate chain
curl -v https://your-domain.com 2>&1 | grep -i "certificate\|ssl\|tls"

# Verify nginx configuration
sudo nginx -t
sudo nginx -s reload
```

## 🔄 Renewal (Let's Encrypt)

### Manual Renewal
```bash
# Renew certificate
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal
```

### Automatic Renewal
```bash
# Check renewal status
sudo certbot certificates

# Test renewal (dry run)
sudo certbot renew --dry-run

# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 📊 Monitoring

### Certificate Expiry Monitoring
```bash
# Check expiry date
echo | openssl s_client -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -enddate

# Set up monitoring alert
# Add to cron: check if certificate expires within 30 days
```

### SSL Quality Monitoring
- Use online SSL checkers regularly
- Monitor SSL certificate expiry
- Check for security vulnerabilities
- Review SSL configuration best practices

## 🎯 Best Practices

1. **Use Strong Certificates**
   - Minimum RSA 2048-bit or ECDSA P-256
   - SHA-256 or higher for signatures
   - Valid certificate chain

2. **Security Headers**
   ```nginx
   add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
   add_header X-Content-Type-Options nosniff;
   add_header X-Frame-Options DENY;
   add_header X-XSS-Protection "1; mode=block";
   ```

3. **Performance Optimization**
   - Enable OCSP stapling
   - Use session tickets
   - Enable HTTP/2
   - Configure proper caching

4. **Regular Maintenance**
   - Monitor certificate expiry
   - Update SSL configurations
   - Test SSL setup regularly
   - Keep software updated

## 📞 Support

### Resources
- **Let's Encrypt**: https://letsencrypt.org/
- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **Mozilla SSL Configuration**: https://mozilla.github.io/server-side-tls/ssl-config-generator/

### Troubleshooting
1. Check certificate paths and permissions
2. Verify domain DNS configuration
3. Test firewall and port accessibility
4. Review nginx error logs
5. Use online SSL testing tools

---

**SSL Setup Complete!** 🔒 Your application now supports secure HTTPS connections.
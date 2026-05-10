# Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account
- PostgreSQL database (Vercel Postgres, Supabase, or Railway)

### Step 1: Push to GitHub

```bash
cd ai-spend-audit
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Step 3: Set Environment Variables

In Vercel dashboard, add these environment variables:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 4: Set Up Database

**Option A: Vercel Postgres**
```bash
# In Vercel dashboard
1. Go to Storage tab
2. Create Postgres database
3. Copy connection string
4. Add to environment variables
```

**Option B: Supabase**
```bash
1. Create project at supabase.com
2. Get connection string from Settings > Database
3. Add to environment variables
```

**Option C: Railway**
```bash
1. Create project at railway.app
2. Add PostgreSQL service
3. Copy connection string
4. Add to environment variables
```

### Step 5: Run Database Migrations

```bash
# Locally with production database
DATABASE_URL="your_production_url" npx prisma db push

# Or use Prisma Studio
DATABASE_URL="your_production_url" npx prisma studio
```

### Step 6: Deploy

```bash
git push origin main
# Vercel will automatically deploy
```

### Step 7: Verify Deployment

1. Visit your deployment URL
2. Test the audit flow
3. Check error logs in Vercel dashboard
4. Verify database connections

## Custom Domain Setup

### Add Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS configuration instructions

### Configure DNS

Add these records to your DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL Certificate

Vercel automatically provisions SSL certificates. Wait 24-48 hours for DNS propagation.

## Environment-Specific Configuration

### Development
```env
DATABASE_URL=postgresql://localhost:5432/ai_spend_audit_dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Staging
```env
DATABASE_URL=postgresql://staging-db-url
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com
```

### Production
```env
DATABASE_URL=postgresql://production-db-url
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Post-Deployment Checklist

- [ ] Test audit flow end-to-end
- [ ] Verify email sending (if configured)
- [ ] Check AI summary generation
- [ ] Test share URLs
- [ ] Verify database writes
- [ ] Check error tracking
- [ ] Test mobile responsiveness
- [ ] Verify analytics tracking
- [ ] Test all API endpoints
- [ ] Check performance (Lighthouse)

## Monitoring Setup

### Vercel Analytics
Already included with Vercel deployment.

### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitoring
Use [UptimeRobot](https://uptimerobot.com) (free):
1. Create account
2. Add monitor for your domain
3. Set check interval to 5 minutes
4. Configure alerts

## Performance Optimization

### Enable Caching
Vercel automatically caches static assets and pages.

### Database Connection Pooling
Use connection pooling in production:
```env
DATABASE_URL=postgresql://user:password@host:5432/db?pgbouncer=true
```

### Image Optimization
Next.js automatically optimizes images. No additional configuration needed.

## Troubleshooting

### Build Failures

**Issue**: Prisma client not generated
```bash
# Solution: Add to package.json scripts
"postinstall": "prisma generate"
```

**Issue**: Environment variables not found
```bash
# Solution: Check Vercel dashboard environment variables
# Ensure they're set for Production environment
```

### Runtime Errors

**Issue**: Database connection fails
```bash
# Solution: Check DATABASE_URL format
# Ensure database allows connections from Vercel IPs
```

**Issue**: AI summary not generating
```bash
# Solution: Check API keys are set
# Verify API key permissions
# Check error logs for specific error
```

### Performance Issues

**Issue**: Slow page loads
```bash
# Solution: Check Vercel Analytics
# Optimize images
# Enable caching
# Use CDN for assets
```

## Rollback Procedure

### Rollback to Previous Deployment

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous successful deployment
4. Click "..." menu
5. Click "Promote to Production"

### Rollback Database Changes

```bash
# If using Prisma migrations
npx prisma migrate resolve --rolled-back <migration-name>

# If using db push, restore from backup
# (Always backup before major changes)
```

## Backup Strategy

### Database Backups

**Automated** (Recommended):
- Vercel Postgres: Automatic daily backups
- Supabase: Automatic daily backups
- Railway: Automatic daily backups

**Manual**:
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

### Code Backups

Git repository serves as code backup. Ensure:
- Regular commits
- Push to remote
- Protected main branch
- Tag releases

## Scaling Considerations

### Horizontal Scaling
Vercel automatically scales serverless functions.

### Database Scaling
- Start with basic tier
- Monitor connection count
- Upgrade when needed
- Consider read replicas for high traffic

### Cost Optimization
- Use Vercel Hobby plan initially (free)
- Upgrade to Pro when needed ($20/mo)
- Monitor database usage
- Optimize API calls

## Security Checklist

- [ ] Environment variables secured
- [ ] Database uses SSL
- [ ] API keys rotated regularly
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection enabled
- [ ] HTTPS enforced
- [ ] Security headers configured

## Maintenance

### Weekly
- Check error logs
- Review analytics
- Monitor uptime
- Check database size

### Monthly
- Update dependencies
- Review security advisories
- Backup database manually
- Review performance metrics

### Quarterly
- Major dependency updates
- Security audit
- Performance optimization
- Feature planning

## Support

### Getting Help

**Vercel Support**:
- Documentation: vercel.com/docs
- Community: github.com/vercel/next.js/discussions

**Database Support**:
- Vercel Postgres: vercel.com/support
- Supabase: supabase.com/support
- Railway: railway.app/help

**Application Issues**:
- GitHub Issues: your-repo/issues
- Email: your-email@domain.com

---

**Last Updated**: May 8, 2026
**Status**: Production Ready

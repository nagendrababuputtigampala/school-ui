import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  WhatsApp,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useSchool } from '../contexts/SchoolContext';

export function Footer() {
  const { schoolData } = useSchool();
  const schoolName = schoolData?.name || 'EduConnect';
  const currentYear = new Date().getFullYear();

  const pages = (schoolData?.pages ?? {}) as Record<string, any>;
  const contactSource: unknown =
    schoolData?.contactInfo ??
    pages.contactPage?.content ??
    pages.contactPage ??
    pages.contact?.content ??
    pages.contact ??
    {};

  const normalizeToArray = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value
        .flatMap((item) => normalizeToArray(item))
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (typeof value === 'string') {
      return value
        .split(/\r?\n|<br\s*\/?>/i)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    if (typeof value === 'object') {
      return Object.values(value as Record<string, unknown>)
        .flatMap((item) => normalizeToArray(item))
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const withFallback = (value: unknown, fallback: string[]): string[] => {
    const lines = normalizeToArray(value);
    return lines.length ? lines : fallback;
  };

  const contactObject = contactSource as Record<string, unknown>;
  const getValue = (key: string) => contactObject?.[key];

  const addressLines = withFallback(
    getValue('address'),
    ['123 Education Street', 'Learning City, LC 12345']
  );
  const phoneLines = withFallback(
    getValue('phone') ??
      getValue('phones') ??
      getValue('phoneNumbers'),
    ['(555) 123-4567']
  );
  const emailLines = withFallback(
    getValue('email') ??
      getValue('emails') ??
      getValue('emailAddresses'),
    ['info@educonnect.edu']
  );
  const whatsappLines = normalizeToArray(
    getValue('whatsApp') ??
      getValue('whatsapp') ??
      getValue('whats_app')
  );

  const socialMediaRaw = getValue('socialMedia');
  const socialMedia = {
    ...(typeof socialMediaRaw === 'object' && socialMediaRaw ? (socialMediaRaw as Record<string, unknown>) : {}),
    ...(schoolData?.socialMedia || {}),
  } as Record<string, unknown>;
  const schoolSocial = (schoolData?.socialMedia ?? {}) as Record<string, unknown>;

  const resolveUrl = (...values: unknown[]) => {
    for (const value of values) {
      if (typeof value !== 'string') continue;
      const trimmed = value.trim();
      if (!trimmed) continue;
      if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
      }
      // Default to https if protocol missing
      return `https://${trimmed.replace(/^https?:\/\//i, '')}`;
    }
    return undefined;
  };

  const whatsappLink = (() => {
    if (!whatsappLines.length) return undefined;
    const digits = whatsappLines[0].replace(/[^\d]/g, '');
    return digits ? `https://wa.me/${digits}` : undefined;
  })();
  const facebookLink = resolveUrl(
    getValue('facebook'),
    socialMedia['facebook'],
    schoolSocial['facebook']
  );
  const twitterLink = resolveUrl(
    socialMedia['twitter'],
    schoolSocial['twitter']
  );
  const instagramLink = resolveUrl(
    getValue('instagram'),
    socialMedia['instagram'],
    schoolSocial['instagram']
  );
  const linkedInLink = resolveUrl(
    socialMedia['linkedin'],
    schoolSocial['linkedin']
  );
  type SocialIcon = { href: string; icon: React.ReactElement; label: string };
  const socialIcons = [
    whatsappLink ? { href: whatsappLink, icon: <WhatsApp />, label: 'WhatsApp' } : null,
    facebookLink ? { href: facebookLink, icon: <Facebook />, label: 'Facebook' } : null,
    twitterLink ? { href: twitterLink, icon: <Twitter />, label: 'Twitter' } : null,
    instagramLink ? { href: instagramLink, icon: <Instagram />, label: 'Instagram' } : null,
    linkedInLink ? { href: linkedInLink, icon: <LinkedIn />, label: 'LinkedIn' } : null,
  ].filter((item): item is SocialIcon => Boolean(item));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        py: { xs: 4, md: 5 },
        mt: 'auto',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          overflowX: 'hidden',
          px: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
          {/* School Snapshot */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
              {schoolName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {schoolData?.welcomeSubtitle || 'Empowering minds, shaping futures. Excellence in education since 1985.'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.7 }}>
              Excellence in academics, character, and community partnership.
            </Typography>
          </Grid>

          {/* Contact Details */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Box component="li" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <LocationOn sx={{ fontSize: 20, opacity: 0.9, mt: 0.3 }} />
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {addressLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < addressLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
              <Box component="li" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Phone sx={{ fontSize: 20, opacity: 0.9, mt: 0.3 }} />
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {phoneLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < phoneLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
              <Box component="li" sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                <Email sx={{ fontSize: 20, opacity: 0.9, mt: 0.3 }} />
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {emailLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < emailLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Stay Connected */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Stay Connected
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1.5 }}>
              Follow our journey and connect with the school community.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {socialIcons.length > 0 ? (
                socialIcons.map(({ href, icon, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    aria-label={label}
                    sx={{
                      color: 'primary.contrastText',
                      border: '1px solid rgba(255,255,255,0.35)',
                      '&:hover': { opacity: 0.9, backgroundColor: 'rgba(255,255,255,0.06)' },
                      width: 36,
                      height: 36,
                    }}
                  >
                    {icon}
                  </IconButton>
                ))
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Social media links coming soon.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, md: 3.5 }, backgroundColor: 'rgba(255,255,255,0.18)' }} />

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: { xs: 1.5, md: 2 },
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            {`Copyright ${currentYear} ${schoolName}. All rights reserved.`}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1.5, md: 2.5 },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' }
          }}>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              variant="caption"
              sx={{ opacity: 0.75, '&:hover': { opacity: 1 } }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              variant="caption"
              sx={{ opacity: 0.75, '&:hover': { opacity: 1 } }}
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              underline="hover"
              variant="caption"
              sx={{ opacity: 0.75, '&:hover': { opacity: 1 } }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

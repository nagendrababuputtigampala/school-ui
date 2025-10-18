import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  WhatsApp,
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



  const contactObject = contactSource as Record<string, unknown>;
  const getValue = (key: string) => contactObject?.[key];


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
        py: { xs: 1, md: 1.2 },
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 1.5, md: 2 } }}>
          {/* School Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0, lineHeight: 1.2 }}>
              {schoolName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem', lineHeight: 1.3, mt: 0.2 }}>
              {schoolData?.welcomeSubtitle || 'Excellence in education'}
            </Typography>
          </Box>

          {/* Follow Us - Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
              Follow:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.3 }}>
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
                      border: '1px solid rgba(255,255,255,0.2)',
                      '&:hover': { opacity: 0.9, backgroundColor: 'rgba(255,255,255,0.05)' },
                      width: 24,
                      height: 24,
                      '& svg': { fontSize: '0.9rem' }
                    }}
                  >
                    {icon}
                  </IconButton>
                ))
              ) : (
                <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem' }}>
                  Soon
                </Typography>
              )}
            </Box>
          </Box>

          {/* Copyright and Links - Same line */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: { xs: 1, md: 1.5 },
            flexShrink: 0,
            order: { xs: 3, md: 0 },
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'space-between', md: 'flex-end' }
          }}>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
              © {currentYear} {schoolName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link href="#" color="inherit" underline="hover" variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem', '&:hover': { opacity: 1 } }}>
                Privacy
              </Link>
              <Link href="#" color="inherit" underline="hover" variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem', '&:hover': { opacity: 1 } }}>
                Terms
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

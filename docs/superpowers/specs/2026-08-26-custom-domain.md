# Molinari STUDIOS Custom Domain Specification

## Goal

Serve the existing GitHub Pages site at `https://molinaristudios.com`, with `www.molinaristudios.com` resolving to the same Pages site and HTTPS enforced after GitHub provisions the certificate.

## Site behavior

- GitHub Pages remains the production host.
- Custom-domain builds export the site at the domain root without the `/molinari-studios` base path.
- Canonical metadata and social images use `https://molinaristudios.com`.
- Repository-subpath exports remain supported when no custom domain is supplied.

## DNS and GitHub configuration

- Verify `molinaristudios.com` in the `JefersonMolinari` GitHub account with GitHub's generated TXT record.
- Configure the apex with GitHub Pages' four IPv4 addresses.
- Configure `www` as a CNAME to `JefersonMolinari.github.io`.
- Keep GitHub Pages records DNS-only in Cloudflare.
- Set the repository's Pages custom domain to `molinaristudios.com`.
- Enable HTTPS after certificate provisioning.


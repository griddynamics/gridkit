# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately
to the security team at security@griddynamics.com. Do not create
a public issue.

## Best Practices

- Do not hard-code credentials or secrets.
- Use environment variables and GitHub Secrets for CI/CD.
- Follow secure coding guidelines and conduct code reviews.

## CI/CD Secrets

All credentials should be stored securely using GitHub Actions Secrets or an internal vault system.
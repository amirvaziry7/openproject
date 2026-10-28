FROM ghcr.io/amirvaziry7/openproject:18.0.0-fa.11-a76b3e10c81 AS slim

COPY --chown=app:app app/seeders/standard.yml /app/app/seeders/standard.yml
COPY --chown=app:app modules/bim/app/seeders/bim.yml /app/modules/bim/app/seeders/bim.yml

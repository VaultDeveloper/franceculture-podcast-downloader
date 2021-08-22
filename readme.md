# Install
## Firefox
- `about:debugging#/runtime/this-firefox`
- "Charger un module complémentaire temporaire".
- Sélectionner n'importe quel fichier de ce dossier.

# Debug
## Firefox
- `about:debugging#/runtime/this-firefox`
- "Charger un module complémentaire temporaire".
- Sélectionner n'importe quel fichier de ce dossier.
- "Examiner".

# Release
## Firefox
- Récupérer la clef d'API et l'API Secret: https://addons.mozilla.org/fr/developers/addon/api/key/
- Installer web-ext: `npm install --global web-ext`.
- Builder avec signature: `web-ext sign --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET`

# Todo
- Signer l'extension pour qu'elle soit disponible sur le navigateur après redémarrage: https://stackoverflow.com/a/64844323/6595016
- Appliquer les tags (ID3v2) sur le fichier mp3 pour qu'il soit classé correctement.

# Ether bot

Le bot discord Ether-Bot permet de créer des formations ou de modérer un serveur discord destiné a la structure Ether Esport.

## Pré-requis

Le bot discord utilise MySQL pour effectuer une sauvegarde des données. La base de données doit fonctionner en local ou sinon il faut modifier le fichier : `/core/pool.js`.
La base de données doit être initialisé avec le fichier `www.sql`.

## Installation

Pour initialiser le bot, l'utilisation de [NPM](https://www.npmjs.com/) est nécessaire. Après avoir téléchargé les fichiers du bot. Dans le dossier effectuer la commande : 

```bash
npm i 
```

## Configuration
Avant de lancer le bot, il faut le configurer, toutes les options qui ont besoin d'une configuration sont dans `config.json`.

Dans le dossier `/database/ReactionJSON`, les réactions s'activent au démarrage du bot, si elles ne sont pas bien configurer celle-ci font crash le bot au démarrage. Le renommage ce fait de la manière suivante : ` nom du dossier = id du channel`, et l'id dans le fichier représente celui du message.

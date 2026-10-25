# 🦁 Maths CI - Jardin d'Enfants (Section 1)

Plateforme ludo-éducative interactive et Progressive Web App (PWA) pour smartphone et tablette, conçue spécialement pour les enfants du jardin d'enfants (maternelle / Section 1).

Adaptée fidèlement du manuel scolaire officiel : **« Mon cahier d’activités de Mathématiques - Section 1 »** (*Collection Le Mono, République Togolaise - Ministère des Enseignements Primaire, Secondaire et de la Formation Professionnelle*).

---

## 🌟 Fonctionnalités Clés

- 🎧 **100% Narration Vocale en Français :** Synthèse vocale (`speechSynthesis`) qui lit automatiquement toutes les consignes pour que l'enfant puisse jouer en toute autonomie sans savoir lire.
- 📱 **Pensé pour Mobile & Écran Tactile (PWA) :** Gros boutons tactiles, animations douces, confettis de victoire et effets sonores stimulants (`Web Audio API`).
- 🎨 **Atelier de Coloriage au Doigt :** Dessins vectoriels adaptés du manuel (Ballon, Tasse, Carrés géométriques, Papillon, École) avec remplissage au toucher ou dessin au doigt.
- 📶 **Fonctionne Hors-Ligne :** Grâce au Service Worker, l'application reste accessible même sans connexion internet une fois installée sur le téléphone.
- 👨‍👩‍👧 **Espace Parents :** Suivi des étoiles, personnalisation du prénom et de l'avatar de l'enfant (Uriel), et guide pédagogique officiel.

---

## 📚 Les 3 Domaines Pédagogiques Officiels

1. **Logique & Formes** 🎨 :
   - Semaine 1 : Identifier les couleurs (tasse rouge, ballon bleu, papillon).
   - Semaine 3 : Formes géométriques (Orange ronde, banane courbée, carrés).
   - Semaine 8 : La Chenille des rythmes et algorithmes de couleurs.
2. **Nombres & Quantités** 🔢 :
   - Semaine 1 : Comparer les quantités (*Beaucoup ou Peu* avec bonbons et tomates).
   - Semaine 2 : Dominos et cuillères (quantités 1 et 2).
   - Semaine 9 : Dénombrement jusqu'à 4 papillons.
   - Semaine 22 : Le Train des chiffres (0 à 6) et la cueillette des 6 mangues.
3. **Espace & Temps** 🧭 :
   - Semaine 6 : Dedans et Dehors dans le panier de jouets.
   - Semaine 9 : Le Labyrinthe pour guider le petit écolier jusqu'à l'école.
   - Semaine 23 : Repérage de la gauche et de la droite avec les animaux.

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+)

### Installation
```bash
npm install
```

### Lancer en développement
```bash
npm run dev -- --host
```
Accédez ensuite à `http://localhost:5173/` sur votre ordinateur ou via l'adresse IP locale affichée dans le terminal sur votre smartphone connecté au même réseau Wi-Fi.

### Compiler pour la production
```bash
npm run build
```

---

## 📱 Installation sur Téléphone (PWA)

1. Ouvrez l'adresse de l'application sur le navigateur de votre smartphone (ex: `http://<IP-LOCALE>:5173/`).
2. **Android (Chrome) :** Appuyez sur le menu (les 3 points en haut à droite) puis sélectionnez **« Installer l'application »** ou **« Ajouter à l'écran d'accueil »**.
3. **iPhone (Safari) :** Appuyez sur le bouton **Partager** en bas, puis sélectionnez **« Sur l'écran d'accueil »**.

L'application aura son propre icône sur l'écran du smartphone et fonctionnera en plein écran comme une application native !

---

## 📄 Licence
Ce projet a été développé avec amour pour l'apprentissage des mathématiques des tout-petits au Togo et en Afrique francophone.

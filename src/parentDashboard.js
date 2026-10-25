// Parent / Educator Dashboard & Mobile Setup Guide
import { state } from './state.js';
import { sounds } from './audio.js';
import { WEEKS } from './curriculum.js';

export class ParentDashboard {
  constructor(container, onClose) {
    this.container = container;
    this.onClose = onClose;
  }

  show() {
    this.container.innerHTML = '';
    const modal = document.createElement('div');
    modal.className = 'parent-modal-overlay animate-pop';

    // Calculate progress
    const totalStars = state.data.stars;
    const completedActsCount = Object.keys(state.data.activityStars).length;
    let totalCurriculumActivities = 0;
    WEEKS.forEach(w => totalCurriculumActivities += w.activities.length);

    modal.innerHTML = `
      <div class="parent-modal-card">
        <div class="parent-modal-header">
          <div class="header-title-box">
            <span class="parent-badge">👨‍👩‍👧 Espace Parents & Éducateurs</span>
            <h2>Suivi & Installation Mobile</h2>
          </div>
          <button class="btn-close-modal" id="btn-close-parent">✕</button>
        </div>

        <div class="parent-tabs-nav">
          <button class="parent-tab-btn is-active" data-tab="mobile">📱 Mettre sur le Téléphone</button>
          <button class="parent-tab-btn" data-tab="progress">📊 Progrès d’Uriel</button>
          <button class="parent-tab-btn" data-tab="pedagogy">📘 Guide Pédagogique (CI)</button>
        </div>

        <div class="parent-tab-content" id="parent-tab-body">
          <!-- Populated by tab switch -->
        </div>
      </div>
    `;

    this.container.appendChild(modal);

    const closeBtn = modal.querySelector('#btn-close-parent');
    closeBtn.onclick = () => {
      sounds.playPop();
      modal.remove();
      if (this.onClose) this.onClose();
    };

    const tabBody = modal.querySelector('#parent-tab-body');
    const tabs = modal.querySelectorAll('.parent-tab-btn');

    const renderTab = (tabId) => {
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === tabId));
      if (tabId === 'mobile') {
        this.renderMobileTab(tabBody);
      } else if (tabId === 'progress') {
        this.renderProgressTab(tabBody, totalStars, completedActsCount, totalCurriculumActivities);
      } else if (tabId === 'pedagogy') {
        this.renderPedagogyTab(tabBody);
      }
    };

    tabs.forEach(tab => {
      tab.onclick = () => {
        sounds.playPop();
        renderTab(tab.dataset.tab);
      };
    });

    // Default to mobile tab
    renderTab('mobile');
  }

  renderMobileTab(container) {
    const currentUrl = window.location.href;
    const host = window.location.hostname;
    const port = window.location.port || '5173';

    container.innerHTML = `
      <div class="mobile-setup-card">
        <div class="setup-hero">
          <div class="device-icon">📲</div>
          <div class="setup-hero-text">
            <h3>Comment installer le jeu sur le smartphone ?</h3>
            <p>L’application fonctionne comme une vraie application mobile (PWA) sur <strong>Android</strong> et <strong>iPhone</strong> sans nécessiter de téléchargement sur un store.</p>
          </div>
        </div>

        <div class="instructions-steps">
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-desc">
              <h4>Connecter le téléphone au même réseau Wi-Fi</h4>
              <p>Assurez-vous que le téléphone de votre enfant et votre ordinateur sont sur le même réseau Wi-Fi de la maison.</p>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-desc">
              <h4>Ouvrir l’adresse dans le navigateur du téléphone</h4>
              <p>Ouvrez Chrome (Android) ou Safari (iPhone) et entrez l’adresse réseau du serveur :</p>
              <div class="url-copy-box">
                <code id="server-url">http://${host}:${port}</code>
              </div>
            </div>
          </div>

          <div class="step-card highlight-step">
            <div class="step-number">3</div>
            <div class="step-desc">
              <h4>Ajouter sur l’Écran d’Accueil</h4>
              <ul class="device-install-list">
                <li>🤖 <strong>Sur Android (Chrome) :</strong> Appuyez sur les 3 points en haut à droite ➔ <em>« Ajouter à l'écran d'accueil »</em> ou <em>« Installer l'application »</em>.</li>
                <li>🍏 <strong>Sur iPhone (Safari) :</strong> Appuyez sur le bouton Partager 📤 en bas ➔ <em>« Sur l'écran d'accueil »</em>.</li>
              </ul>
              <p class="install-tip">✨ L'icône dorée <strong>Maths CI</strong> apparaîtra directement à côté des autres jeux de votre enfant et pourra se lancer en plein écran !</p>
            </div>
          </div>
        </div>

        <div class="offline-feature-banner">
          <span class="icon">✈️</span>
          <div>
            <strong>Mode Hors-Ligne Inclus :</strong>
            <p>Grâce au Service Worker intégré, une fois chargée une première fois, l'application peut être utilisée dans la voiture ou sans connexion internet !</p>
          </div>
        </div>
      </div>
    `;
  }

  renderProgressTab(container, stars, completedCount, totalCount) {
    const percent = Math.round((completedCount / totalCount) * 100);

    container.innerHTML = `
      <div class="progress-tab-wrapper">
        <div class="stats-overview-row">
          <div class="stat-bubble">
            <span class="stat-num">⭐ ${stars}</span>
            <span class="stat-name">Étoiles récoltées</span>
          </div>
          <div class="stat-bubble">
            <span class="stat-num">🏆 ${state.data.badges.filter(b => b.unlocked).length} / ${state.data.badges.length}</span>
            <span class="stat-name">Badges débloqués</span>
          </div>
          <div class="stat-bubble">
            <span class="stat-num">${percent}%</span>
            <span class="stat-name">Progression globale</span>
          </div>
        </div>

        <div class="child-customizer-box">
          <h4>👤 Profil de l'enfant</h4>
          <div class="child-input-group">
            <label for="child-name-input">Prénom de l'enfant :</label>
            <input type="text" id="child-name-input" value="${state.data.childName}" maxlength="20" />
            <button class="btn-bounce btn-secondary" id="btn-save-child-name">Enregistrer</button>
          </div>
          <div class="avatar-selection-row">
            <span class="avatar-label">Choisir un avatar :</span>
            <div class="avatar-chips">
              ${['🦁 Lionceau', '🚀 Astronaute', '🦸 Super-Héros', '⭐ Étoile Magique', '🐼 Panda'].map(av => `
                <button class="avatar-chip ${state.data.avatar === av.split(' ')[0] ? 'is-selected' : ''}" data-avatar="${av.split(' ')[0]}">
                  ${av}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="badges-showcase">
          <h4>🏅 Collection de Trophées</h4>
          <div class="badges-grid">
            ${state.data.badges.map(b => `
              <div class="badge-item ${b.unlocked ? 'is-unlocked' : 'is-locked'}">
                <span class="badge-icon">${b.icon}</span>
                <div class="badge-info">
                  <strong>${b.title}</strong>
                  <p>${b.desc}</p>
                  <span class="badge-status">${b.unlocked ? '✅ Débloqué' : '🔒 À conquérir'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="danger-zone">
          <button class="btn-reset-data" id="btn-reset-progress">🔄 Réinitialiser la progression</button>
        </div>
      </div>
    `;

    // Handlers
    const nameInput = container.querySelector('#child-name-input');
    const saveBtn = container.querySelector('#btn-save-child-name');
    saveBtn.onclick = () => {
      state.setChildName(nameInput.value);
      sounds.playSuccess();
      sounds.speak(`Prénom enregistré : ${state.data.childName} !`);
    };

    container.querySelectorAll('.avatar-chip').forEach(btn => {
      btn.onclick = () => {
        sounds.playPop();
        state.setAvatar(btn.dataset.avatar);
        container.querySelectorAll('.avatar-chip').forEach(c => c.classList.remove('is-selected'));
        btn.classList.add('is-selected');
      };
    });

    container.querySelector('#btn-reset-progress').onclick = () => {
      if (confirm('Voulez-vous vraiment réinitialiser toutes les étoiles et activités d’Uriel ?')) {
        state.resetProgress();
        sounds.playPop();
        this.renderProgressTab(container, 0, 0, totalCount);
      }
    };
  }

  renderPedagogyTab(container) {
    container.innerHTML = `
      <div class="pedagogy-card">
        <h3>Programme Officiel : Mathématiques Section 1 (Préscolaire)</h3>
        <p class="source-credit">Issu du manuel <em>« Mon cahier d’activités de Mathématiques - Section 1 »</em> (Collection Le Mono - République Togolaise).</p>

        <div class="domains-accordion">
          <div class="domain-card-info">
            <span class="domain-pill logic">🎨 Domaine 1 : La Logique</span>
            <p>Développer les opérations de comparaison, de tri, de classement, et de rangement selon la nature, la forme, la couleur ou la taille de l'objet pour résoudre des situations concrètes.</p>
          </div>

          <div class="domain-card-info">
            <span class="domain-pill numbers">🔢 Domaine 2 : Les Nombres (0 à 6)</span>
            <p>Maîtriser les quantités simples (beaucoup vs peu, plus que / moins que), le dénombrement jusqu'à 6, l'association de chiffres aux constellations de points (dominos/dés) et aux collections d'objets réels.</p>
          </div>

          <div class="domain-card-info">
            <span class="domain-pill space">🧭 Domaine 3 : Espace & Temps</span>
            <p>Observation et repérage spatial : dedans/dehors, dessus/dessous, devant/derrière, gauche/droite, labyrinthes. Exploitation du temps : chronologie de la journée (matin, midi, soir).</p>
          </div>
        </div>

        <div class="pedagogy-parent-tip">
          <h4>💡 Conseil aux parents pour la manipulation :</h4>
          <p>Laissez d'abord votre enfant observer les éléments à l'écran, écoutez la consigne sonore avec lui, et encouragez-le par des félicitations verbales même en cas d'hésitation. La régularité (5 à 10 minutes par jour sur le téléphone) est la clé d'un apprentissage heureux et solide !</p>
        </div>
      </div>
    `;
  }
}

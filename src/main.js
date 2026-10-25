// Main Application Controller for Maths CI
import './style.css';
import { state } from './state.js';
import { sounds } from './audio.js';
import { DOMAINS, WEEKS } from './curriculum.js';
import { GameEngine } from './gameEngine.js';
import { ParentDashboard } from './parentDashboard.js';
import { ColoringStudio } from './coloringStudio.js';

class App {
  constructor() {
    this.currentView = 'curriculum';
    this.activeActivity = null;

    // Elements
    this.mainContent = document.getElementById('main-content');
    this.gameContainer = document.getElementById('game-container');
    this.greetingBanner = document.getElementById('greeting-banner');
    this.starDisplay = document.getElementById('header-star-count');
    this.childNameDisplay = document.getElementById('child-name-display');
    this.childAvatarDisplay = document.getElementById('child-avatar-display');
    this.soundToggleBtn = document.getElementById('btn-toggle-sound');
    this.parentModalContainer = document.getElementById('parent-modal-container');

    this.gameEngine = new GameEngine(this.gameContainer, (act) => {
      this.handleActivityComplete(act);
    });

    this.coloringStudio = new ColoringStudio(this.mainContent, () => {
      this.currentView = 'curriculum';
      document.querySelectorAll('.view-tab-btn').forEach(b => b.classList.toggle('is-active', b.dataset.view === 'curriculum'));
      this.renderCurrentView();
    });

    this.parentDashboard = new ParentDashboard(this.parentModalContainer, () => {
      this.updateHeader();
    });

    this.init();
  }

  init() {
    this.updateHeader();
    this.setupEventListeners();
    this.renderCurrentView();

    // Friendly initial voice greeting if tapped
    document.body.addEventListener('click', () => {
      sounds.initContext();
    }, { once: true });
  }

  updateHeader() {
    this.starDisplay.textContent = state.data.stars;
    this.childNameDisplay.textContent = state.data.childName;
    
    const avatarIcons = {
      'lion': '🦁',
      'tiger': '🐯',
      'astronaut': '🚀',
      'hero': '🦸',
      'star': '⭐',
      'panda': '🐼'
    };
    this.childAvatarDisplay.textContent = avatarIcons[state.data.avatar] || '🦁';

    this.soundToggleBtn.textContent = sounds.soundEnabled ? '🔊' : '🔇';
  }

  setupEventListeners() {
    // Navigation Brand returns to home
    document.getElementById('nav-brand').onclick = () => {
      sounds.playPop();
      this.closeGameView();
      this.currentView = 'curriculum';
      this.renderCurrentView();
    };

    // Sound toggle
    this.soundToggleBtn.onclick = () => {
      sounds.soundEnabled = !sounds.soundEnabled;
      sounds.speechEnabled = sounds.soundEnabled;
      if (!sounds.soundEnabled) sounds.stopSpeech();
      this.updateHeader();
    };

    // Parent Mode
    document.getElementById('btn-open-parent').onclick = () => {
      sounds.playPop();
      this.parentDashboard.show();
    };

    // Hero Quick Play
    document.getElementById('btn-hero-play').onclick = () => {
      sounds.playPop();
      // Find first incomplete activity or first activity
      const allActs = [];
      WEEKS.forEach(w => w.activities.forEach(a => allActs.push(a)));
      const nextAct = allActs.find(a => !state.data.activityStars[a.id]) || allActs[0];
      this.launchActivity(nextAct);
    };

    // View switcher tabs
    document.querySelectorAll('.view-tab-btn').forEach(btn => {
      btn.onclick = () => {
        sounds.playPop();
        document.querySelectorAll('.view-tab-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.currentView = btn.dataset.view;
        this.closeGameView();
        this.renderCurrentView();
      };
    });
  }

  renderCurrentView() {
    this.mainContent.innerHTML = '';
    if (this.currentView === 'curriculum') {
      this.renderCurriculumView();
    } else if (this.currentView === 'minigames') {
      this.renderMinigamesView();
    } else if (this.currentView === 'coloriage') {
      this.coloringStudio.show();
    } else if (this.currentView === 'badges') {
      this.renderBadgesView();
    }
  }

  renderCurriculumView() {
    const container = document.createElement('div');
    container.className = 'curriculum-container';

    // Group weeks by domain
    Object.values(DOMAINS).forEach(domain => {
      const weeksInDomain = WEEKS.filter(w => w.domain === domain.id);
      if (weeksInDomain.length === 0) return;

      const domainCard = document.createElement('div');
      domainCard.className = 'domain-section-card';

      domainCard.innerHTML = `
        <div class="domain-header">
          <div class="domain-icon-circle" style="background: ${domain.gradient}">
            ${domain.icon}
          </div>
          <div class="domain-info">
            <h3>${domain.title}</h3>
            <p>${domain.subtitle}</p>
          </div>
        </div>
        <div class="activities-scroll-row"></div>
      `;

      const actRow = domainCard.querySelector('.activities-scroll-row');

      weeksInDomain.forEach(week => {
        week.activities.forEach(act => {
          const starsEarned = state.data.activityStars[act.id] || 0;
          const starsText = starsEarned > 0 ? '⭐'.repeat(starsEarned) : '☆☆☆';

          const item = document.createElement('div');
          item.className = 'activity-card-item card-interactive';
          item.innerHTML = `
            <div class="activity-top">
              <span class="activity-page-tag">${act.bookRef}</span>
              <div class="stars-earned">${starsText}</div>
            </div>
            <div class="act-title-text">${act.title}</div>
            <div class="act-instruction-preview">${act.instruction}</div>
            <div class="activity-bottom">
              <span class="week-pill">${week.title}</span>
              <button class="btn-play-pill">Jouer ▶</button>
            </div>
          `;

          item.onclick = () => {
            sounds.playPop();
            this.launchActivity(act);
          };

          actRow.appendChild(item);
        });
      });

      container.appendChild(domainCard);
    });

    this.mainContent.appendChild(container);
  }

  renderMinigamesView() {
    const minigamesList = [
      {
        id: 'mg_beaucoup_peu',
        title: '🍬 Beaucoup ou Peu ?',
        desc: 'Compare les tas de bonbons et les paniers de tomates du livre !',
        actId: 's1_a2',
        color: '#FF6B6B'
      },
      {
        id: 'mg_couleurs',
        title: '🎨 Défilé des Couleurs',
        desc: 'Relie les ballons, tasses et papillons de même couleur !',
        actId: 's1_a1',
        color: '#4EA8DE'
      },
      {
        id: 'mg_coloriage_1',
        title: '🖌️ Coloriage : Ballon & Tasse',
        desc: 'Colorie au doigt ou au pot magique le ballon bleu et la tasse rouge (Page 12) !',
        actId: 's1_a_color',
        color: '#E63946'
      },
      {
        id: 'mg_coloriage_2',
        title: '🟧 Coloriage : Les Carrés',
        desc: 'Colorie tous les carrés géométriques du cahier d’activités (Page 16) !',
        actId: 's3_a_color',
        color: '#FB8500'
      },
      {
        id: 'mg_formes',
        title: '🍊 Safari des Formes',
        desc: 'Trouve l’orange ronde et tous les carrés !',
        actId: 's3_a1',
        color: '#FFB703'
      },
      {
        id: 'mg_dominos',
        title: '🥄 Dominos & Cuillères',
        desc: 'Associe 1 et 2 cuillères aux points des dominos !',
        actId: 's2_a2',
        color: '#06D6A0'
      },
      {
        id: 'mg_dedans',
        title: '🧺 Dedans ou Dehors ?',
        desc: 'Range les ballons dedans le panier magique !',
        actId: 's6_a2',
        color: '#7209B7'
      },
      {
        id: 'mg_rythmes',
        title: '🐛 Chenille des Rythmes',
        desc: 'Complète la suite logique de perles et de formes !',
        actId: 's8_a1',
        color: '#F72585'
      },
      {
        id: 'mg_labyrinthe',
        title: '🏫 Labyrinthe de l’École',
        desc: 'Guide Uriel sur le chemin pour arriver à l’école !',
        actId: 's9_a1',
        color: '#4361EE'
      },
      {
        id: 'mg_train',
        title: '🚂 Train des Chiffres (0 à 6)',
        desc: 'Accroche les wagons dans le bon ordre de 0 à 6 !',
        actId: 's22_a1',
        color: '#FB8500'
      },
      {
        id: 'mg_mangues',
        title: '🥭 Compte les Papillons & Mangues',
        desc: 'Touche chaque fruit et papillon pour les compter à voix haute !',
        actId: 's9_a2',
        color: '#2A9D8F'
      },
      {
        id: 'mg_gauche_droite',
        title: '👈 Gauche ou Droite ?',
        desc: 'Repère les petits animaux à gauche ou à droite !',
        actId: 's23_a1',
        color: '#9D4EDD'
      }
    ];

    const container = document.createElement('div');
    container.className = 'curriculum-container';

    const headerNote = document.createElement('div');
    headerNote.className = 'domain-section-card';
    headerNote.innerHTML = `
      <h3>🎮 Salle des Mini-Jeux</h3>
      <p style="font-size: 0.85rem; color: #6C757D; margin-top: 4px;">Accède directement aux jeux préférés d’Uriel pour s’entraîner à volonté !</p>
    `;
    container.appendChild(headerNote);

    const grid = document.createElement('div');
    grid.className = 'activities-scroll-row';

    minigamesList.forEach(mg => {
      const item = document.createElement('div');
      item.className = 'activity-card-item card-interactive';
      item.innerHTML = `
        <div class="activity-top">
          <div class="act-title-text">${mg.title}</div>
        </div>
        <div class="act-instruction-preview">${mg.desc}</div>
        <div class="activity-bottom">
          <span style="font-size: 0.75rem; color: #6C757D;">Entraînement direct</span>
          <button class="btn-play-pill" style="background: ${mg.color}">Jouer 🕹️</button>
        </div>
      `;

      item.onclick = () => {
        sounds.playPop();
        let targetAct = null;
        WEEKS.forEach(w => {
          const found = w.activities.find(a => a.id === mg.actId);
          if (found) targetAct = found;
        });
        if (targetAct) this.launchActivity(targetAct);
      };

      grid.appendChild(item);
    });

    container.appendChild(grid);
    this.mainContent.appendChild(container);
  }

  renderBadgesView() {
    const container = document.createElement('div');
    container.className = 'curriculum-container';

    const card = document.createElement('div');
    card.className = 'domain-section-card';
    card.innerHTML = `
      <div class="domain-header">
        <div class="domain-icon-circle" style="background: #FFD166; color: #5C3D00;">🏆</div>
        <div class="domain-info">
          <h3>Galerie des Trophées d’Uriel</h3>
          <p>Gagne des activités pour collectionner toutes les médailles !</p>
        </div>
      </div>
      <div class="badges-grid">
        ${state.data.badges.map(b => `
          <div class="badge-item ${b.unlocked ? 'is-unlocked' : 'is-locked'}">
            <span class="badge-icon">${b.icon}</span>
            <div class="badge-info">
              <strong>${b.title}</strong>
              <p>${b.desc}</p>
              <span class="badge-status" style="color: ${b.unlocked ? '#06D6A0' : '#ADB5BD'}">
                ${b.unlocked ? '✅ Remporté !' : '🔒 À débloquer'}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(card);
    this.mainContent.appendChild(container);
  }

  launchActivity(activity) {
    if (activity.type === 'coloring') {
      this.closeGameView();
      this.currentView = 'coloriage';
      document.querySelectorAll('.view-tab-btn').forEach(b => b.classList.toggle('is-active', b.dataset.view === 'coloriage'));
      this.coloringStudio.show(activity.drawingIndex || 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.activeActivity = activity;
    this.greetingBanner.style.display = 'none';
    this.mainContent.style.display = 'none';
    this.gameContainer.style.display = 'flex';

    // Add back button on top of game
    const topBackBar = document.createElement('div');
    topBackBar.style.padding = '8px 14px';
    topBackBar.style.background = '#F8F9FA';
    topBackBar.style.borderBottom = '1px solid #E9ECEF';
    topBackBar.innerHTML = `
      <button class="btn-bounce" id="btn-back-menu" style="background: #E9ECEF; color: #333; padding: 6px 14px; font-size: 0.85rem;">
        ◀ Retour au menu
      </button>
    `;
    this.gameContainer.prepend(topBackBar);

    topBackBar.querySelector('#btn-back-menu').onclick = () => {
      sounds.playPop();
      sounds.stopSpeech();
      this.closeGameView();
    };

    this.gameEngine.startActivity(activity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeGameView() {
    this.activeActivity = null;
    this.gameContainer.style.display = 'none';
    this.gameContainer.innerHTML = '';
    this.greetingBanner.style.display = 'flex';
    this.mainContent.style.display = 'block';
    this.updateHeader();
  }

  handleActivityComplete(activity) {
    this.updateHeader();
    this.closeGameView();
    this.renderCurrentView();
  }
}

// Boot up app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

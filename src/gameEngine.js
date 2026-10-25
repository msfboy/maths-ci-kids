// Interactive Game Engines for Kindergarten Maths CI
import confetti from 'canvas-confetti';
import { sounds } from './audio.js';
import { state } from './state.js';

export class GameEngine {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.currentActivity = null;
    this.roundIndex = 0;
  }

  startActivity(activity) {
    this.currentActivity = activity;
    this.roundIndex = 0;
    this.render();
  }

  celebrateSuccess(stars = 3, message = 'Bravo champion !') {
    sounds.playFanfare();
    sounds.speak(message);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    state.addStars(this.currentActivity.id, stars);

    const winModal = document.createElement('div');
    winModal.className = 'win-modal-overlay animate-pop';
    winModal.innerHTML = `
      <div class="win-card">
        <div class="star-burst">
          <span class="star-icon">⭐</span>
          <span class="star-icon big">⭐</span>
          <span class="star-icon">⭐</span>
        </div>
        <h2 class="win-title">${message}</h2>
        <p class="win-subtitle">Tu as gagné ${stars} étoiles dorées !</p>
        <button class="btn-bounce btn-big btn-primary" id="btn-next-act">
          Continuer 🚀
        </button>
      </div>
    `;

    this.container.appendChild(winModal);
    winModal.querySelector('#btn-next-act').onclick = () => {
      winModal.remove();
      if (this.onComplete) this.onComplete(this.currentActivity);
    };
  }

  render() {
    this.container.innerHTML = '';
    const act = this.currentActivity;
    if (!act) return;

    // Header with Speaker & Instruction
    const header = document.createElement('div');
    header.className = 'game-header-bar';
    header.innerHTML = `
      <div class="activity-meta">
        <span class="book-badge">📖 ${act.bookRef || 'Livre CI'}</span>
        <h3 class="game-activity-title">${act.title}</h3>
      </div>
      <button class="speaker-btn animate-pulse-gentle" id="btn-speak-instruction" aria-label="Écouter la consigne">
        <span class="speaker-icon">🔊</span>
        <span class="speaker-text">Écouter</span>
      </button>
    `;
    this.container.appendChild(header);

    const speakBtn = header.querySelector('#btn-speak-instruction');
    const instructionText = act.audioVoice || act.instruction;
    speakBtn.onclick = () => {
      sounds.playPop();
      sounds.speak(instructionText);
    };

    // Auto-speak instruction on start for preschool kids!
    setTimeout(() => {
      sounds.speak(instructionText);
    }, 450);

    // Instruction banner
    const banner = document.createElement('div');
    banner.className = 'game-instruction-banner';
    banner.innerHTML = `<p>${act.instruction}</p>`;
    this.container.appendChild(banner);

    // Main Game Arena
    const arena = document.createElement('div');
    arena.className = 'game-arena';
    this.container.appendChild(arena);

    // Dispatch by activity type
    switch (act.type) {
      case 'quantity_compare':
        this.renderQuantityCompare(arena);
        break;
      case 'color_match':
        this.renderColorMatch(arena);
        break;
      case 'shape_identify':
        this.renderShapeIdentify(arena);
        break;
      case 'number_associate':
        this.renderNumberAssociate(arena);
        break;
      case 'in_out':
        this.renderInOut(arena);
        break;
      case 'pattern_complete':
        this.renderPatternComplete(arena);
        break;
      case 'touch_count':
      case 'harvest_count':
        this.renderCountGame(arena);
        break;
      case 'maze_game':
        this.renderMazeGame(arena);
        break;
      case 'number_train':
        this.renderNumberTrain(arena);
        break;
      case 'left_right':
        this.renderLeftRight(arena);
        break;
      default:
        this.renderFallbackGame(arena);
    }
  }

  // 1. QUANTITY COMPARE (Page 13: Bonbons & Tomates)
  renderQuantityCompare(arena) {
    const act = this.currentActivity;
    const round = act.rounds[this.roundIndex];
    if (!round) {
      this.celebrateSuccess(3, 'Superbe ! Tu sais comparer les quantités !');
      return;
    }

    const questionBox = document.createElement('div');
    questionBox.className = 'round-question-box';
    questionBox.innerHTML = `
      <div class="round-counter">Étape ${this.roundIndex + 1} / ${act.rounds.length}</div>
      <h4 class="round-prompt">${round.question}</h4>
    `;
    arena.appendChild(questionBox);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'quantity-options-grid';

    round.options.forEach(opt => {
      const card = document.createElement('div');
      card.className = 'quantity-card card-interactive';
      
      // Render the actual items inside the basket/pile
      let itemsHtml = '';
      for (let i = 0; i < opt.count; i++) {
        const delay = (i * 0.04).toFixed(2);
        itemsHtml += `<span class="pile-item" style="animation-delay: ${delay}s">${opt.icon}</span>`;
      }

      card.innerHTML = `
        <div class="quantity-container ${opt.count > 6 ? 'many-box' : 'few-box'}">
          <div class="items-cluster">
            ${itemsHtml}
          </div>
        </div>
        <div class="card-caption">${opt.count > 6 ? 'Un gros tas' : 'Un petit tas'}</div>
      `;

      card.onclick = () => {
        if (opt.isCorrect) {
          card.classList.add('correct-glow');
          sounds.playSuccess();
          sounds.speak(round.target === 'few' ? 'Bravo ! C’est bien le tas où il y a PEU !' : 'Super ! C’est bien le panier avec BEAUCOUP !');
          setTimeout(() => {
            this.roundIndex++;
            this.render();
          }, 1400);
        } else {
          card.classList.add('shake-error');
          sounds.playTryAgain();
          sounds.speak(round.target === 'few' ? 'Non, regarde bien où il y en a le moins !' : 'Non, cherche où il y en a le plus !');
          setTimeout(() => card.classList.remove('shake-error'), 800);
        }
      };

      optionsGrid.appendChild(card);
    });

    arena.appendChild(optionsGrid);
  }

  // 2. COLOR MATCH (Page 12: Relier objets de même couleur)
  renderColorMatch(arena) {
    const act = this.currentActivity;
    const pairs = act.data.pairs;
    let selectedLeft = null;
    let matchedCount = 0;

    const matchArena = document.createElement('div');
    matchArena.className = 'color-match-grid';

    const leftCol = document.createElement('div');
    leftCol.className = 'match-col';
    const rightCol = document.createElement('div');
    rightCol.className = 'match-col';

    // Left items
    pairs.forEach(p => {
      const item = document.createElement('button');
      item.className = 'color-match-card card-interactive';
      item.dataset.color = p.color;
      item.innerHTML = `
        <span class="match-icon" style="background-color: ${p.hex}22; border: 3px solid ${p.hex}">${p.icon}</span>
        <span class="match-label" style="color: ${p.hex}">${p.label}</span>
      `;

      item.onclick = () => {
        if (item.classList.contains('is-matched')) return;
        sounds.playPop();
        leftCol.querySelectorAll('.color-match-card').forEach(c => c.classList.remove('is-selected'));
        item.classList.add('is-selected');
        selectedLeft = p;
        sounds.speak(p.color);
      };
      leftCol.appendChild(item);
    });

    // Right items (shuffled)
    const shuffledRight = [...pairs].sort(() => 0.5 - Math.random());
    shuffledRight.forEach(p => {
      const item = document.createElement('button');
      item.className = 'color-match-card card-interactive';
      item.dataset.color = p.color;
      item.innerHTML = `
        <span class="match-icon" style="background-color: ${p.targetHex}22; border: 3px solid ${p.targetHex}">${p.targetIcon}</span>
        <span class="match-label" style="color: ${p.targetHex}">Même couleur</span>
      `;

      item.onclick = () => {
        if (item.classList.contains('is-matched')) return;
        if (!selectedLeft) {
          sounds.playPop();
          sounds.speak('Touche d’abord un objet à gauche !');
          return;
        }

        if (selectedLeft.color === p.color) {
          // Success match
          item.classList.add('is-matched');
          const leftBtn = leftCol.querySelector(`[data-color="${p.color}"]`);
          if (leftBtn) leftBtn.classList.add('is-matched');
          sounds.playSuccess();
          sounds.speak(`Bravo ! La couleur ${p.color} !`);
          matchedCount++;
          selectedLeft = null;

          if (matchedCount === pairs.length) {
            setTimeout(() => {
              this.celebrateSuccess(3, 'Champion des Couleurs !');
            }, 1000);
          }
        } else {
          item.classList.add('shake-error');
          sounds.playTryAgain();
          sounds.speak('Ce n’est pas la même couleur, réessaie !');
          setTimeout(() => item.classList.remove('shake-error'), 800);
        }
      };
      rightCol.appendChild(item);
    });

    matchArena.appendChild(leftCol);
    matchArena.appendChild(rightCol);
    arena.appendChild(matchArena);
  }

  // 3. SHAPE IDENTIFY (Page 16: Papaye, Orange ronde, Banane & Carrés)
  renderShapeIdentify(arena) {
    const act = this.currentActivity;
    const round = act.rounds[this.roundIndex];
    if (!round) {
      this.celebrateSuccess(3, 'Magnifique ! Tu connais les formes !');
      return;
    }

    const questionBox = document.createElement('div');
    questionBox.className = 'round-question-box';
    questionBox.innerHTML = `
      <div class="round-counter">Étape ${this.roundIndex + 1} / ${act.rounds.length}</div>
      <h4 class="round-prompt">${round.question}</h4>
    `;
    arena.appendChild(questionBox);

    if (round.multi) {
      // Multiple selection (e.g. Find all squares)
      const grid = document.createElement('div');
      grid.className = 'shapes-grid';
      let foundTargets = 0;
      const totalTargets = round.shapes.filter(s => s.isTarget).length;

      round.shapes.forEach(sh => {
        const shapeCard = document.createElement('button');
        shapeCard.className = `shape-item-btn shape-${sh.type}`;
        
        let shapeVisual = sh.type === 'carre' 
          ? '<div class="geom-square"></div>'
          : '<div class="geom-circle"></div>';

        shapeCard.innerHTML = `
          ${shapeVisual}
          <span class="shape-name">${sh.label}</span>
        `;

        shapeCard.onclick = () => {
          if (shapeCard.classList.contains('found')) return;
          if (sh.isTarget) {
            shapeCard.classList.add('found', 'correct-glow');
            sounds.playSuccess();
            foundTargets++;
            sounds.speak('Bravo ! Un carré !');

            if (foundTargets === totalTargets) {
              setTimeout(() => {
                this.roundIndex++;
                this.render();
              }, 1200);
            }
          } else {
            shapeCard.classList.add('shake-error');
            sounds.playTryAgain();
            sounds.speak('Ce n’est pas un carré, c’est un rond ! Touche les carrés !');
            setTimeout(() => shapeCard.classList.remove('shake-error'), 700);
          }
        };
        grid.appendChild(shapeCard);
      });
      arena.appendChild(grid);
    } else {
      // Single choice (e.g. Which fruit is round?)
      const grid = document.createElement('div');
      grid.className = 'fruit-shapes-grid';

      round.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'fruit-choice-btn card-interactive';
        btn.innerHTML = `
          <span class="fruit-emoji">${opt.icon}</span>
          <span class="fruit-label">${opt.label}</span>
        `;

        btn.onclick = () => {
          if (opt.isCorrect) {
            btn.classList.add('correct-glow');
            sounds.playSuccess();
            sounds.speak('Oui ! L’orange est toute ronde comme un ballon !');
            setTimeout(() => {
              this.roundIndex++;
              this.render();
            }, 1400);
          } else {
            btn.classList.add('shake-error');
            sounds.playTryAgain();
            sounds.speak('Regarde bien, ce fruit n’est pas rond ! Trouve l’orange ronde !');
            setTimeout(() => btn.classList.remove('shake-error'), 800);
          }
        };
        grid.appendChild(btn);
      });
      arena.appendChild(grid);
    }
  }

  // 4. NUMBER ASSOCIATE (Page 15: 1 ou 2 cuillères, chaussures, ballon & dominos)
  renderNumberAssociate(arena) {
    const act = this.currentActivity;
    const q = act.questions[this.roundIndex];
    if (!q) {
      this.celebrateSuccess(3, 'Bravo ! Tu sais compter 1 et 2 !');
      return;
    }

    const box = document.createElement('div');
    box.className = 'number-assoc-box';
    box.innerHTML = `
      <div class="round-counter">Question ${this.roundIndex + 1} / ${act.questions.length}</div>
      <div class="object-display-area animate-pop">
        <div class="objects-row">
          ${q.objects.map(o => `<span class="single-obj">${o.icon}</span>`).join('')}
        </div>
        <div class="object-label-hint">${q.label}</div>
      </div>
      <p class="domino-instruction">Touche le bon domino de points :</p>
      <div class="dominos-row">
        <button class="domino-btn card-interactive" data-val="1">
          <div class="domino-card">
            <span class="domino-dot"></span>
          </div>
          <span class="domino-num">1</span>
        </button>
        <button class="domino-btn card-interactive" data-val="2">
          <div class="domino-card two-dots">
            <span class="domino-dot"></span>
            <span class="domino-dot"></span>
          </div>
          <span class="domino-num">2</span>
        </button>
      </div>
    `;

    box.querySelectorAll('.domino-btn').forEach(btn => {
      btn.onclick = () => {
        const val = parseInt(btn.dataset.val, 10);
        if (val === q.count) {
          btn.classList.add('correct-glow');
          sounds.playSuccess();
          sounds.speak(val === 1 ? 'Bravo ! Un seul objet, un seul point !' : 'Super ! Deux objets, deux points !');
          setTimeout(() => {
            this.roundIndex++;
            this.render();
          }, 1300);
        } else {
          btn.classList.add('shake-error');
          sounds.playTryAgain();
          sounds.speak(`Compte bien ! Il y a ${q.count} objet${q.count > 1 ? 's' : ''} !`);
          setTimeout(() => btn.classList.remove('shake-error'), 800);
        }
      };
    });

    arena.appendChild(box);
  }

  // 5. IN / OUT (Page 25: Dedans ou Dehors)
  renderInOut(arena) {
    const act = this.currentActivity;
    let insideCount = 0;
    const required = act.requiredInCount || 3;

    const gameDiv = document.createElement('div');
    gameDiv.className = 'in-out-arena';
    gameDiv.innerHTML = `
      <div class="in-out-status">
        <span class="goal-text">🎯 Mets ${required} balles <strong>DEDANS</strong> le panier !</span>
        <div class="basket-counter-badge" id="in-counter">${insideCount} / ${required} dedans</div>
      </div>
      
      <div class="in-out-playground">
        <div class="basket-zone" id="basket-target">
          <div class="basket-rim">🧺 LE PANIER</div>
          <div class="basket-interior" id="basket-inside"></div>
        </div>

        <div class="outside-zone">
          <div class="outside-label">🌳 DEHORS</div>
          <div class="balls-outside" id="balls-container"></div>
        </div>
      </div>
    `;

    const ballsContainer = gameDiv.querySelector('#balls-container');
    const basketInside = gameDiv.querySelector('#basket-inside');
    const counterBadge = gameDiv.querySelector('#in-counter');

    for (let i = 1; i <= 4; i++) {
      const ball = document.createElement('button');
      ball.className = 'draggable-ball card-interactive';
      ball.innerHTML = `⚽`;
      ball.title = 'Touche pour mettre dedans !';

      ball.onclick = () => {
        if (ball.classList.contains('is-inside')) return;
        ball.classList.add('is-inside', 'animate-jump');
        insideCount++;
        sounds.playPop();
        sounds.playCount(insideCount);
        sounds.speak(`${insideCount} dedans !`);
        
        basketInside.appendChild(ball);
        counterBadge.textContent = `${insideCount} / ${required} dedans`;

        if (insideCount >= required) {
          setTimeout(() => {
            this.celebrateSuccess(3, 'Bravo ! Toutes les balles sont DEDANS !');
          }, 900);
        }
      };

      ballsContainer.appendChild(ball);
    }

    arena.appendChild(gameDiv);
  }

  // 6. PATTERN COMPLETE (Page 28: La Chenille des Rythmes)
  renderPatternComplete(arena) {
    const act = this.currentActivity;
    const pattern = act.patterns[this.roundIndex];
    if (!pattern) {
      this.celebrateSuccess(3, 'Génie des Algorithmes et des Rythmes !');
      return;
    }

    const box = document.createElement('div');
    box.className = 'pattern-game-box';
    box.innerHTML = `
      <div class="round-counter">Rythme ${this.roundIndex + 1} / ${act.patterns.length}</div>
      <div class="caterpillar-container">
        <div class="caterpillar-head">🐛</div>
        <div class="caterpillar-body">
          ${pattern.sequence.map(item => `<div class="caterpillar-segment">${item}</div>`).join('')}
          <div class="caterpillar-segment target-slot">❓</div>
        </div>
      </div>
      <p class="pattern-prompt-text">${pattern.prompt}</p>
      <div class="pattern-options-row">
        ${pattern.options.map(opt => `
          <button class="pattern-choice-btn card-interactive" data-val="${opt}">${opt}</button>
        `).join('')}
      </div>
    `;

    box.querySelectorAll('.pattern-choice-btn').forEach(btn => {
      btn.onclick = () => {
        const val = btn.dataset.val;
        if (val === pattern.missing) {
          const slot = box.querySelector('.target-slot');
          slot.textContent = val;
          slot.classList.add('slot-filled', 'correct-glow');
          sounds.playSuccess();
          sounds.speak('Super ! Tu as trouvé la bonne suite logique !');
          setTimeout(() => {
            this.roundIndex++;
            this.render();
          }, 1300);
        } else {
          btn.classList.add('shake-error');
          sounds.playTryAgain();
          sounds.speak('Écoute bien le rythme et réessaie !');
          setTimeout(() => btn.classList.remove('shake-error'), 800);
        }
      };
    });

    arena.appendChild(box);
  }

  // 7. COUNT GAME (Page 30 & 73: Papillons & Mangues)
  renderCountGame(arena) {
    const act = this.currentActivity;
    const target = act.targetCount || 4;
    const icon = act.itemIcon || '🦋';
    let currentCount = 0;

    const countBox = document.createElement('div');
    countBox.className = 'count-game-box';
    countBox.innerHTML = `
      <div class="count-counter-display">
        <span class="count-number-big" id="current-count-num">0</span>
        <span class="count-target-text">sur ${target} ${act.itemName || 'objets'}</span>
      </div>
      <div class="items-to-count-grid" id="items-grid"></div>
    `;

    const grid = countBox.querySelector('#items-grid');
    const displayNum = countBox.querySelector('#current-count-num');

    for (let i = 1; i <= target; i++) {
      const itemBtn = document.createElement('button');
      itemBtn.className = 'countable-item-btn card-interactive';
      itemBtn.innerHTML = `
        <span class="count-item-icon">${icon}</span>
        <span class="count-badge hidden"></span>
      `;

      itemBtn.onclick = () => {
        if (itemBtn.classList.contains('counted')) return;
        currentCount++;
        itemBtn.classList.add('counted');
        
        const badge = itemBtn.querySelector('.count-badge');
        badge.textContent = currentCount;
        badge.classList.remove('hidden');

        displayNum.textContent = currentCount;
        sounds.playCount(currentCount);
        sounds.speak(`${currentCount} !`);

        if (currentCount === target) {
          setTimeout(() => {
            this.celebrateSuccess(3, `Félicitations ! Tu as compté jusqu’à ${target} !`);
          }, 1000);
        }
      };

      grid.appendChild(itemBtn);
    }

    arena.appendChild(countBox);
  }

  // 8. MAZE GAME (Page 31: Le Labyrinthe vers l'école)
  renderMazeGame(arena) {
    // 4x4 Grid maze
    const size = 4;
    let playerPos = { r: 0, c: 0 };
    const goalPos = { r: 3, c: 3 };
    const walls = ['0,2', '1,0', '2,2', '3,1'];

    const mazeBox = document.createElement('div');
    mazeBox.className = 'maze-game-box';
    mazeBox.innerHTML = `
      <div class="maze-header">
        <span>🏠 Maison d’Uriel</span>
        <span>➡️</span>
        <span>🏫 École Primaire</span>
      </div>
      <div class="maze-grid" id="maze-grid"></div>
      <div class="maze-controls">
        <button class="maze-btn" data-dir="up">⬆️</button>
        <div class="maze-ctrl-row">
          <button class="maze-btn" data-dir="left">⬅️</button>
          <button class="maze-btn" data-dir="down">⬇️</button>
          <button class="maze-btn" data-dir="right">➡️</button>
        </div>
      </div>
    `;

    const gridEl = mazeBox.querySelector('#maze-grid');

    const updateGrid = () => {
      gridEl.innerHTML = '';
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const cell = document.createElement('div');
          cell.className = 'maze-cell';
          const key = `${r},${c}`;

          if (r === playerPos.r && c === playerPos.c) {
            cell.classList.add('player-cell');
            cell.innerHTML = '🎒'; // Uriel's backpack
          } else if (r === goalPos.r && c === goalPos.c) {
            cell.classList.add('goal-cell');
            cell.innerHTML = '🏫';
          } else if (walls.includes(key)) {
            cell.classList.add('wall-cell');
            cell.innerHTML = '🧱';
          } else {
            cell.classList.add('path-cell');
            cell.innerHTML = '🐾';
          }
          gridEl.appendChild(cell);
        }
      }
    };

    const movePlayer = (dr, dc) => {
      const nr = playerPos.r + dr;
      const nc = playerPos.c + dc;
      if (nr < 0 || nr >= size || nc < 0 || nc >= size) return;
      if (walls.includes(`${nr},${nc}`)) {
        sounds.playTryAgain();
        sounds.speak('Attention, il y a un mur ! Prends un autre chemin !');
        return;
      }

      playerPos = { r: nr, c: nc };
      sounds.playPop();
      updateGrid();

      if (playerPos.r === goalPos.r && playerPos.c === goalPos.c) {
        setTimeout(() => {
          this.celebrateSuccess(3, 'Bravo ! Tu es arrivé à l’école à l’heure !');
        }, 600);
      }
    };

    mazeBox.querySelectorAll('.maze-btn').forEach(btn => {
      btn.onclick = () => {
        const dir = btn.dataset.dir;
        if (dir === 'up') movePlayer(-1, 0);
        if (dir === 'down') movePlayer(1, 0);
        if (dir === 'left') movePlayer(0, -1);
        if (dir === 'right') movePlayer(0, 1);
      };
    });

    updateGrid();
    arena.appendChild(mazeBox);
  }

  // 9. NUMBER TRAIN (Page 72: Les nombres 0 à 6)
  renderNumberTrain(arena) {
    const numbers = [0, 1, 2, 3, 4, 5, 6];
    let nextNeeded = 0;

    const box = document.createElement('div');
    box.className = 'train-game-box';
    box.innerHTML = `
      <div class="train-track-area">
        <div class="train-locomotive">🚂</div>
        <div class="train-wagons" id="wagons-slot"></div>
      </div>
      <p class="train-prompt-text">Touche le chiffre suivant dans l’ordre :</p>
      <div class="train-numbers-deck" id="numbers-deck"></div>
    `;

    const wagonsSlot = box.querySelector('#wagons-slot');
    const deck = box.querySelector('#numbers-deck');

    // Shuffle deck
    const shuffled = [...numbers].sort(() => 0.5 - Math.random());
    shuffled.forEach(num => {
      const numBtn = document.createElement('button');
      numBtn.className = 'train-num-btn card-interactive';
      numBtn.dataset.val = num;
      numBtn.textContent = num;

      numBtn.onclick = () => {
        if (numBtn.classList.contains('placed')) return;
        if (num === nextNeeded) {
          numBtn.classList.add('placed');
          sounds.playSuccess();
          sounds.playCount(nextNeeded + 1);
          sounds.speak(`${nextNeeded} !`);

          const wagon = document.createElement('div');
          wagon.className = 'train-wagon-car animate-jump';
          wagon.innerHTML = `<span>🚃</span><strong>${num}</strong>`;
          wagonsSlot.appendChild(wagon);

          nextNeeded++;

          if (nextNeeded > 6) {
            setTimeout(() => {
              this.celebrateSuccess(3, 'En route ! Le train des chiffres 0 à 6 est complet !');
            }, 900);
          }
        } else {
          numBtn.classList.add('shake-error');
          sounds.playTryAgain();
          sounds.speak(`Cherche le chiffre ${nextNeeded} !`);
          setTimeout(() => numBtn.classList.remove('shake-error'), 800);
        }
      };

      deck.appendChild(numBtn);
    });

    arena.appendChild(box);
  }

  // 10. LEFT / RIGHT (Page 74: Gauche et Droite)
  renderLeftRight(arena) {
    const rounds = [
      { target: 'left', prompt: 'Touche le lion à GAUCHE !', leftIcon: '🦁', rightIcon: '🐵' },
      { target: 'right', prompt: 'Touche le singe à DROITE !', leftIcon: '🐱', rightIcon: '🐵' },
      { target: 'left', prompt: 'Touche le petit oiseau à GAUCHE !', leftIcon: '🦜', rightIcon: '🐰' }
    ];

    const currentR = rounds[this.roundIndex % rounds.length];

    const box = document.createElement('div');
    box.className = 'left-right-box';
    box.innerHTML = `
      <div class="round-counter">Étape ${this.roundIndex + 1} / ${rounds.length}</div>
      <h4 class="round-prompt">${currentR.prompt}</h4>
      <div class="left-right-stage">
        <button class="side-btn card-interactive" id="btn-left">
          <span class="side-tag">👈 GAUCHE</span>
          <span class="side-icon">${currentR.leftIcon}</span>
        </button>
        <button class="side-btn card-interactive" id="btn-right">
          <span class="side-tag">DROITE 👉</span>
          <span class="side-icon">${currentR.rightIcon}</span>
        </button>
      </div>
    `;

    const handleChoice = (chosenSide, btnEl) => {
      if (chosenSide === currentR.target) {
        btnEl.classList.add('correct-glow');
        sounds.playSuccess();
        sounds.speak(`Excellent ! C’est bien à ${chosenSide === 'left' ? 'gauche' : 'droite'} !`);
        this.roundIndex++;
        if (this.roundIndex >= rounds.length) {
          setTimeout(() => {
            this.celebrateSuccess(3, 'Champion de la Gauche et de la Droite !');
          }, 1200);
        } else {
          setTimeout(() => this.render(), 1300);
        }
      } else {
        btnEl.classList.add('shake-error');
        sounds.playTryAgain();
        sounds.speak(`Non, ça c’est à ${chosenSide === 'left' ? 'gauche' : 'droite'} ! Cherche de l’autre côté !`);
        setTimeout(() => btnEl.classList.remove('shake-error'), 800);
      }
    };

    box.querySelector('#btn-left').onclick = (e) => handleChoice('left', box.querySelector('#btn-left'));
    box.querySelector('#btn-right').onclick = (e) => handleChoice('right', box.querySelector('#btn-right'));

    arena.appendChild(box);
  }

  // Fallback interactive game
  renderFallbackGame(arena) {
    const act = this.currentActivity;
    arena.innerHTML = `
      <div class="fallback-card">
        <h4>${act.title}</h4>
        <p>${act.instruction}</p>
        <button class="btn-bounce btn-primary" id="btn-fallback-finish">
          J'ai compris ! ⭐
        </button>
      </div>
    `;
    arena.querySelector('#btn-fallback-finish').onclick = () => {
      this.celebrateSuccess(2, 'Bien joué !');
    };
  }
}

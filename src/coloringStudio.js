// Magic Coloring Studio for Preschool Kids (Maths CI)
import confetti from 'canvas-confetti';
import { sounds } from './audio.js';
import { state } from './state.js';

export class ColoringStudio {
  constructor(container, onBack) {
    this.container = container;
    this.onBack = onBack;
    this.currentColor = '#E63946'; // Red default
    this.currentTool = 'fill'; // 'fill' (tap to color) or 'brush' (free finger draw)
    this.brushSize = 14;
    this.activeDrawingIndex = 0;

    this.palette = [
      { name: 'Rouge', hex: '#E63946', emoji: '🔴' },
      { name: 'Bleu', hex: '#1D3557', emoji: '🔵' },
      { name: 'Bleu Ciel', hex: '#4EA8DE', emoji: '💧' },
      { name: 'Jaune', hex: '#FFB703', emoji: '🟡' },
      { name: 'Vert', hex: '#06D6A0', emoji: '🟢' },
      { name: 'Orange', hex: '#FB8500', emoji: '🟠' },
      { name: 'Violet', hex: '#7209B7', emoji: '🟣' },
      { name: 'Rose', hex: '#FF70A6', emoji: '🌸' },
      { name: 'Gomme', hex: '#FFFFFF', emoji: '🧽', isEraser: true }
    ];

    this.drawings = [
      {
        id: 'ball_cup',
        title: 'Le Ballon & La Tasse',
        bookRef: 'Livre CI - Page 12',
        instruction: 'Colorie le ballon en bleu et la tasse en rouge comme dans ton livre !',
        audioVoice: 'Colorie le ballon en bleu et la tasse en rouge ! Touche une couleur puis touche le dessin !',
        renderSvg: () => this.getBallAndCupSvg()
      },
      {
        id: 'shapes_color',
        title: 'Colorie les Carrés',
        bookRef: 'Livre CI - Page 16',
        instruction: 'Trouve les carrés et colorie-les avec ta couleur préférée !',
        audioVoice: 'Regarde bien les formes géométriques ! Trouve tous les carrés et colorie-les !',
        renderSvg: () => this.getShapesSvg()
      },
      {
        id: 'butterfly_flower',
        title: 'Le Papillon & La Jolie Fleur',
        bookRef: 'Livre CI - Page 12',
        instruction: 'Mets de magnifiques couleurs sur les ailes du papillon et les pétales !',
        audioVoice: 'Donne de belles couleurs vives aux ailes du papillon et à la fleur tropicale !',
        renderSvg: () => this.getButterflySvg()
      },
      {
        id: 'school_flag',
        title: 'L’École & Le Drapeau',
        bookRef: 'Livre CI - Page 17',
        instruction: 'Colorie l’école d’Uriel et le drapeau national !',
        audioVoice: 'Colorie la cour de l’école et le beau drapeau national !',
        renderSvg: () => this.getSchoolSvg()
      }
    ];
  }

  show(drawingIndex = 0) {
    this.activeDrawingIndex = drawingIndex;
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    const drawing = this.drawings[this.activeDrawingIndex];

    const studioDiv = document.createElement('div');
    studioDiv.className = 'coloring-studio-wrapper animate-pop';

    studioDiv.innerHTML = `
      <!-- Top Bar -->
      <div class="coloring-header-bar">
        <div class="coloring-header-left">
          <button class="btn-bounce btn-nav-back" id="btn-back-coloring">
            ◀ Retour
          </button>
          <div class="coloring-title-meta">
            <span class="book-badge">🎨 ${drawing.bookRef}</span>
            <h3 class="coloring-main-title">${drawing.title}</h3>
          </div>
        </div>

        <div class="coloring-header-actions">
          <button class="speaker-btn animate-pulse-gentle" id="btn-coloring-speak">
            🔊 Écouter
          </button>
          <button class="btn-bounce btn-primary" id="btn-finish-coloring">
            Terminé ! ⭐
          </button>
        </div>
      </div>

      <!-- Drawing Selector Carousel -->
      <div class="drawing-thumbnails-bar">
        ${this.drawings.map((d, idx) => `
          <button class="drawing-thumb-btn ${idx === this.activeDrawingIndex ? 'is-selected' : ''}" data-idx="${idx}">
            <span>${d.title}</span>
          </button>
        `).join('')}
      </div>

      <!-- Instruction banner -->
      <div class="game-instruction-banner">
        <p>${drawing.instruction}</p>
      </div>

      <!-- Canvas / SVG Area -->
      <div class="coloring-stage">
        <div class="svg-drawing-container" id="svg-drawing-container">
          ${drawing.renderSvg()}
        </div>
      </div>

      <!-- Color Palette & Tools Bar -->
      <div class="coloring-tools-bar">
        <!-- Tool Switcher -->
        <div class="tool-switch-group">
          <button class="tool-btn ${this.currentTool === 'fill' ? 'is-active' : ''}" id="tool-fill" title="Remplissage Magique au toucher">
            <span class="tool-icon">🪣</span>
            <span class="tool-label">Magique</span>
          </button>
          <button class="tool-btn ${this.currentTool === 'brush' ? 'is-active' : ''}" id="tool-brush" title="Pinceau libre au doigt">
            <span class="tool-icon">🖌️</span>
            <span class="tool-label">Pinceau</span>
          </button>
          <button class="tool-btn" id="tool-clear" title="Recommencer">
            <span class="tool-icon">🔄</span>
            <span class="tool-label">Effacer</span>
          </button>
        </div>

        <!-- Color Swatches -->
        <div class="palette-swatches">
          ${this.palette.map(p => `
            <button class="color-swatch-btn ${p.hex === this.currentColor ? 'is-selected' : ''}" 
                    data-hex="${p.hex}" 
                    data-name="${p.name}" 
                    style="background-color: ${p.hex};"
                    title="${p.name}">
              ${p.isEraser ? '🧽' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.container.appendChild(studioDiv);

    // Auto voice prompt
    setTimeout(() => {
      sounds.speak(drawing.audioVoice);
    }, 400);

    // Event Listeners
    studioDiv.querySelector('#btn-back-coloring').onclick = () => {
      sounds.playPop();
      sounds.stopSpeech();
      if (this.onBack) this.onBack();
    };

    studioDiv.querySelector('#btn-coloring-speak').onclick = () => {
      sounds.playPop();
      sounds.speak(drawing.audioVoice);
    };

    studioDiv.querySelector('#btn-finish-coloring').onclick = () => {
      sounds.playFanfare();
      sounds.speak(`Bravo Uriel ! C’est un magnifique chef d’œuvre digne d’un vrai artiste !`);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      state.addStars('coloring_' + drawing.id, 3);
    };

    // Thumbnail switches
    studioDiv.querySelectorAll('.drawing-thumb-btn').forEach(btn => {
      btn.onclick = () => {
        sounds.playPop();
        const idx = parseInt(btn.dataset.idx, 10);
        this.activeDrawingIndex = idx;
        this.render();
      };
    });

    // Tool switcher
    const fillBtn = studioDiv.querySelector('#tool-fill');
    const brushBtn = studioDiv.querySelector('#tool-brush');
    const clearBtn = studioDiv.querySelector('#tool-clear');

    fillBtn.onclick = () => {
      sounds.playPop();
      this.currentTool = 'fill';
      fillBtn.classList.add('is-active');
      brushBtn.classList.remove('is-active');
      sounds.speak('Mode magique ! Touche une zone pour la colorier !');
    };

    brushBtn.onclick = () => {
      sounds.playPop();
      this.currentTool = 'brush';
      brushBtn.classList.add('is-active');
      fillBtn.classList.remove('is-active');
      sounds.speak('Mode pinceau ! Glisse ton doigt pour dessiner !');
    };

    clearBtn.onclick = () => {
      sounds.playPop();
      const svgContainer = studioDiv.querySelector('#svg-drawing-container');
      svgContainer.innerHTML = drawing.renderSvg();
      this.attachSvgInteractiveListeners(svgContainer);
      sounds.speak('Feuille toute propre ! Recommençons !');
    };

    // Color Swatches
    studioDiv.querySelectorAll('.color-swatch-btn').forEach(swatch => {
      swatch.onclick = () => {
        sounds.playPop();
        this.currentColor = swatch.dataset.hex;
        sounds.speak(swatch.dataset.name);
        studioDiv.querySelectorAll('.color-swatch-btn').forEach(s => s.classList.remove('is-selected'));
        swatch.classList.add('is-selected');
      };
    });

    // Attach interactive SVG coloring
    const svgContainer = studioDiv.querySelector('#svg-drawing-container');
    this.attachSvgInteractiveListeners(svgContainer);
  }

  attachSvgInteractiveListeners(container) {
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Handle Tap-to-fill on colorable paths and shapes
    const colorableElements = svg.querySelectorAll('.colorable');
    colorableElements.forEach(el => {
      el.addEventListener('pointerdown', (e) => {
        if (this.currentTool === 'fill') {
          e.stopPropagation();
          el.style.fill = this.currentColor;
          el.style.transition = 'fill 0.25s ease';
          sounds.playStar();
        }
      });
    });

    // Free finger drawing with Brush Mode
    let isDrawing = false;
    let currentPath = null;

    const startDraw = (e) => {
      if (this.currentTool !== 'brush') return;
      isDrawing = true;
      const rect = svg.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const scaleX = 600 / rect.width;
      const scaleY = 450 / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      currentPath.setAttribute('d', `M ${x} ${y}`);
      currentPath.setAttribute('stroke', this.currentColor);
      currentPath.setAttribute('stroke-width', this.brushSize);
      currentPath.setAttribute('stroke-linecap', 'round');
      currentPath.setAttribute('stroke-linejoin', 'round');
      currentPath.setAttribute('fill', 'none');
      svg.appendChild(currentPath);
    };

    const moveDraw = (e) => {
      if (!isDrawing || !currentPath || this.currentTool !== 'brush') return;
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const scaleX = 600 / rect.width;
      const scaleY = 450 / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      const d = currentPath.getAttribute('d');
      currentPath.setAttribute('d', `${d} L ${x} ${y}`);
    };

    const endDraw = () => {
      if (isDrawing) {
        sounds.playPop();
      }
      isDrawing = false;
      currentPath = null;
    };

    svg.addEventListener('pointerdown', startDraw);
    svg.addEventListener('pointermove', moveDraw);
    window.addEventListener('pointerup', endDraw);
  }

  // SVG 1 : Ball & Cup (Page 12)
  getBallAndCupSvg() {
    return `
      <svg viewBox="0 0 600 450" class="coloring-svg-canvas">
        <rect width="600" height="450" fill="#FCFCFC" rx="16"/>
        
        <!-- Left: Model Ballon Bleu (Reference) -->
        <g transform="translate(10, 20)">
          <text x="140" y="30" font-family="'Fredoka', sans-serif" font-size="16" font-weight="bold" fill="#1D3557" text-anchor="middle">Ballon Modèle (Bleu)</text>
          <circle cx="140" cy="110" r="60" fill="#1D3557" stroke="#0D1B2A" stroke-width="4"/>
          <polygon points="140,85 160,98 152,122 128,122 120,98" fill="#4EA8DE" stroke="#0D1B2A" stroke-width="3"/>
          <line x1="140" y1="85" x2="140" y2="50" stroke="#0D1B2A" stroke-width="3"/>
          <line x1="160" y1="98" x2="195" y2="85" stroke="#0D1B2A" stroke-width="3"/>
          <line x1="152" y1="122" x2="180" y2="150" stroke="#0D1B2A" stroke-width="3"/>
          <line x1="128" y1="122" x2="100" y2="150" stroke="#0D1B2A" stroke-width="3"/>
          <line x1="120" y1="98" x2="85" y2="85" stroke="#0D1B2A" stroke-width="3"/>
        </g>

        <!-- Right: Soccer Ball to Color (Interactive) -->
        <g transform="translate(10, 210)">
          <text x="140" y="30" font-family="'Fredoka', sans-serif" font-size="18" font-weight="bold" fill="#E63946" text-anchor="middle">🎨 À TOI DE COLORIER !</text>
          <circle cx="140" cy="120" r="70" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <!-- Hexagons to color -->
          <polygon points="140,90 165,105 155,135 125,135 115,105" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>
          <path d="M 140 90 L 140 50" stroke="#2B2D42" stroke-width="4"/>
          <path d="M 165 105 L 205 90" stroke="#2B2D42" stroke-width="4"/>
          <path d="M 155 135 L 185 175" stroke="#2B2D42" stroke-width="4"/>
          <path d="M 125 135 L 95 175" stroke="#2B2D42" stroke-width="4"/>
          <path d="M 115 105 L 75 90" stroke="#2B2D42" stroke-width="4"/>
        </g>

        <!-- Divider Line -->
        <line x1="300" y1="20" x2="300" y2="430" stroke="#E9ECEF" stroke-width="4" stroke-dasharray="10 10"/>

        <!-- Top Right: Model Tasse Rouge -->
        <g transform="translate(320, 20)">
          <text x="130" y="30" font-family="'Fredoka', sans-serif" font-size="16" font-weight="bold" fill="#E63946" text-anchor="middle">Tasse Modèle (Rouge)</text>
          <path d="M 90 60 L 170 60 C 170 120, 155 140, 130 140 C 105 140, 90 120, 90 60 Z" fill="#E63946" stroke="#800F2F" stroke-width="4"/>
          <path d="M 170 75 C 200 75, 200 115, 165 115" fill="none" stroke="#800F2F" stroke-width="6" stroke-linecap="round"/>
        </g>

        <!-- Bottom Right: Tasse to Color (Interactive) -->
        <g transform="translate(320, 210)">
          <text x="130" y="30" font-family="'Fredoka', sans-serif" font-size="18" font-weight="bold" fill="#E63946" text-anchor="middle">🎨 COLORIE EN ROUGE !</text>
          <path d="M 80 65 L 180 65 C 180 145, 160 170, 130 170 C 100 170, 80 145, 80 65 Z" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <path d="M 180 85 C 220 85, 220 135, 175 135" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="7" stroke-linecap="round"/>
          <ellipse cx="130" cy="65" rx="50" ry="12" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>
        </g>
      </svg>
    `;
  }

  // SVG 2 : Geometric Shapes (Page 16: "Je colorie les carrés")
  getShapesSvg() {
    return `
      <svg viewBox="0 0 600 450" class="coloring-svg-canvas">
        <rect width="600" height="450" fill="#FCFCFC" rx="16"/>
        <text x="300" y="45" font-family="'Fredoka', sans-serif" font-size="22" font-weight="bold" fill="#7209B7" text-anchor="middle">
          Trouve et colorie tous les CARRÉS !
        </text>

        <!-- Shape 1: Square (Target) -->
        <g transform="translate(60, 90)">
          <rect x="0" y="0" width="100" height="100" rx="6" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="6"/>
          <text x="50" y="130" font-family="'Fredoka', sans-serif" font-size="16" font-weight="bold" fill="#6C757D" text-anchor="middle">Carré</text>
        </g>

        <!-- Shape 2: Circle (Distractor) -->
        <g transform="translate(200, 90)">
          <circle cx="50" cy="50" r="50" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="6"/>
          <text x="50" y="130" font-family="'Fredoka', sans-serif" font-size="16" font-weight="bold" fill="#6C757D" text-anchor="middle">Rond</text>
        </g>

        <!-- Shape 3: Square (Target) -->
        <g transform="translate(340, 90)">
          <rect x="0" y="0" width="100" height="100" rx="6" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="6"/>
          <text x="50" y="130" font-family="'Fredoka', sans-serif" font-size="16" font-weight="bold" fill="#6C757D" text-anchor="middle">Carré</text>
        </g>

        <!-- Shape 4: Circle (Distractor) -->
        <g transform="translate(480, 90)">
          <circle cx="40" cy="50" r="45" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="6"/>
          <text x="40" y="130" font-family="'Fredoka', sans-serif" font-size="16" font-weight="bold" fill="#6C757D" text-anchor="middle">Rond</text>
        </g>

        <!-- Bottom row: big fun shapes to decorate -->
        <g transform="translate(90, 260)">
          <rect x="0" y="0" width="140" height="140" rx="12" class="colorable" fill="#FFFFFF" stroke="#FF5E7E" stroke-width="6"/>
          <text x="70" y="75" font-family="'Fredoka', sans-serif" font-size="28" font-weight="bold" fill="#FF5E7E" text-anchor="middle">CARRÉ</text>
        </g>

        <g transform="translate(360, 260)">
          <polygon points="70,10 140,140 0,140" class="colorable" fill="#FFFFFF" stroke="#4EA8DE" stroke-width="6"/>
          <text x="70" y="105" font-family="'Fredoka', sans-serif" font-size="24" font-weight="bold" fill="#4EA8DE" text-anchor="middle">TRIANGLE</text>
        </g>
      </svg>
    `;
  }

  // SVG 3 : Butterfly & Flower
  getButterflySvg() {
    return `
      <svg viewBox="0 0 600 450" class="coloring-svg-canvas">
        <rect width="600" height="450" fill="#FCFCFC" rx="16"/>
        <text x="300" y="40" font-family="'Fredoka', sans-serif" font-size="20" font-weight="bold" fill="#06D6A0" text-anchor="middle">
          Papillon & Fleur Tropicale
        </text>

        <!-- Butterfly on Left -->
        <g transform="translate(50, 70)">
          <!-- Wings Left -->
          <path d="M 120 130 C 50 40, 20 100, 50 160 C 10 200, 60 250, 120 200 Z" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <circle cx="75" cy="120" r="15" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>
          <circle cx="75" cy="180" r="10" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>

          <!-- Wings Right -->
          <path d="M 140 130 C 210 40, 240 100, 210 160 C 250 200, 200 250, 140 200 Z" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <circle cx="185" cy="120" r="15" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>
          <circle cx="185" cy="180" r="10" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>

          <!-- Body -->
          <ellipse cx="130" cy="165" rx="12" ry="45" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>
          <circle cx="130" cy="105" r="14" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>
          <!-- Antennae -->
          <path d="M 125 95 C 110 70, 95 75, 95 85" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round"/>
          <path d="M 135 95 C 150 70, 165 75, 165 85" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round"/>
        </g>

        <!-- Flower on Right -->
        <g transform="translate(330, 80)">
          <!-- Petals -->
          <circle cx="140" cy="70" r="35" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <circle cx="205" cy="115" r="35" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <circle cx="185" cy="185" r="35" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <circle cx="95" cy="185" r="35" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <circle cx="75" cy="115" r="35" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          
          <!-- Center -->
          <circle cx="140" cy="135" r="38" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="6"/>

          <!-- Stem & Leaf -->
          <path d="M 140 220 L 140 330" stroke="#2B2D42" stroke-width="8" stroke-linecap="round"/>
          <path d="M 140 270 C 190 250, 210 280, 200 300 C 170 310, 140 280, 140 270 Z" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="4"/>
        </g>
      </svg>
    `;
  }

  // SVG 4 : School & Togolese Flag (Page 17)
  getSchoolSvg() {
    return `
      <svg viewBox="0 0 600 450" class="coloring-svg-canvas">
        <rect width="600" height="450" fill="#FCFCFC" rx="16"/>
        <text x="300" y="40" font-family="'Fredoka', sans-serif" font-size="20" font-weight="bold" fill="#1D3557" text-anchor="middle">
          L’École Primaire & Le Drapeau
        </text>

        <!-- School Building -->
        <g transform="translate(50, 120)">
          <!-- Roof -->
          <polygon points="175,0 360,60 0,60" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="6"/>
          <!-- Wall -->
          <rect x="25" y="60" width="310" height="180" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="6"/>
          <!-- Door -->
          <rect x="150" y="140" width="60" height="100" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <!-- Windows -->
          <rect x="55" y="90" width="65" height="60" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <line x1="87" y1="90" x2="87" y2="150" stroke="#2B2D42" stroke-width="3"/>
          <rect x="240" y="90" width="65" height="60" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="5"/>
          <line x1="272" y1="90" x2="272" y2="150" stroke="#2B2D42" stroke-width="3"/>
        </g>

        <!-- Flagpole & Flag on Right -->
        <g transform="translate(430, 90)">
          <!-- Pole -->
          <line x1="30" y1="0" x2="30" y2="300" stroke="#2B2D42" stroke-width="7" stroke-linecap="round"/>
          <circle cx="30" cy="0" r="10" fill="#FFB703"/>

          <!-- 5 Stripes of the Flag -->
          <rect x="30" y="15" width="115" height="15" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="2"/>
          <rect x="30" y="30" width="115" height="15" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="2"/>
          <rect x="30" y="45" width="115" height="15" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="2"/>
          <rect x="30" y="60" width="115" height="15" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="2"/>
          <rect x="30" y="75" width="115" height="15" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="2"/>

          <!-- Canton with Star -->
          <rect x="30" y="15" width="45" height="45" class="colorable" fill="#FFFFFF" stroke="#2B2D42" stroke-width="3"/>
          <text x="52" y="45" font-size="24" text-anchor="middle" dominant-baseline="middle" class="colorable" fill="#2B2D42">⭐</text>
        </g>
      </svg>
    `;
  }
}

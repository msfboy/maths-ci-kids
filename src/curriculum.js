// Official Curriculum Data from "Mon cahier d'activités de Mathématiques - Section 1"

export const DOMAINS = {
  LOGIC: {
    id: 'logic',
    title: 'Logique & Formes',
    subtitle: 'Couleurs, tris, formes et rythmes',
    icon: '🎨',
    color: '#FF477E',
    gradient: 'linear-gradient(135deg, #FF477E 0%, #FF85A1 100%)'
  },
  NUMBERS: {
    id: 'numbers',
    title: 'Nombres & Quantités',
    subtitle: 'Beaucoup/peu, dénombrement de 0 à 6',
    icon: '🔢',
    color: '#4361EE',
    gradient: 'linear-gradient(135deg, #4361EE 0%, #4CC9F0 100%)'
  },
  SPACE_TIME: {
    id: 'space_time',
    title: 'Espace & Temps',
    subtitle: 'Dedans/dehors, labyrinthes, gauche/droite',
    icon: '🧭',
    color: '#06D6A0',
    gradient: 'linear-gradient(135deg, #06D6A0 0%, #1B9AAA 100%)'
  }
};

export const WEEKS = [
  {
    week: 1,
    title: 'Semaine 1',
    subtitle: 'Couleurs & Comparaison de quantités',
    domain: 'logic',
    pageRef: 'Pages 12 - 13',
    activities: [
      {
        id: 's1_a1',
        title: 'Identifier les couleurs',
        bookRef: 'Page 12 - Activité 1',
        instruction: 'Touche l’objet de la même couleur pour l’associer !',
        audioVoice: 'Regarde bien ! Trouve et touche les objets qui ont la même couleur !',
        type: 'color_match',
        data: {
          pairs: [
            { id: 'cup_red', label: 'Tasse Rouge', color: 'rouge', hex: '#E63946', icon: '☕', targetHex: '#E63946', targetIcon: '🦋' },
            { id: 'ball_blue', label: 'Ballon Bleu', color: 'bleu', hex: '#1D3557', icon: '⚽', targetHex: '#1D3557', targetIcon: '👕' },
            { id: 'sun_yellow', label: 'Soleil Jaune', color: 'jaune', hex: '#FFB703', icon: '☀️', targetHex: '#FFB703', targetIcon: '⭐' },
            { id: 'leaf_green', label: 'Feuille Verte', color: 'vert', hex: '#2A9D8F', icon: '🍃', targetHex: '#2A9D8F', targetIcon: '🐸' }
          ]
        }
      },
      {
        id: 's1_a2',
        title: 'Beaucoup ou Peu ?',
        bookRef: 'Page 13 - Activité 2',
        instruction: 'Touche le bon groupe selon la consigne !',
        audioVoice: 'Observe attentivement les bonbons et les tomates !',
        type: 'quantity_compare',
        rounds: [
          {
            target: 'few',
            question: 'Où y a-t-il PEU de bonbons ?',
            audio: 'Touche le tas où il y a PEU de bonbons !',
            options: [
              { id: 'opt_few', count: 2, icon: '🍬', label: '2 bonbons (Peu)', isCorrect: true },
              { id: 'opt_many', count: 12, icon: '🍬', label: 'Beaucoup de bonbons', isCorrect: false }
            ]
          },
          {
            target: 'many',
            question: 'Où y a-t-il BEAUCOUP de tomates ?',
            audio: 'Touche le panier qui contient BEAUCOUP de tomates !',
            options: [
              { id: 'opt_few_t', count: 3, icon: '🍅', label: '3 tomates (Peu)', isCorrect: false },
              { id: 'opt_many_t', count: 14, icon: '🍅', label: 'Beaucoup de tomates', isCorrect: true }
            ]
          },
          {
            target: 'few',
            question: 'Où y a-t-il PEU d’étoiles ?',
            audio: 'Touche le groupe où il y a PEU d’étoiles !',
            options: [
              { id: 'opt_many_s', count: 10, icon: '⭐', label: 'Beaucoup d’étoiles', isCorrect: false },
              { id: 'opt_few_s', count: 1, icon: '⭐', label: '1 seule étoile (Peu)', isCorrect: true }
            ]
          }
        ]
      },
      {
        id: 's1_a_color',
        title: 'Coloriage : Le Ballon & La Tasse',
        bookRef: 'Page 12 - Exercice 1',
        instruction: 'Colorie le ballon en bleu et la tasse en rouge comme sur le livre !',
        audioVoice: 'Colorie le ballon en bleu et la tasse en rouge !',
        type: 'coloring',
        drawingIndex: 0
      }
    ]
  },
  {
    week: 2,
    title: 'Semaine 2',
    subtitle: 'Constitution d’ensembles & Quantités (1 et 2)',
    domain: 'numbers',
    pageRef: 'Pages 14 - 15',
    activities: [
      {
        id: 's2_a1',
        title: 'Trier par couleur',
        bookRef: 'Page 14 - Activité 1',
        instruction: 'Mets chaque véhicule dans son garage de même couleur !',
        audioVoice: 'Mets les voitures rouges avec le rouge, et les motos bleues avec le bleu !',
        type: 'sort_ensembles',
        baskets: [
          { id: 'red_box', label: 'Zone Rouge', color: '#E63946', targetColor: 'rouge' },
          { id: 'blue_box', label: 'Zone Bleue', color: '#1D3557', targetColor: 'bleu' }
        ],
        items: [
          { id: 'car1', label: 'Voiture rouge', icon: '🚗', color: 'rouge' },
          { id: 'moto1', label: 'Moto bleue', icon: '🏍️', color: 'bleu' },
          { id: 'car2', label: 'Petite auto rouge', icon: '🚗', color: 'rouge' },
          { id: 'moto2', label: 'Petite moto bleue', icon: '🏍️', color: 'bleu' }
        ]
      },
      {
        id: 's2_a2',
        title: 'Associer 1 et 2 avec les dominos',
        bookRef: 'Page 15 - Activité 2',
        instruction: 'Relie chaque objet au bon nombre de points (1 ou 2) !',
        audioVoice: 'Compte les objets et touche le bon domino ! Un ou deux ?',
        type: 'number_associate',
        questions: [
          {
            objects: [{ icon: '🥄' }, { icon: '🥄' }],
            label: '2 cuillères',
            count: 2,
            audioPrompt: 'Combien y a-t-il de cuillères ? Une, deux !'
          },
          {
            objects: [{ icon: '⚽' }],
            label: '1 ballon de football',
            count: 1,
            audioPrompt: 'Combien y a-t-il de ballons de foot ? Un seul ballon !'
          },
          {
            objects: [{ icon: '👞' }, { icon: '👞' }],
            label: '2 chaussures',
            count: 2,
            audioPrompt: 'Combien de chaussures vois-tu ? Une paire de deux chaussures !'
          },
          {
            objects: [{ icon: '🎩' }],
            label: '1 chapeau',
            count: 1,
            audioPrompt: 'Combien de chapeaux vois-tu ? Un chapeau !'
          }
        ]
      }
    ]
  },
  {
    week: 3,
    title: 'Semaine 3',
    subtitle: 'Formes géométriques (Rond & Carré) & Repères',
    domain: 'logic',
    pageRef: 'Pages 16 - 17',
    activities: [
      {
        id: 's3_a1',
        title: 'Trouver les formes : Rond et Carré',
        bookRef: 'Page 16 - Activité 1',
        instruction: 'Touche le fruit qui est rond ! Puis trouve tous les carrés !',
        audioVoice: 'Observe la papaye, l’orange et la banane. Lequel de ces fruits est tout rond ?',
        type: 'shape_identify',
        rounds: [
          {
            question: 'Quel fruit est tout rond ?',
            audio: 'Touche le fruit qui est rond comme un ballon !',
            options: [
              { id: 'papaye', label: 'Papaye (ovale)', icon: '🍈', isCorrect: false },
              { id: 'orange', label: 'Orange (ronde)', icon: '🍊', isCorrect: true },
              { id: 'banane', label: 'Banane (courbée)', icon: '🍌', isCorrect: false }
            ]
          },
          {
            question: 'Touche tous les CARRÉS !',
            audio: 'Touche toutes les formes carrées ! Le carré a quatre côtés égaux.',
            multi: true,
            targetShape: 'carre',
            shapes: [
              { id: 'sh1', type: 'carre', label: 'Carré', isTarget: true },
              { id: 'sh2', type: 'rond', label: 'Rond', isTarget: false },
              { id: 'sh3', type: 'carre', label: 'Carré', isTarget: true },
              { id: 'sh4', type: 'rond', label: 'Rond', isTarget: false }
            ]
          }
        ]
      },
      {
        id: 's3_a2',
        title: 'L’École et ses repères',
        bookRef: 'Page 17 - Activité 2',
        instruction: 'Touche le panneau ou le drapeau qui indique l’école !',
        audioVoice: 'Regarde la cour de récréation ! Touche le panneau qui indique l’école ou le drapeau !',
        type: 'landmark_find',
        targetLabel: 'Panneau ÉCOLE',
        options: [
          { id: 'tree', label: 'Le grand arbre vert', icon: '🌳', isCorrect: false },
          { id: 'school_sign', label: 'Le panneau ÉCOLE', icon: '🚸', isCorrect: true },
          { id: 'bench', label: 'Le banc', icon: '🪑', isCorrect: false },
          { id: 'flag', label: 'Le drapeau national', icon: '🇹🇬', isCorrect: true }
        ]
      },
      {
        id: 's3_a_color',
        title: 'Coloriage : Les Carrés Magiques',
        bookRef: 'Page 16 - Exercice 1',
        instruction: 'Trouve les carrés et colorie-les avec tes couleurs préférées !',
        audioVoice: 'Regarde les formes géométriques ! Trouve tous les carrés et colorie-les !',
        type: 'coloring',
        drawingIndex: 1
      }
    ]
  },
  {
    week: 6,
    title: 'Semaine 6',
    subtitle: 'Tailles (Grand/Petit) & Dedans / Dehors',
    domain: 'space_time',
    pageRef: 'Pages 24 - 25',
    activities: [
      {
        id: 's6_a1',
        title: 'Grand ou Petit ?',
        bookRef: 'Page 24 - Activité 1',
        instruction: 'Touche le plus grand objet ou le plus petit selon la consigne !',
        audioVoice: 'Observe bien les tailles ! Touche le plus grand !',
        type: 'size_compare',
        rounds: [
          {
            target: 'big',
            question: 'Touche le GRAND arbre !',
            audio: 'Touche le GRAND arbre !',
            options: [
              { id: 't_small', label: 'Petit arbre', icon: '🌱', size: 'small', isCorrect: false },
              { id: 't_big', label: 'Grand arbre', icon: '🌳', size: 'large', isCorrect: true }
            ]
          },
          {
            target: 'small',
            question: 'Touche le PETIT ballon !',
            audio: 'Touche le PETIT ballon !',
            options: [
              { id: 'b_big', label: 'Gros ballon', icon: '⚽', size: 'large', isCorrect: false },
              { id: 'b_small', label: 'Petit ballon', icon: '⚽', size: 'small', isCorrect: true }
            ]
          }
        ]
      },
      {
        id: 's6_a2',
        title: 'Dedans ou Dehors ?',
        bookRef: 'Page 25 - Activité 2',
        instruction: 'Mets les jouets DEDANS le panier ou DEHORS !',
        audioVoice: 'C’est l’heure de ranger ! Mets les balles DEDANS le panier !',
        type: 'in_out',
        taskText: 'Place 3 balles DEDANS le panier !',
        requiredInCount: 3
      }
    ]
  },
  {
    week: 8,
    title: 'Semaine 8',
    subtitle: 'Algorithmes & Suites de motifs (Rythmes)',
    domain: 'logic',
    pageRef: 'Pages 28 - 29',
    activities: [
      {
        id: 's8_a1',
        title: 'La Chenille des Rythmes',
        bookRef: 'Page 29 - Activité 2',
        instruction: 'Quelle couleur vient ensuite dans le collier ?',
        audioVoice: 'Écoute bien le rythme : Rouge, Bleu, Rouge, Bleu... Quelle couleur vient ensuite ?',
        type: 'pattern_complete',
        patterns: [
          {
            sequence: ['🔴', '🔵', '🔴', '🔵'],
            missing: '🔴',
            options: ['🔴', '🔵', '🟡'],
            prompt: 'Rouge, Bleu, Rouge, Bleu... et ensuite ?'
          },
          {
            sequence: ['🟡', '🟢', '🟡', '🟢'],
            missing: '🟡',
            options: ['🟡', '🟢', '🔴'],
            prompt: 'Jaune, Vert, Jaune, Vert... et ensuite ?'
          },
          {
            sequence: ['🟧', '🟣', '🟧', '🟣'],
            missing: '🟧',
            options: ['🟧', '🟣', '🟢'],
            prompt: 'Carré orange, Rond violet... et après ?'
          }
        ]
      }
    ]
  },
  {
    week: 9,
    title: 'Semaine 9',
    subtitle: 'Le Labyrinthe & Compter jusqu’à 4',
    domain: 'space_time',
    pageRef: 'Pages 30 - 31',
    activities: [
      {
        id: 's9_a1',
        title: 'Le Labyrinthe de l’Écolier',
        bookRef: 'Page 31 - Activité 2',
        instruction: 'Guide Uriel sur le chemin de l’école en évitant les obstacles !',
        audioVoice: 'Aide le petit écolier à rejoindre son école en suivant le chemin sans toucher les murs !',
        type: 'maze_game'
      },
      {
        id: 's9_a2',
        title: 'Compter jusqu’à 4',
        bookRef: 'Page 30 - Activité 1',
        instruction: 'Touche chaque papillon pour les compter : 1, 2, 3, 4 !',
        audioVoice: 'Touche les papillons un par un pour tous les compter !',
        type: 'touch_count',
        targetCount: 4,
        itemIcon: '🦋',
        itemName: 'papillons'
      }
    ]
  },
  {
    week: 22,
    title: 'Semaine 22',
    subtitle: 'Les Nombres de 0 à 6',
    domain: 'numbers',
    pageRef: 'Pages 72 - 73',
    activities: [
      {
        id: 's22_a1',
        title: 'Le Train des Chiffres (0 à 6)',
        bookRef: 'Page 72 - Activité 1',
        instruction: 'Remets les wagons des chiffres dans le bon ordre de 0 à 6 !',
        audioVoice: 'Place les chiffres dans le bon ordre : zéro, un, deux, trois, quatre, cinq et six !',
        type: 'number_train',
        maxNum: 6
      },
      {
        id: 's22_a2',
        title: 'Le Défi des 6 Mangues',
        bookRef: 'Page 73 - Activité 2',
        instruction: 'Cueille exactement le nombre de mangues demandé !',
        audioVoice: 'Mets 5 mangues bien mûres dans le panier ! Compte avec moi !',
        type: 'harvest_count',
        targetCount: 5,
        itemIcon: '🥭',
        itemName: 'mangues'
      }
    ]
  },
  {
    week: 23,
    title: 'Semaine 23',
    subtitle: 'Gauche et Droite',
    domain: 'space_time',
    pageRef: 'Pages 74 - 75',
    activities: [
      {
        id: 's23_a1',
        title: 'La Main Gauche et la Main Droite',
        bookRef: 'Page 74 - Activité 1',
        instruction: 'Touche la main demandée ou l’animal à gauche / à droite !',
        audioVoice: 'Touche l’animal qui est à GAUCHE !',
        type: 'left_right'
      }
    ]
  }
];

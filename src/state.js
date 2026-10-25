// State and Progress Management for Maths CI

const STORAGE_KEY = 'maths_ci_data_v1';

const defaultState = {
  childName: 'Uriel',
  avatar: 'lion', // lion, tiger, astronaut, hero, princess, robot
  stars: 0,
  completedWeeks: [],
  activityStars: {}, // { 'semaine-1-act-1': 3 }
  badges: [
    { id: 'first_step', title: 'Premier Pas', icon: '🌟', desc: 'Première activité terminée !', unlocked: false },
    { id: 'color_master', title: 'Roi des Couleurs', icon: '🎨', desc: 'Toutes les couleurs maîtrisées !', unlocked: false },
    { id: 'counter_pro', title: 'Champion du Comptage', icon: '🔢', desc: 'Compter jusqu’à 6 sans faute !', unlocked: false },
    { id: 'shape_genius', title: 'Génie des Formes', icon: '🔺', desc: 'Ronds, carrés et triangles reconnus !', unlocked: false },
    { id: 'space_cadet', title: 'Explorateur de l’Espace', icon: '🚀', desc: 'Dedans/dehors et labyrinthe réussis !', unlocked: false },
    { id: 'math_hero', title: 'Héros des Mathématiques', icon: '👑', desc: 'A accompli plus de 10 activités !', unlocked: false }
  ],
  settings: {
    sound: true,
    voice: true
  }
};

class StateManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load state from localStorage', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  setChildName(name) {
    this.data.childName = name.trim() || 'Uriel';
    this.save();
  }

  setAvatar(avatar) {
    this.data.avatar = avatar;
    this.save();
  }

  addStars(activityId, count = 1) {
    const current = this.data.activityStars[activityId] || 0;
    if (count > current) {
      const diff = count - current;
      this.data.stars += diff;
      this.data.activityStars[activityId] = count;
    }
    
    // Check badges
    this.checkBadges();
    this.save();
  }

  checkBadges() {
    const totalActs = Object.keys(this.data.activityStars).length;
    
    const unlock = (id) => {
      const b = this.data.badges.find(x => x.id === id);
      if (b && !b.unlocked) {
        b.unlocked = true;
        return true;
      }
      return false;
    };

    let newlyUnlocked = [];
    if (totalActs >= 1 && unlock('first_step')) newlyUnlocked.push('Premier Pas');
    if (this.data.activityStars['s1_a1'] >= 1 && this.data.activityStars['s1_a2'] >= 1 && unlock('color_master')) newlyUnlocked.push('Roi des Couleurs');
    if (this.data.activityStars['s2_a2'] >= 1 && unlock('counter_pro')) newlyUnlocked.push('Champion du Comptage');
    if (this.data.activityStars['s3_a1'] >= 1 && unlock('shape_genius')) newlyUnlocked.push('Génie des Formes');
    if (this.data.activityStars['s6_a2'] >= 1 && unlock('space_cadet')) newlyUnlocked.push('Explorateur de l’Espace');
    if (totalActs >= 8 && unlock('math_hero')) newlyUnlocked.push('Héros des Mathématiques');

    return newlyUnlocked;
  }

  resetProgress() {
    this.data.stars = 0;
    this.data.activityStars = {};
    this.data.badges.forEach(b => b.unlocked = false);
    this.save();
  }
}

export const state = new StateManager();

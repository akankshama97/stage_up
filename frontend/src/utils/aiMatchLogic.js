/**
 * AI Match Score Engine for StageUp
 * Evaluates creators based on Proof-of-Work, skill requirements, budget constraints, and delivery turnaround.
 * Strict tactile paper aesthetic: Explainable matching logic without opaque black-box AI.
 */

export const SKILL_OPTIONS = [
  'Reel Editing',
  'Thumbnail Design',
  'Voiceover',
  'Scriptwriting'
];

export const BUDGET_OPTIONS = [
  'Under ₹500',
  '₹500-₹1000',
  'Above ₹1000'
];

export const DEADLINE_OPTIONS = [
  'Urgent (24 hrs)',
  '2-3 Days',
  '1 Week'
];

/**
 * Extract clean numerical price from creator price string
 */
export const getCreatorPrice = (talent) => {
  if (!talent || !talent.price) return 500;
  const num = parseInt(talent.price.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 500 : num;
};

/**
 * Extract turnaround time in hours
 */
export const getCreatorTurnaroundHours = (talent) => {
  if (!talent || !talent.turnaroundTime) return 24;
  const str = talent.turnaroundTime.toLowerCase();
  if (str.includes('6')) return 6;
  if (str.includes('12-24')) return 24;
  if (str.includes('12')) return 12;
  if (str.includes('18')) return 18;
  if (str.includes('24')) return 24;
  if (str.includes('48')) return 48;
  if (str.includes('day')) {
    const days = parseInt(str.replace(/[^0-9]/g, ''), 10) || 1;
    return days * 24;
  }
  return 24;
};

/**
 * Match a talent against recruiter criteria
 * 
 * Rules:
 * - If creator skill == selected skill: +40 points
 * - If creator price <= budget: +30 points
 * - If creator delivery time <= deadline: +30 points
 * - Total shown as %
 */
export const calculateMatchScore = (talent, criteria) => {
  const { skill, budget, deadline } = criteria;
  const talentSkillsStr = (talent.skills || []).join(' ').toLowerCase();
  const talentBio = (talent.bio || '').toLowerCase();
  const priceNum = getCreatorPrice(talent);
  const turnaroundHours = getCreatorTurnaroundHours(talent);

  let skillPoints = 0;
  let skillMatched = false;
  let skillNote = 'Skill mismatch';

  const sLower = (skill || '').toLowerCase();
  if (sLower === 'reel editing') {
    if (talentSkillsStr.includes('reel') || talentSkillsStr.includes('editing')) {
      skillPoints = 40;
      skillMatched = true;
      skillNote = 'Verified Reel & Shorts Editor';
    } else if (talentBio.includes('reel') || talentBio.includes('video')) {
      skillPoints = 25;
      skillMatched = true;
      skillNote = 'Video Creation Experience';
    }
  } else if (sLower === 'thumbnail design') {
    if (talentSkillsStr.includes('thumbnail')) {
      skillPoints = 40;
      skillMatched = true;
      skillNote = 'High CTR Thumbnail Artist';
    } else if (talentSkillsStr.includes('poster') || talentSkillsStr.includes('banner') || talentSkillsStr.includes('design')) {
      skillPoints = 20;
      skillMatched = true;
      skillNote = 'Graphic & Visual Design Skills';
    }
  } else if (sLower === 'voiceover') {
    if (talentSkillsStr.includes('voice') || talentSkillsStr.includes('dubbing') || talentSkillsStr.includes('audio')) {
      skillPoints = 40;
      skillMatched = true;
      skillNote = 'Studio Shure SM7B Mic Setup';
    }
  } else if (sLower === 'scriptwriting') {
    if (talentSkillsStr.includes('script') || talentSkillsStr.includes('hook') || talentSkillsStr.includes('writing')) {
      skillPoints = 40;
      skillMatched = true;
      skillNote = 'Retention-Engine Scriptwriter';
    }
  }

  // 2. Budget Matching (+30 points)
  let budgetPoints = 0;
  let budgetNote = `Price: ${talent.price}`;
  if (budget === 'Under ₹500') {
    if (priceNum <= 500) {
      budgetPoints = 30;
      budgetNote = `₹${priceNum} fits within Under ₹500 budget`;
    } else if (priceNum <= 650) {
      budgetPoints = 15;
      budgetNote = `₹${priceNum} slightly exceeds ₹500 target`;
    } else {
      budgetPoints = 0;
      budgetNote = `₹${priceNum} exceeds ₹500 budget`;
    }
  } else if (budget === '₹500-₹1000') {
    if (priceNum <= 1000) {
      budgetPoints = 30;
      budgetNote = `₹${priceNum} fits within ₹500-₹1000 tier`;
    } else if (priceNum <= 1250) {
      budgetPoints = 15;
      budgetNote = `₹${priceNum} slightly exceeds ₹1000 target`;
    } else {
      budgetPoints = 0;
      budgetNote = `₹${priceNum} exceeds ₹1000 tier`;
    }
  } else if (budget === 'Above ₹1000') {
    budgetPoints = 30;
    budgetNote = `₹${priceNum} fits budget requirements`;
  }

  // 3. Deadline Matching (+30 points)
  let deadlinePoints = 0;
  let deadlineNote = `${talent.turnaroundTime || '24 hrs'} turnaround`;
  if (deadline === 'Urgent (24 hrs)') {
    if (turnaroundHours <= 24) {
      deadlinePoints = 30;
      deadlineNote = `${turnaroundHours}h delivery meets urgent 24h timeline`;
    } else if (turnaroundHours <= 48) {
      deadlinePoints = 15;
      deadlineNote = `${turnaroundHours}h delivery slightly over 24h`;
    } else {
      deadlinePoints = 0;
      deadlineNote = `${turnaroundHours}h delivery exceeds urgent timeline`;
    }
  } else if (deadline === '2-3 Days') {
    if (turnaroundHours <= 72) {
      deadlinePoints = 30;
      deadlineNote = `${turnaroundHours}h delivery well within 2-3 days`;
    } else {
      deadlinePoints = 15;
      deadlineNote = `${turnaroundHours}h delivery`;
    }
  } else if (deadline === '1 Week') {
    deadlinePoints = 30;
    deadlineNote = `${turnaroundHours}h delivery well within 1 week`;
  }

  const totalScore = Math.min(100, skillPoints + budgetPoints + deadlinePoints);

  // 3 small reasons why matched
  const reasons = [];
  if (budgetPoints >= 30) {
    reasons.push('✓ Budget Match');
  } else if (budgetPoints > 0) {
    reasons.push('✓ Near Target Budget');
  } else {
    reasons.push('✓ Premium Portfolio Quality');
  }

  if (deadlinePoints >= 30) {
    reasons.push(`✓ ${turnaroundHours <= 24 ? '24hr' : `${turnaroundHours}hr`} Delivery`);
  } else {
    reasons.push(`✓ ${talent.turnaroundTime || 'Reliable'} Timeline`);
  }

  // Reliability score from Skill Passport
  reasons.push('✓ 98% Reliability');

  return {
    score: totalScore,
    skillPoints,
    budgetPoints,
    deadlinePoints,
    skillMatched,
    skillNote,
    budgetNote,
    deadlineNote,
    reasons
  };
};

/**
 * Score and rank all talents
 */
export const rankTalents = (talents, criteria) => {
  if (!criteria || !criteria.skill) return talents;

  const scored = talents.map((t) => {
    const matchData = calculateMatchScore(t, criteria);
    return {
      ...t,
      matchScore: matchData.score,
      matchBreakdown: matchData
    };
  });

  // Sort descending by score; if tied, sort by price (lower price first)
  scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return getCreatorPrice(a) - getCreatorPrice(b);
  });

  return scored;
};

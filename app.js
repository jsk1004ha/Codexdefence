const ORIGINAL_PLANNER_TEXT = `방치형 타워 디펜스 최종 보고서 - 오비탈 코어: 아이들 타워 디펜스

(게임 내 열람용 원문)
1) 게임 정체성: 중앙 코어 기반 방치형 진화 디펜스, 코어/진화/히든/보스/도전/장기성장 강조.
2) 핵심 감각: 초반 생존, 중반 빌드 완성, 후반 화면 지배, 장기 목표 유지.
3) 시스템: 코어/진화/궤도 모듈/궁극기/런업/영구성장/연구/유물/마스터리/도전/히든/프레스티지/적 변이.
4) 전투: 적 등장→자동 공격→코인→업그레이드→보스→정산→영구성장.
5~13) 코어/적/진화/모듈/궁극기/웨이브/미션/도전/유물/칭호를 데이터로 반영.`;

const CORE_GROUPS = {
  basic: ["원형 코어","전투 코어","수호 코어","증폭 코어","균형 코어","초기형 코어"],
  attack: ["플라즈마 코어","탄도 코어","레이저 코어","번개 코어","화염로 코어","초신성 코어","파편 코어","저격 코어","광자 코어","분쇄 코어"],
  control: ["중력 코어","냉각 코어","시간 코어","공명 코어","자기장 코어","균열 코어","중압 코어","파동 코어","음파 코어","봉쇄 코어"],
  defense: ["방벽 코어","반사 코어","장갑 코어","재생 코어","성채 코어","흡수 코어","수정 코어","철벽 코어","생명 코어","불굴 코어"],
  summon: ["오비탈 코어","드론 코어","나노 코어","포탑 매트릭스 코어","군집 코어","감시자 코어","위성 코어","원벌집 코어","기계 코어","복제체 코어"],
  economy: ["탐욕 코어","수확 코어","연금 코어","계약 코어","도박 코어","채굴 코어","황금 코어","상인 코어","세금 코어","공물 코어"],
  special: ["과열 코어","광전 코어","침묵 코어","저주 코어","프리즘 코어","복제 코어","혼돈 코어","질서 코어","혈석 코어","금단 코어"],
  hidden: ["특이점 코어","공허 코어","역설 코어","식월 코어","창세 코어","심연 코어","무명 코어","오메가 코어","붕괴 코어","거울 코어","심판 코어","영겁 코어"]
};
const SHAPES = ["circle","triangle","diamond","hex","star","ring","cross","spiral","gear","shard"];

const CORE_PATTERN_BY_CATEGORY = {
  basic: "single",
  attack: "burst",
  control: "pulse",
  defense: "guard",
  summon: "drone",
  economy: "single",
  special: "chaos",
  hidden: "prism"
};

const coreData = [];
let coreIndex = 0;
for (const [cat, names] of Object.entries(CORE_GROUPS)) {
  names.forEach((name, i) => {
    const hue = (coreIndex * 27) % 360;
    coreData.push({
      id: `core_${coreIndex++}`,
      name,
      category: cat,
      description: `${name} - ${cat} 계열 전투 특화 코어`,
      stats: { atk: 1 + ((i % 4) * 0.2), aspd: 1 + ((i % 3) * 0.15), range: 130 + (i % 5) * 12, hp: 200 + ((i % 5) * 30), shield: 40 + ((i % 4) * 12) },
      passive: `${cat} 패시브 ${i + 1}: 고유 효과`,
      weakness: `${cat} 약점 ${i + 1}`,
      attackStyle: ["볼트", "레이저", "폭발", "연쇄", "장판"][i % 5],
      visualConfig: { shape: SHAPES[(i + Object.keys(CORE_GROUPS).indexOf(cat)) % SHAPES.length], hue, ringCount: 1 + (i % 3), spin: 0.002 * (1 + i % 4) },
      effectTheme: ["plasma", "void", "ice", "fire", "lightning", "nano"][i % 6],
      ultimateSynergy: ["블랙홀", "시간 정지", "초신성 폭발", "방벽 전개"][i % 4],
      evolutionConditions: ["블랙홀 처치 누적", "보호막 흡수", "드론 피해 누적", "궁극기 없이 웨이브 도달", "저체력 보스 처치"][i % 5],
      masteryBonus: `${cat} 마스터리 보너스 +${3 + i}%`,
      mission: `${name} 전용 미션`,
      attackPattern: CORE_PATTERN_BY_CATEGORY[cat]
    });
  });
}

const moduleNames = ["레이저 위성", "보호막 위성", "중력 렌즈", "냉각 코일", "전류 증폭기", "수확기", "드론 둥지", "미사일 포드", "반사판", "균열 렌즈", "화염 노즐", "나노 살포기", "광자 증폭기", "흡수 링", "처형 렌즈", "시간 진자", "탄도 증폭기", "보상 프린터", "정화 코일", "오메가 링"];
const modules = moduleNames.map((name, i) => ({
  id: `m${i}`,
  name,
  category: ["attack", "defense", "control", "economy", "summon"][i % 5],
  description: `${name} 효과`,
  effects: {
    laserSat: name === "레이저 위성" ? 1 : 0,
    shieldSat: name === "보호막 위성" ? 1 : 0,
    gravity: name === "중력 렌즈" ? 0.08 : 0,
    chill: name === "냉각 코일" ? 0.08 : 0,
    chain: name === "전류 증폭기" ? 1 : 0,
    reward: ["수확기", "보상 프린터"].includes(name) ? 0.12 : 0,
    drone: name === "드론 둥지" ? 1 : 0,
    missile: name === "미사일 포드" ? 1 : 0,
    reflect: name === "반사판" ? 0.15 : 0,
    warp: name === "균열 렌즈" ? 0.06 : 0,
    burn: name === "화염 노즐" ? 8 : 0,
    nano: name === "나노 살포기" ? 1 : 0,
    photon: name === "광자 증폭기" ? 0.2 : 0,
    absorb: name === "흡수 링" ? 0.1 : 0,
    execute: name === "처형 렌즈" ? 0.2 : 0,
    pendulum: name === "시간 진자" ? 0.07 : 0,
    ballistic: name === "탄도 증폭기" ? 1 : 0,
    cleanse: name === "정화 코일" ? 0.2 : 0,
    omega: name === "오메가 링" ? 0.06 : 0
  },
  unlockCondition: `웨이브 ${3 + i}`,
  visualConfig: { size: 8 + (i % 5) * 2, hue: (i * 19) % 360 }
}));

const ultimateNames = ["블랙홀", "궤도 레이저", "미사일 폭풍", "시간 정지", "전자기 폭풍", "성운 폭발", "태양섬광", "공허 파동", "차원 균열", "나노 범람", "드론 출격", "심판 포격", "절대영도", "방벽 전개", "초신성 폭발"];
const ULT_AWAKENINGS = {
  "블랙홀": ["거대화", "압축 피해", "보상 증가"],
  "궤도 레이저": ["다중 레이저", "방어 무시", "화상"],
  "미사일 폭풍": ["분열 미사일", "보스 집중", "핵폭발"],
  "시간 정지": ["지속 증가", "내 공격 가속", "시간 역행"],
  "전자기 폭풍": ["연쇄 번개", "보호막 파괴", "드론 충전"],
  "성운 폭발": ["독성 구름", "화염 장판", "흡혈"],
  "태양섬광": ["실명", "화염 중첩", "암흑 추가 피해"],
  "공허 파동": ["능력 봉인", "소멸 확률", "보스 약화"],
  "차원 균열": ["추방", "역행", "위상 붕괴"],
  "나노 범람": ["감염 확산", "방어 침식", "회복 차단"],
  "드론 출격": ["요격대", "정밀사격", "자폭편대"],
  "심판 포격": ["집중포격", "관통탄", "처형사격"],
  "절대영도": ["완전 빙결", "파쇄 피해", "감속장 지속"],
  "방벽 전개": ["보호막 재생", "반사 피해", "폭발 방패"],
  "초신성 폭발": ["광역증폭", "연쇄폭발", "잔류화염"],
};
const ultimates = ultimateNames.map((name, i) => ({
  id: `u${i}`,
  name,
  cooldown: 20 + i * 2,
  chargeNeed: 60 + i * 8,
  effects: { damage: 90 + i * 20, cc: i % 3 === 0 ? 1 : 0 },
  awakenings: ULT_AWAKENINGS[name],
  hiddenLink: `히든 조건 ${i + 1}`
}));

const elitePrefixes = ["거대한", "재빠른", "분열하는", "반사하는", "재생하는", "무장한", "은폐한", "분노한", "흡수하는", "저주받은", "황금의", "공허의", "빙결의", "화염의", "전격의", "심연의", "복제하는", "도망치는", "봉쇄하는", "오메가"];

const enemiesByCategory = {
  normal: ["러너", "워커", "탱커", "스웜링", "브루트", "크롤러", "차저", "슬래셔", "벌처", "스톤백"],
  fast: ["스프린터", "블링커", "스키머", "대시러", "고스트 러너", "회피체", "위상충", "바늘발", "전광충", "잔상체"],
  defense: ["아머드", "실드 베어러", "철갑충", "수정체", "재생체", "껍질괴수", "방벽병", "요새벌레", "역장체", "중장갑 거미"],
  ranged: ["슈터", "스나이퍼", "박격포병", "전류술사", "독침사수", "빙결사수", "저주술사", "공허사수", "분열포병", "지원사수"],
  summon: ["알주머니", "둥지괴물", "군체모체", "분열체", "기생충", "부화체", "포자체", "군집술사", "증식괴수", "균열 산란자"],
  disrupt: ["재머", "해커", "감속술사", "침묵자", "흡수자", "부식체", "왜곡체", "분산자", "은폐자", "역류체"],
  element: ["화염체", "빙결체", "전격체", "암흑체", "광휘체", "독성체", "금속체", "유령체", "공허체", "성운체"],
  economy: ["도둑쥐", "세금징수자", "탐욕벌레", "금고괴수", "가짜 보물체", "채굴 방해체", "빚쟁이", "황금 슬라임", "보상 포식자", "공물 수집가"],
  bossSupport: ["방패 수행체", "치유 수행체", "분노 수행체", "속도 수행체", "균열 수행체", "침묵 수행체", "공명 수행체"],
  hidden: ["이상 신호체", "공허 수문장", "무명 군체"]
};
const enemyData = [];
Object.entries(enemiesByCategory).forEach(([cat, list], ci) => list.forEach((name, i) => enemyData.push({
  id: `e_${cat}_${i}`,
  name,
  category: cat,
  hp: 28 + ci * 10 + i * 6,
  speed: 0.45 + ((i + ci) % 5) * 0.16,
  atk: 3 + ci + i,
  def: i % 4,
  ability: `${cat} 특수 능력`,
  counterBuild: ["공격", "방어", "제어", "소환", "경제"][i % 5],
  visualConfig: { shape: SHAPES[(i + ci) % SHAPES.length], hue: (ci * 35 + i * 13) % 360 },
  spawnWave: 1 + ci * 2 + i,
  reward: 2 + ci + i,
  canMutate: true
})));

const waveTypes = ["일반 웨이브", "스웜 웨이브", "장갑 웨이브", "고속 웨이브", "원거리 웨이브", "소환 웨이브", "방해 웨이브", "황금 웨이브", "공허 웨이브", "엘리트 웨이브", "혼합 웨이브", "보스 웨이브", "히든 웨이브"];
const challengeModes = [
  { name: "무궁의 밤", rule: "적 체력 +40%", effect: { enemyHpMul: 1.4 } },
  { name: "과열 프로토콜", rule: "코어 공격력 +35%, 코어 HP -35%", effect: { coreAtkMul: 1.35, coreHpMul: 0.65 } },
  { name: "무결점 방벽", rule: "실드 +120%, 체력 회복 금지", effect: { shieldMul: 2.2, noRegen: true } },
  { name: "침묵의 전장", rule: "궁극기 사용 불가, 기본 공격 +25%", effect: { silence: true, coreAtkMul: 1.25 } },
  { name: "탐욕의 대가", rule: "보상 +50%, 적 공격 +30%", effect: { rewardMul: 1.5, enemyAtkMul: 1.3 } },
  { name: "균열 감옥", rule: "적 주기적 순간이동", effect: { enemyBlink: true } },
  { name: "오메가 수렴", rule: "모듈 효과 60% 복제", effect: { omegaEcho: 0.6 } }
];
const relics = Array.from({ length: 40 }, (_, i) => ({ id: `r${i}`, name: `유물 ${i + 1}`, description: `영구 패시브 ${i + 1}`, unlockCondition: `도전 ${i % 7 + 1} 클리어`, effects: { atk: (i % 5) * 0.02, hp: (i % 4) * 0.03, reward: (i % 3) * 0.04 } }));
const missions = ["일일: 10웨이브 도달", "일일: 엘리트 15마리 처치", "주간: 보스 20회 처치", "주간: 경제 방해 적 100마리", "코어: 임의 코어 3단 진화", "히든: 위험 보상 8회 선택", "보스: 히든 보스 조우", "연속: 5런 연속 20웨이브", "마스터리: 코어 숙련 5레벨", "칭호: 3개 칭호 해금"].map((name, i) => ({ id: `q${i}`, name, target: 10 + i * 2, reward: 100 + i * 20 }));
const titles = ["초보 수호자", "궤도 장인", "블랙홀 개척자", "오메가 해독자", "무한 감시자"].map((name, i) => ({ id: `t${i}`, name, bonus: { atk: i * 0.01, reward: i * 0.015 }, unlock: `조건 ${i + 1}` }));
const bosses = [
  { id: 'b0', name: "아이언 베히모스", hp: 1300, phase: 3, weakness: "분쇄", reward: 180, pattern: "ram" },
  { id: 'b1', name: "리프트 타이런트", hp: 2200, phase: 3, weakness: "봉쇄", reward: 260, pattern: "rift" },
  { id: 'b2', name: "오메가 프리즘", hp: 3400, phase: 4, weakness: "광자", reward: 360, pattern: "beam" },
  { id: 'b3', name: "히든: 무명 판관", hp: 5200, phase: 4, weakness: "공허", reward: 520, pattern: "judge", hidden: true },
  { id: 'b4', name: "히든: 종말 위성", hp: 7200, phase: 5, weakness: "드론", reward: 760, pattern: "satellite", hidden: true }
];

const SAVE_KEY = 'orbital_core_save_v2';
const PERMANENT_UPGRADES = [
  { id: 'atk', name: '코어 증폭', desc: '코어 기본 공격력 +10%', base: 120, type: 'coin' },
  { id: 'hp', name: '코어 방호막', desc: '코어 최대 체력 +12%', base: 140, type: 'coin' },
  { id: 'reward', name: '수확 프로토콜', desc: '코인 획득량 +9%', base: 180, type: 'coin' },
  { id: 'charge', name: '궁극기 컨덴서', desc: '전투 중 궁극기 자동 충전 +8%', base: 150, type: 'energy' },
  { id: 'module', name: '모듈 버스 확장', desc: '기본 모듈 슬롯 +1', base: 220, type: 'coin' }
];
const defaultState = () => ({
  resources: { coin: 0, energy: 0, research: 0, prestige: 0 },
  selectedCore: coreData[0].id,
  unlockedCores: [coreData[0].id],
  coreLevel: Object.fromEntries(coreData.map(c => [c.id, 1])),
  coreEvolution: Object.fromEntries(coreData.map(c => [c.id, 0])),
  coreMastery: Object.fromEntries(coreData.map(c => [c.id, { xp: 0, lv: 0 }])),
  unlockedRelics: [],
  missionProgress: Object.fromEntries(missions.map(m => [m.id, 0])),
  achievements: {},
  hiddenClues: [],
  seenHiddenBoss: false,
  titles: [],
  prestige: { times: 0, points: 0, omegaResearch: 0, globalMul: 1 },
  permanentUpgrades: { atk: 0, hp: 0, reward: 0, charge: 0, module: 0 },
  settings: { screenshake: true, particle: true, autoReturn: false },
  stats: { bestWave: 0, totalKills: 0, riskPick: 0, blackholeKills: 0, shieldAbsorb: 0, droneDamage: 0, noUltWave: 0, bossLowHpKill: 0, attributeKills: 0 },
  lastSeen: Date.now(),
  run: null
});

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const base = defaultState();
    const parsed = JSON.parse(raw);
    const next = { ...base, ...parsed };

    next.resources = { ...base.resources, ...(parsed.resources || {}) };
    next.prestige = { ...base.prestige, ...(parsed.prestige || {}) };
    next.settings = { ...base.settings, ...(parsed.settings || {}) };
    next.stats = { ...base.stats, ...(parsed.stats || {}) };
    next.permanentUpgrades = { ...base.permanentUpgrades, ...(parsed.permanentUpgrades || {}) };

    next.coreLevel = { ...base.coreLevel, ...(parsed.coreLevel || {}) };
    next.coreEvolution = { ...base.coreEvolution, ...(parsed.coreEvolution || {}) };
    next.coreMastery = { ...base.coreMastery, ...(parsed.coreMastery || {}) };

    coreData.forEach(c => {
      if (typeof next.coreLevel[c.id] !== 'number') next.coreLevel[c.id] = base.coreLevel[c.id];
      if (typeof next.coreEvolution[c.id] !== 'number') next.coreEvolution[c.id] = base.coreEvolution[c.id];
      if (!next.coreMastery[c.id] || typeof next.coreMastery[c.id] !== 'object') next.coreMastery[c.id] = { ...base.coreMastery[c.id] };
      next.coreMastery[c.id] = { ...base.coreMastery[c.id], ...next.coreMastery[c.id] };
    });

    if (!coreData.some(c => c.id === next.selectedCore)) next.selectedCore = base.selectedCore;
    if (!Array.isArray(next.unlockedCores)) next.unlockedCores = [...base.unlockedCores];
    if (!next.unlockedCores.includes(next.selectedCore)) next.unlockedCores.unshift(next.selectedCore);

    return next;
  } catch {
    return defaultState();
  }
}
let state = load();

function applyOffline() {
  const now = Date.now();
  const dt = Math.max(0, Math.floor((now - state.lastSeen) / 1000));
  const gain = Math.min(36000, dt) * 0.12 * (state.prestige.globalMul);
  state.resources.coin += Math.floor(gain);
  state.resources.research += Math.floor(gain * 0.08);
  state.lastSeen = now;
}
applyOffline();

function save() { state.lastSeen = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
document.getElementById('saveBtn').onclick = () => { save(); flash("저장 완료"); };

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; W = canvas.width; H = canvas.height; cx = W / 2; cy = H / 2; });
window.dispatchEvent(new Event('resize'));

const game = {
  time: 0,
  enemies: [], projectiles: [], particles: [], modules: [], drones: [],
  wave: 1, waveTimer: 0, spawnTimer: 0, ultCharge: 0, ultCd: 0,
  hp: 250, shield: 90, maxHp: 250, maxShield: 90,
  inBattle: false, paused: false, lastUpgradeWave: 0,
  challenge: null, bossContext: null,
  timers: { burst: 0, pulse: 0, drone: 0, guard: 0, missile: 0 }
};

function getCore() { return coreData.find(c => c.id === state.selectedCore) || coreData[0]; }
function getRun() { if (!state.run) state.run = { upgrades: [], danger: [], mode: null, ultimateAwakening: {}, hiddenScore: 0 }; return state.run; }
function getPermanentLevel(id) { return state.permanentUpgrades?.[id] || 0; }
function getPermanentValue(id, perLevel) { return 1 + getPermanentLevel(id) * perLevel; }
function getUpgradeCost(upgrade) { return Math.floor(upgrade.base * Math.pow(1.35, getPermanentLevel(upgrade.id))); }
function buyPermanentUpgrade(id) {
  const up = PERMANENT_UPGRADES.find(u => u.id === id);
  if (!up) return;
  const cost = getUpgradeCost(up);
  const key = up.type === 'energy' ? 'energy' : 'coin';
  if (state.resources[key] < cost) return flash(`${up.type === 'energy' ? '에너지' : '코인'} 부족`);
  state.resources[key] -= cost;
  state.permanentUpgrades[id] = getPermanentLevel(id) + 1;
  flash(`${up.name} Lv.${state.permanentUpgrades[id]}`);
  refreshPanels();
}
function moduleStats() {
  const extraSlot = getPermanentLevel('module');
  const owned = modules.slice(0, Math.min(modules.length, Math.floor(state.coreLevel[state.selectedCore] / 2) + state.coreEvolution[state.selectedCore] + extraSlot));
  const stat = { laserSat: 0, shieldSat: 0, gravity: 0, chill: 0, chain: 0, reward: 0, drone: 0, missile: 0, reflect: 0, warp: 0, burn: 0, nano: 0, photon: 0, absorb: 0, execute: 0, pendulum: 0, ballistic: 0, cleanse: 0, omega: 0 };
  owned.forEach(m => Object.keys(stat).forEach(k => stat[k] += (m.effects[k] || 0)));
  if (stat.omega > 0) {
    Object.keys(stat).forEach(k => { if (k !== 'omega') stat[k] += stat[k] * stat.omega * 0.6; });
  }
  if (game.challenge?.effect?.omegaEcho) {
    Object.keys(stat).forEach(k => { if (k !== 'omega') stat[k] += stat[k] * game.challenge.effect.omegaEcho; });
  }
  return { owned, stat };
}

function passiveModifiers() {
  const m = { atk: 1, hp: 1, reward: 1, aspd: 1, enemyHp: 1, enemyAtk: 1, silence: false, noRegen: false, enemyBlink: false };
  m.atk *= getPermanentValue('atk', 0.1);
  m.hp *= getPermanentValue('hp', 0.12);
  m.reward *= getPermanentValue('reward', 0.09);
  if (game.challenge) {
    const ef = game.challenge.effect;
    if (ef.coreAtkMul) m.atk *= ef.coreAtkMul;
    if (ef.coreHpMul) m.hp *= ef.coreHpMul;
    if (ef.rewardMul) m.reward *= ef.rewardMul;
    if (ef.enemyHpMul) m.enemyHp *= ef.enemyHpMul;
    if (ef.enemyAtkMul) m.enemyAtk *= ef.enemyAtkMul;
    if (ef.shieldMul) game.maxShield *= ef.shieldMul;
    if (ef.silence) m.silence = true;
    if (ef.noRegen) m.noRegen = true;
    if (ef.enemyBlink) m.enemyBlink = true;
  }
  state.unlockedRelics.forEach(id => {
    const rel = relics.find(r => r.id === id);
    if (!rel) return;
    m.atk *= (1 + (rel.effects.atk || 0));
    m.hp *= (1 + (rel.effects.hp || 0));
    m.reward *= (1 + (rel.effects.reward || 0));
  });
  state.titles.forEach(id => {
    const t = titles.find(x => x.id === id);
    if (!t) return;
    m.atk *= (1 + t.bonus.atk);
    m.reward *= (1 + t.bonus.reward);
  });
  return m;
}

function startRun() {
  const core = getCore();
  game.enemies = []; game.projectiles = []; game.particles = []; game.modules = []; game.drones = [];
  game.wave = 1; game.waveTimer = 0; game.spawnTimer = 0; game.ultCharge = 0; game.ultCd = 0;
  game.bossContext = null;
  const mods = passiveModifiers();
  game.maxHp = core.stats.hp * (1 + state.coreLevel[core.id] * 0.08) * mods.hp;
  game.hp = game.maxHp;
  game.maxShield = core.stats.shield * (1 + state.coreEvolution[core.id] * 0.15);
  game.shield = game.maxShield;
  game.inBattle = true; game.paused = false; game.lastUpgradeWave = 0;
  state.run = { upgrades: [], danger: [], mode: game.challenge?.name || null, ultimateAwakening: {}, hiddenScore: 0 };
  refreshPanels();
}

function rewardByWave(mult = 1) {
  return Math.floor(game.wave * 12 * (1 + state.prestige.globalMul * 0.25) * mult);
}
function grantMetaRewards(reason = 'return') {
  const mods = passiveModifiers();
  const reward = rewardByWave(mods.reward);
  state.resources.coin += reward;
  state.resources.research += Math.floor(reward * 0.22);
  state.resources.energy += Math.floor(game.wave * 2 + state.stats.riskPick * 3);
  const cid = state.selectedCore;
  state.coreMastery[cid].xp += Math.floor(game.wave * 4);
  if (state.coreMastery[cid].xp >= (state.coreMastery[cid].lv + 1) * 100) {
    state.coreMastery[cid].xp = 0;
    state.coreMastery[cid].lv++;
  }
  state.stats.bestWave = Math.max(state.stats.bestWave, game.wave);
  checkUnlockTitles();
  state.run = null;
  flash(`런 정산(${reason}): +${reward} 코인`);
}

function baseEnemyByWave() {
  const waveType = waveTypes[(game.wave - 1) % waveTypes.length];
  let pool = enemyData.filter(e => e.spawnWave <= game.wave + 5);
  if (waveType.includes("고속")) pool = pool.filter(e => ["fast", "normal"].includes(e.category));
  if (waveType.includes("장갑")) pool = pool.filter(e => ["defense", "bossSupport"].includes(e.category));
  if (waveType.includes("원거리")) pool = pool.filter(e => e.category === "ranged");
  if (waveType.includes("방해")) pool = pool.filter(e => e.category === "disrupt");
  if (waveType.includes("황금")) pool = pool.filter(e => e.category === "economy");
  if (waveType.includes("공허")) pool = pool.filter(e => ["element", "hidden"].includes(e.category));
  return pool[(Math.random() * pool.length) | 0];
}

function applyElitePrefix(enemy, prefix) {
  enemy.prefix = prefix;
  if (prefix === "거대한") { enemy.r *= 1.4; enemy.hp *= 2.2; enemy.speed *= 0.82; }
  if (prefix === "재빠른") enemy.speed *= 1.9;
  if (prefix === "분열하는") enemy.splitOnDeath = 2;
  if (prefix === "반사하는") enemy.reflect = 0.15;
  if (prefix === "재생하는") enemy.regen = enemy.maxHp * 0.002;
  if (prefix === "무장한") enemy.def += 4;
  if (prefix === "은폐한") enemy.alpha = 0.35;
  if (prefix === "분노한") { enemy.atk *= 1.4; enemy.speed *= 1.2; }
  if (prefix === "흡수하는") enemy.absorb = 0.25;
  if (prefix === "저주받은") enemy.debuffAura = true;
  if (prefix === "황금의") enemy.reward *= 2.2;
  if (prefix === "공허의") enemy.ultResist = 0.35;
  if (prefix === "빙결의") enemy.frostHit = true;
  if (prefix === "화염의") enemy.burnHit = true;
  if (prefix === "전격의") enemy.shockHit = true;
  if (prefix === "심연의") { enemy.hp *= 1.4; enemy.atk *= 1.4; }
  if (prefix === "복제하는") enemy.cloneOnInterval = 8;
  if (prefix === "도망치는") enemy.flee = true;
  if (prefix === "봉쇄하는") enemy.slowAura = true;
  if (prefix === "오메가") { enemy.hp *= 2.8; enemy.atk *= 1.8; enemy.reward *= 2.6; enemy.omega = true; }
}

function spawnEnemy(isBoss = false) {
  const mods = passiveModifiers();
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.max(W, H) * 0.6;
  if (isBoss) {
    const idx = ((game.wave / 10 - 1) | 0) % bosses.length;
    const b = bosses[idx];
    if (b.hidden && !state.hiddenClues.includes('심연의 좌표')) return;
    const hp = b.hp * (1 + game.wave * 0.08) * mods.enemyHp;
    game.enemies.push({
      x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist,
      hp, maxHp: hp, speed: 0.24, atk: (16 + game.wave * 1.8) * mods.enemyAtk,
      def: 6, r: 24, name: b.name, cat: 'boss', reward: b.reward, boss: true,
      phase: 1, phaseMax: b.phase, pattern: b.pattern, weakness: b.weakness, patternTimer: 0, prefix: ''
    });
    game.bossContext = { id: b.id, name: b.name, phase: 1, weakness: b.weakness };
    if (b.hidden) { state.seenHiddenBoss = true; flash('히든 보스 조우!'); }
    return;
  }

  const base = baseEnemyByWave();
  const elite = Math.random() < Math.min(0.5, game.wave * 0.012);
  const prefix = elite ? elitePrefixes[(Math.random() * elitePrefixes.length) | 0] : "";
  const hp = (base.hp || 40) * (1 + game.wave * 0.08) * mods.enemyHp;
  const enemy = {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
    hp, maxHp: hp,
    speed: (base.speed || 0.6),
    atk: (base.atk || 6) * mods.enemyAtk,
    def: (base.def || 0),
    r: 11,
    name: `${prefix ? prefix + ' ' : ''}${base.name}`,
    cat: base.category,
    reward: (base.reward || 6),
    phase: 1,
    boss: false,
    prefix,
    alpha: 1
  };
  if (elite) applyElitePrefix(enemy, prefix);
  game.enemies.push(enemy);
}

function spawnDrone(type = 'default') {
  game.drones.push({ x: cx, y: cy, vx: 0, vy: 0, life: 360, type, r: 4 + (type === 'ult' ? 2 : 0) });
}

function fireAt(target, damage, effect = 'bolt', pierce = 0) {
  const dx = target.x - cx, dy = target.y - cy, d = Math.hypot(dx, dy) || 1;
  game.projectiles.push({ x: cx, y: cy, vx: dx / d * 7, vy: dy / d * 7, damage, effect, life: 60, pierce });
}

function selectAwakening(ultName) {
  const run = getRun();
  if (!run.ultimateAwakening[ultName]) {
    run.ultimateAwakening[ultName] = ULT_AWAKENINGS[ultName][(game.wave / 5 | 0) % 3];
  }
  return run.ultimateAwakening[ultName];
}

function castUltimate() {
  if (game.challenge?.effect?.silence) return;
  const u = ultimates[(state.coreEvolution[state.selectedCore] + state.coreLevel[state.selectedCore]) % ultimates.length];
  if (game.ultCd > 0 || game.ultCharge < u.chargeNeed) return;
  game.ultCharge = 0;
  const awakening = selectAwakening(u.name);
  game.ultCd = Math.max(4, u.cooldown - (awakening.includes('지속') ? 2 : 0));

  if (u.name === "블랙홀") {
    const mul = awakening === '압축 피해' ? 1.9 : 1.2;
    game.enemies.forEach(e => { e.x = (e.x + cx) / 2; e.y = (e.y + cy) / 2; e.hp -= u.effects.damage * mul; });
    if (awakening === '보상 증가') getRun().danger.push({ rewardBonus: 0.08 });
    state.stats.blackholeKills += game.enemies.filter(e => e.hp <= 0).length;
  } else if (u.name === "궤도 레이저") {
    for (let i = 0; i < (awakening === '다중 레이저' ? 3 : 1); i++) {
      const y = (i + 1) * H / ((awakening === '다중 레이저' ? 3 : 1) + 1);
      game.enemies.forEach(e => { if (Math.abs(e.y - y) < 40) e.hp -= u.effects.damage * (awakening === '방어 무시' ? 1.6 : 1); if (awakening === '화상') e.burn = 120; });
    }
  } else if (u.name === "미사일 폭풍") {
    game.enemies.slice(0, awakening === '분열 미사일' ? 20 : 10).forEach(e => {
      const dmg = u.effects.damage * (awakening === '보스 집중' && e.boss ? 2.2 : 1);
      e.hp -= dmg;
      if (awakening === '핵폭발') splash(e.x, e.y, 60, dmg * 0.45);
    });
  } else if (u.name === "시간 정지") {
    const stun = awakening === '지속 증가' ? 220 : 130;
    game.enemies.forEach(e => e.stun = stun);
    if (awakening === '내 공격 가속') game.timers.burst -= 0.5;
    if (awakening === '시간 역행') game.hp = Math.min(game.maxHp, game.hp + game.maxHp * 0.25);
  } else if (u.name === "전자기 폭풍") {
    game.enemies.forEach((e, i) => {
      e.hp -= u.effects.damage;
      if (awakening === '연쇄 번개' && i % 2 === 0) e.hp -= u.effects.damage * 0.45;
      if (awakening === '보호막 파괴') e.def = Math.max(0, e.def - 4);
    });
    if (awakening === '드론 충전') for (let i = 0; i < 4; i++) spawnDrone('ult');
  } else if (u.name === "성운 폭발") {
    splash(cx, cy, 210, u.effects.damage);
    if (awakening === '독성 구름') game.enemies.forEach(e => e.nano = 120);
    if (awakening === '화염 장판') game.enemies.forEach(e => e.burn = 150);
    if (awakening === '흡혈') game.hp = Math.min(game.maxHp, game.hp + game.maxHp * 0.2);
  } else if (u.name === "태양섬광") {
    game.enemies.forEach(e => { e.hp -= u.effects.damage * (e.cat === 'element' ? 1.5 : 1); if (awakening === '실명') e.stun = 70; if (awakening === '화염 중첩') e.burn = 180; });
  } else if (u.name === "공허 파동") {
    game.enemies.forEach(e => { e.hp -= u.effects.damage; if (awakening === '능력 봉인') e.disabled = 180; if (awakening === '소멸 확률' && Math.random() < 0.08) e.hp = 0; if (awakening === '보스 약화' && e.boss) e.atk *= 0.8; });
  } else if (u.name === "차원 균열") {
    game.enemies.forEach(e => { e.x += (Math.random() - 0.5) * 120; e.y += (Math.random() - 0.5) * 120; if (awakening === '역행') { const dx = e.x - cx, dy = e.y - cy, d = Math.hypot(dx, dy) || 1; e.x += dx / d * 80; e.y += dy / d * 80; } });
  } else if (u.name === "나노 범람") {
    game.enemies.forEach(e => { e.nano = 220; if (awakening === '방어 침식') e.def = Math.max(0, e.def - 3); if (awakening === '회복 차단') e.regen = 0; });
  } else if (u.name === "드론 출격") {
    const cnt = awakening === '요격대' ? 12 : 8;
    for (let i = 0; i < cnt; i++) spawnDrone('ult');
  } else if (u.name === "심판 포격") {
    const targets = game.enemies.filter(e => e.boss || e.cat === 'bossSupport').slice(0, 8);
    targets.forEach(e => { e.hp -= u.effects.damage * (awakening === '집중포격' ? 2 : 1); if (awakening === '처형사격' && e.hp / e.maxHp < 0.2) e.hp = 0; });
  } else if (u.name === "절대영도") {
    game.enemies.forEach(e => { e.stun = awakening === '완전 빙결' ? 170 : 110; e.hp -= awakening === '파쇄 피해' ? u.effects.damage * 1.4 : u.effects.damage * 0.7; e.chill = 200; });
  } else if (u.name === "방벽 전개") {
    game.shield = Math.min(game.maxShield, game.shield + (awakening === '보호막 재생' ? 220 : 140));
    if (awakening === '반사 피해') game.timers.guard = 240;
    if (awakening === '폭발 방패') splash(cx, cy, 140, u.effects.damage * 0.7);
  } else if (u.name === "초신성 폭발") {
    game.enemies.forEach(e => e.hp -= u.effects.damage * (awakening === '광역증폭' ? 1.4 : 1));
    if (awakening === '연쇄폭발') for (let i = 0; i < 2; i++) setTimeout(() => game.enemies.forEach(e => e.hp -= u.effects.damage * 0.35), 150 + i * 150);
    if (awakening === '잔류화염') game.enemies.forEach(e => e.burn = 180);
  }

  for (let i = 0; i < 45; i++) game.particles.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 40, color: 'rgba(160,220,255,.8)' });
}

window.addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); castUltimate(); }
  if (e.key === 'r') { if (game.inBattle) { game.inBattle = false; grantMetaRewards('retreat'); } }
});
document.getElementById('ultBtn').onclick = () => castUltimate();
document.getElementById('mobileStart').onclick = () => startRun();
document.getElementById('mobileRetreat').onclick = () => { if (game.inBattle) { game.inBattle = false; grantMetaRewards('retreat'); } };
document.getElementById('mobileMenu').onclick = () => {
  const nav = document.getElementById('navRail');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
};

function splash(x, y, r, dmg) {
  game.enemies.forEach(e => { if (Math.hypot(e.x - x, e.y - y) < r) e.hp -= dmg; });
}

function updateCoreAttack(dt) {
  const core = getCore();
  const mods = passiveModifiers();
  const { stat } = moduleStats();
  const atk = core.stats.atk * (1 + state.coreLevel[core.id] * 0.1 + getRun().upgrades.filter(u => u.type === 'atk').length * 0.12) * mods.atk;
  const aspd = core.stats.aspd * (1 + getRun().upgrades.filter(u => u.type === 'aspd').length * 0.1);
  game.timers.burst += dt;
  game.timers.pulse += dt;
  game.timers.drone += dt;
  game.timers.missile += dt;

  if (core.attackPattern === 'single' && game.timers.burst > Math.max(0.12, 0.75 / aspd) && game.enemies.length) {
    game.timers.burst = 0;
    const target = game.enemies.reduce((a, b) => dist2(a, cx, cy) < dist2(b, cx, cy) ? a : b);
    fireAt(target, 11 * atk, core.effectTheme, stat.ballistic > 0 ? 1 : 0);
  }

  if (core.attackPattern === 'burst' && game.timers.burst > 0.5 && game.enemies.length) {
    game.timers.burst = 0;
    const target = game.enemies.reduce((a, b) => dist2(a, cx, cy) < dist2(b, cx, cy) ? a : b);
    for (let i = 0; i < 3 + (stat.ballistic > 0 ? 1 : 0); i++) {
      const dx = target.x - cx, dy = target.y - cy, d = Math.hypot(dx, dy) || 1;
      const spread = (i - 1) * 0.12;
      const vx = (dx / d) * Math.cos(spread) - (dy / d) * Math.sin(spread);
      const vy = (dx / d) * Math.sin(spread) + (dy / d) * Math.cos(spread);
      game.projectiles.push({ x: cx, y: cy, vx: vx * 8, vy: vy * 8, damage: 9 * atk, effect: core.effectTheme, life: 50, pierce: 0 });
    }
  }

  if (core.attackPattern === 'pulse' && game.timers.pulse > 1.4) {
    game.timers.pulse = 0;
    const radius = 140 + stat.gravity * 80;
    game.enemies.forEach(e => {
      if (Math.hypot(e.x - cx, e.y - cy) < radius) {
        e.hp -= 8 * atk;
        e.stun = Math.max(e.stun || 0, 30 + stat.pendulum * 300);
      }
    });
  }

  if (core.attackPattern === 'guard' && game.timers.guard > 1.2) {
    game.timers.guard = 0;
    game.shield = Math.min(game.maxShield, game.shield + 5 + stat.shieldSat * 3);
    if (game.timers.guard > 200) splash(cx, cy, 95, 18 * atk);
  }

  if (core.attackPattern === 'drone' && game.timers.drone > Math.max(1.2, 3 - stat.drone * 0.25)) {
    game.timers.drone = 0;
    spawnDrone();
  }

  if (core.attackPattern === 'chaos') {
    if (Math.random() < 0.03) fireChaosBolt(atk);
  }

  if (core.attackPattern === 'prism' && game.timers.burst > 0.65 && game.enemies.length) {
    game.timers.burst = 0;
    const list = game.enemies.slice(0, 3 + (stat.chain > 0 ? 1 : 0));
    list.forEach(t => fireAt(t, 10 * atk, 'lightning', 0));
  }

  if (stat.laserSat > 0) {
    game.enemies.forEach(e => {
      const d = Math.hypot(e.x - cx, e.y - cy);
      if (d < 80) e.hp -= 0.06 * atk * stat.laserSat;
    });
  }

  if (stat.missile > 0 && game.timers.missile > 2.4 && game.enemies.length) {
    game.timers.missile = 0;
    const eliteOrBoss = game.enemies.filter(e => e.boss || e.prefix).sort((a, b) => b.hp - a.hp)[0] || game.enemies[0];
    if (eliteOrBoss) {
      game.projectiles.push({ x: cx, y: cy, vx: (eliteOrBoss.x - cx) / 35, vy: (eliteOrBoss.y - cy) / 35, damage: 35 * atk, effect: 'fire', life: 80, pierce: 0, missile: true });
    }
  }

  if (stat.burn > 0) {
    game.enemies.forEach(e => { if (Math.hypot(e.x - cx, e.y - cy) < 100) e.burn = Math.max(e.burn || 0, 60); });
  }
}

function fireChaosBolt(atk) {
  if (!game.enemies.length) return;
  const t = game.enemies[(Math.random() * game.enemies.length) | 0];
  const fx = ["plasma", "void", "ice", "fire", "lightning", "nano"][(Math.random() * 6) | 0];
  fireAt(t, (8 + Math.random() * 12) * atk, fx, (Math.random() < 0.3 ? 1 : 0));
}

function handleBossPattern(e, dt) {
  e.patternTimer += dt;
  const hpRatio = e.hp / e.maxHp;
  const nextPhase = Math.min(e.phaseMax, 1 + Math.floor((1 - hpRatio) * e.phaseMax));
  if (nextPhase > e.phase) {
    e.phase = nextPhase;
    flash(`${e.name} 페이즈 ${e.phase}`);
    for (let i = 0; i < 18; i++) game.particles.push({ x: e.x, y: e.y, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, life: 60, color: 'rgba(255,120,120,.9)' });
  }

  if (e.pattern === 'ram' && e.patternTimer > 4.5) {
    e.patternTimer = 0;
    const dx = cx - e.x, dy = cy - e.y, d = Math.hypot(dx, dy) || 1;
    e.x += dx / d * 90; e.y += dy / d * 90;
  }
  if (e.pattern === 'rift' && e.patternTimer > 5.2) {
    e.patternTimer = 0;
    e.x = cx + (Math.random() - 0.5) * 320;
    e.y = cy + (Math.random() - 0.5) * 320;
    for (let i = 0; i < 4; i++) spawnEnemy(false);
  }
  if (e.pattern === 'beam' && e.patternTimer > 2.8) {
    e.patternTimer = 0;
    game.hp -= 6 * e.phase;
  }
  if (e.pattern === 'judge' && e.patternTimer > 4) {
    e.patternTimer = 0;
    game.ultCharge = Math.max(0, game.ultCharge - 20);
    game.shield = Math.max(0, game.shield - 45);
  }
  if (e.pattern === 'satellite' && e.patternTimer > 3.5) {
    e.patternTimer = 0;
    for (let i = 0; i < 2; i++) spawnEnemy(false);
    game.hp -= 3 * e.phase;
  }
}

function updateEnemies(dt) {
  const { stat } = moduleStats();
  const slowUpgrade = getRun().upgrades.filter(u => u.type === 'slow').length * 0.07;

  for (const e of game.enemies) {
    if (e.stun > 0) { e.stun -= dt * 60; continue; }

    if (e.boss) handleBossPattern(e, dt);

    if (e.regen) e.hp = Math.min(e.maxHp, e.hp + e.regen * 60 * dt);
    if (e.burn) { e.burn -= dt * 60; e.hp -= 0.3; }
    if (e.nano) { e.nano -= dt * 60; e.hp -= 0.35; }

    if (e.cloneOnInterval) {
      e.cloneOnInterval -= dt;
      if (e.cloneOnInterval <= 0) {
        e.cloneOnInterval = 999;
        spawnEnemy(false);
      }
    }

    if (game.challenge?.effect?.enemyBlink && Math.random() < 0.004) {
      e.x += (Math.random() - 0.5) * 100;
      e.y += (Math.random() - 0.5) * 100;
    }

    const dx = cx - e.x, dy = cy - e.y;
    const d = Math.hypot(dx, dy) || 1;
    const grav = stat.gravity * 0.3;
    const chill = slowUpgrade + stat.chill + stat.pendulum;
    const s = Math.max(0.08, e.speed * (1 - chill));
    e.x += dx / d * s * 60 * dt;
    e.y += dy / d * s * 60 * dt;
    if (stat.warp && Math.random() < stat.warp * 0.004) {
      e.x += (Math.random() - 0.5) * 50;
      e.y += (Math.random() - 0.5) * 50;
    }
    if (grav > 0) {
      e.x += dx / d * grav;
      e.y += dy / d * grav;
    }

    if (d < 24) {
      let dmg = Math.max(1, e.atk - (state.coreEvolution[state.selectedCore] * 1.5));
      if (e.frostHit) dmg *= 1.2;
      if (e.burnHit) dmg *= 1.25;
      if (e.shockHit) game.ultCharge = Math.max(0, game.ultCharge - 8);
      if (game.shield > 0) {
        const hit = Math.min(game.shield, dmg);
        game.shield -= hit;
        state.stats.shieldAbsorb += hit;
        game.hp -= Math.max(0, dmg - hit);
      } else {
        game.hp -= dmg;
      }
      if (stat.reflect > 0) e.hp -= dmg * stat.reflect;
      e.hp -= 9999;
    }

    e.alpha = Math.max(0.2, e.alpha ?? 1);
  }
}

function updateProjectiles(dt) {
  const { stat } = moduleStats();
  for (const p of game.projectiles) {
    p.x += p.vx * 60 * dt;
    p.y += p.vy * 60 * dt;
    p.life -= 60 * dt;
    const hit = game.enemies.find(e => Math.hypot(e.x - p.x, e.y - p.y) < e.r + 3);
    if (!hit) continue;
    const bonus = getRun().upgrades.filter(u => u.type === 'crit').length * 0.2;
    let dmg = Math.max(1, p.damage - hit.def) * (1 + bonus);
    if (hit.reflect) dmg *= (1 - hit.reflect);
    if (hit.prefix.includes('공허')) dmg *= 0.75;
    if (game.bossContext && hit.boss && hit.weakness === '광자' && p.effect === 'lightning') dmg *= 1.25;
    hit.hp -= dmg;
    if (p.effect === 'nano') hit.nano = 120;
    if (p.effect === 'fire') hit.burn = 120;
    if (stat.execute > 0 && hit.hp / hit.maxHp < stat.execute) hit.hp = 0;

    game.ultCharge += 2;
    p.pierce = Math.max(0, (p.pierce || 0) - 1);
    if (p.pierce <= 0) p.life = 0;

    for (let i = 0; i < 5; i++) game.particles.push({ x: hit.x, y: hit.y, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, life: 30, color: pickEffectColor(p.effect) });

    if (stat.chain > 0) {
      const other = game.enemies.find(e => e !== hit && Math.hypot(e.x - hit.x, e.y - hit.y) < 80);
      if (other) other.hp -= dmg * 0.35;
    }
  }
  game.projectiles = game.projectiles.filter(p => p.life > 0);
}

function updateDrones(dt) {
  for (const d of game.drones) {
    d.life -= dt * 60;
    const target = game.enemies.reduce((best, e) => !best || dist2(e, d.x, d.y) < dist2(best, d.x, d.y) ? e : best, null);
    if (!target) continue;
    const dx = target.x - d.x, dy = target.y - d.y, dst = Math.hypot(dx, dy) || 1;
    d.vx = dx / dst * 2.6;
    d.vy = dy / dst * 2.6;
    d.x += d.vx; d.y += d.vy;
    if (dst < target.r + d.r + 4) {
      const dmg = d.type === 'ult' ? 28 : 14;
      target.hp -= dmg;
      state.stats.droneDamage += dmg;
      d.life -= 26;
    }
  }
  game.drones = game.drones.filter(d => d.life > 0);
}

function settleDeaths() {
  const { stat } = moduleStats();
  const dead = [];
  game.enemies = game.enemies.filter(e => { if (e.hp <= 0) { dead.push(e); return false; } return true; });
  dead.forEach(e => {
    const challengeReward = game.challenge?.effect?.rewardMul || 1;
    const reward = Math.floor(e.reward * (1 + getRun().upgrades.filter(u => u.type === 'economy').length * 0.12 + stat.reward) * challengeReward);
    state.resources.coin += reward;
    state.stats.totalKills++;
    missions.forEach(m => {
      if (m.name.includes('처치')) state.missionProgress[m.id] = (state.missionProgress[m.id] || 0) + 1;
      if (m.name.includes('보스') && e.boss) state.missionProgress[m.id] = (state.missionProgress[m.id] || 0) + 1;
      if (m.name.includes('위험') && state.stats.riskPick > 0) state.missionProgress[m.id] = state.stats.riskPick;
    });
    if (e.prefix.includes('황금')) state.resources.coin += 20;
    if (e.splitOnDeath) for (let i = 0; i < e.splitOnDeath; i++) spawnEnemy(false);
    if (e.prefix.includes('오메가')) game.ultCharge += 20;
    if (e.boss && game.hp / game.maxHp < 0.05) state.stats.bossLowHpKill++;
  });
}

function updateWave(dt) {
  game.waveTimer += dt;
  game.spawnTimer += dt;
  game.ultCd = Math.max(0, game.ultCd - dt);
  game.ultCharge += dt * 3 * (1 + getPermanentLevel('charge') * 0.08);

  if (game.spawnTimer > Math.max(0.16, 1.5 - game.wave * 0.02)) {
    game.spawnTimer = 0;
    const count = 1 + ((waveTypes[(game.wave - 1) % waveTypes.length].includes('스웜')) ? 2 : 0);
    for (let i = 0; i < count; i++) spawnEnemy(false);
  }

  if (game.waveTimer > 26) {
    game.wave++; game.waveTimer = 0;
    if (game.wave % 10 === 0) spawnEnemy(true);
    game.ultCharge += 12;
    state.stats.noUltWave++;

    if (game.wave % 3 === 0 && game.lastUpgradeWave !== game.wave) {
      showUpgradeChoice();
      game.lastUpgradeWave = game.wave;
    }
    maybeUnlock();
  }
}

function update(dt) {
  game.time += dt;
  if (!game.inBattle || game.paused) return;

  updateWave(dt);
  updateCoreAttack(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateDrones(dt);

  for (const pt of game.particles) { pt.x += pt.vx; pt.y += pt.vy; pt.life -= 1; }
  game.particles = game.particles.filter(p => p.life > 0);

  settleDeaths();
  if (game.hp <= 0) {
    game.inBattle = false;
    grantMetaRewards('death');
  }
}

function pickEffectColor(effect) {
  return ({ plasma: '#ff73d2', void: '#8a62ff', ice: '#90e0ff', fire: '#ff944d', lightning: '#e8e35b', nano: '#87ff9d', bolt: '#53f2ff' })[effect] || '#53f2ff';
}
function dist2(a, x, y) { return (a.x - x) * (a.x - x) + (a.y - y) * (a.y - y); }

function drawBackground() {
  const g = ctx.createRadialGradient(cx, cy, 40, cx, cy, Math.max(W, H));
  g.addColorStop(0, '#131b34'); g.addColorStop(1, '#04060d');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 120; i++) {
    const x = (i * 97 + game.time * 8) % W;
    const y = (i * 67) % H;
    ctx.fillStyle = `rgba(255,255,255,${(i % 7) / 20})`;
    ctx.fillRect(x, y, 1, 1);
  }
}

function drawShape(shape, x, y, s) {
  ctx.beginPath();
  if (shape === 'circle') ctx.arc(x, y, s, 0, Math.PI * 2);
  else if (shape === 'triangle') { for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 3; const px = x + Math.cos(a) * s, py = y + Math.sin(a) * s; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
  else if (shape === 'diamond') { ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath(); }
  else if (shape === 'hex') { for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; const px = x + Math.cos(a) * s, py = y + Math.sin(a) * s; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
  else if (shape === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const r = i % 2 ? s * 0.45 : s; const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
  else if (shape === 'ring') { ctx.arc(x, y, s, 0, Math.PI * 2); ctx.moveTo(x + s * 0.5, y); ctx.arc(x, y, s * 0.5, 0, Math.PI * 2, true); }
  else if (shape === 'cross') { ctx.rect(x - s * 0.2, y - s, s * 0.4, s * 2); ctx.rect(x - s, y - s * 0.2, s * 2, s * 0.4); }
  else if (shape === 'spiral') { for (let i = 0; i < 40; i++) { const a = i * 0.4, r = s * (i / 40); const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } }
  else if (shape === 'gear') { for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const r = i % 2 ? s : s * 0.75; const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.closePath(); }
  else { ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.9, y - s * 0.3); ctx.lineTo(x + s * 0.4, y + s); ctx.lineTo(x - s * 0.9, y + s * 0.3); ctx.closePath(); }
  ctx.fill();
}

function drawCore() {
  const core = getCore();
  const v = core.visualConfig;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(game.time * 2 * v.spin * 60);
  for (let r = 0; r < v.ringCount; r++) {
    ctx.strokeStyle = `hsla(${v.hue + r * 24},90%,60%,0.7)`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 18 + r * 11, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = `hsla(${v.hue},90%,60%,0.95)`;
  drawShape(v.shape, 0, 0, 13 + state.coreEvolution[state.selectedCore] * 2);
  ctx.restore();

  if (game.shield > 0) {
    ctx.strokeStyle = 'rgba(120,220,255,0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 36 + Math.sin(game.time * 6) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawModules() {
  const { owned } = moduleStats();
  game.modules = owned;
  owned.forEach((m, i) => {
    const a = game.time * 0.7 + i * Math.PI * 2 / owned.length;
    const r = 60 + Math.floor(i / 6) * 20;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    ctx.fillStyle = `hsla(${m.visualConfig.hue},90%,65%,.9)`;
    drawShape(['circle', 'diamond', 'triangle', 'hex'][i % 4], x, y, 6 + m.visualConfig.size * 0.2);
  });
}

function drawEntities() {
  for (const e of game.enemies) {
    const h = (e.cat === 'boss' ? 0 : 180) + (e.prefix?.includes('화염') ? 20 : 0) + (e.prefix?.includes('빙결') ? 180 : 0);
    ctx.globalAlpha = e.alpha ?? 1;
    ctx.fillStyle = `hsla(${h},80%,60%,0.95)`;
    const baseName = e.name.replace(/^.+\s/, '');
    drawShape((enemyData.find(x => x.name === baseName) || { visualConfig: { shape: 'hex' } }).visualConfig?.shape || 'hex', e.x, e.y, e.r);
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(e.x - e.r, e.y - e.r - 8, e.r * 2, 4);
    ctx.fillStyle = 'rgba(120,255,120,.8)'; ctx.fillRect(e.x - e.r, e.y - e.r - 8, e.r * 2 * (e.hp / e.maxHp), 4);

    if (e.boss) {
      ctx.fillStyle = 'rgba(255,130,130,.9)';
      ctx.fillText(`P${e.phase}/${e.phaseMax}`, e.x - 15, e.y - e.r - 15);
    }
  }

  for (const p of game.projectiles) { ctx.fillStyle = pickEffectColor(p.effect); ctx.beginPath(); ctx.arc(p.x, p.y, p.missile ? 4 : 3, 0, Math.PI * 2); ctx.fill(); }
  for (const d of game.drones) { ctx.fillStyle = d.type === 'ult' ? '#ffd36d' : '#9fe8ff'; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill(); }
  for (const p of game.particles) { ctx.fillStyle = p.color || 'rgba(255,255,255,.7)'; ctx.fillRect(p.x, p.y, 2, 2); }
}

function render() {
  drawBackground(); drawCore(); drawModules(); drawEntities();
}

function showUpgradeChoice() {
  game.paused = true;
  const overlay = document.getElementById('upgradeOverlay');
  const pool = [
    { name: '플라즈마 강화', type: 'atk', grade: '희귀', desc: '+공격력 12%' },
    { name: '연사 회로', type: 'aspd', grade: '일반', desc: '+공격속도 10%' },
    { name: '중력 필드', type: 'slow', grade: '희귀', desc: '+감속 7%' },
    { name: '수확 알고리즘', type: 'economy', grade: '희귀', desc: '+코인 12%' },
    { name: '임계 분석', type: 'crit', grade: '영웅', desc: '+치명 보정' },
    { name: '모듈 동조', type: 'module', grade: '영웅', desc: '모듈 효과 +20%' }
  ];
  let picks = shuffle(pool).slice(0, 3);
  overlay.classList.remove('hidden');
  overlay.innerHTML = `<div class='upgrade-box glass'><h2>런 중 업그레이드</h2><div class='upgrade-cards'>${picks.map((p, i) => `<div class='upgrade' data-i='${i}'><span class='tag'>${p.grade}</span><h3>${p.name}</h3><p class='small'>${p.desc}</p></div>`).join('')}</div><div style='margin-top:10px;display:flex;gap:8px;'><button id='reroll'>재굴림 (코인 30)</button><button id='riskPick'>위험 보상 선택</button><button id='skipUp'>건너뛰기</button></div></div>`;
  overlay.querySelectorAll('.upgrade').forEach(el => el.onclick = () => {
    const p = picks[+el.dataset.i];
    getRun().upgrades.push(p);
    if (p.type === 'module') state.coreEvolution[state.selectedCore]++;
    closeUpgrade();
  });
  overlay.querySelector('#reroll').onclick = () => { if (state.resources.coin >= 30) { state.resources.coin -= 30; showUpgradeChoice(); } };
  overlay.querySelector('#riskPick').onclick = () => {
    getRun().danger.push({ atk: 0.22, penalty: 0.12, rewardBonus: 0.08 });
    state.stats.riskPick++;
    game.hp = Math.max(1, game.hp * 0.88);
    getRun().hiddenScore += 1;
    closeUpgrade();
  };
  overlay.querySelector('#skipUp').onclick = closeUpgrade;
}
function closeUpgrade() { document.getElementById('upgradeOverlay').classList.add('hidden'); game.paused = false; }
function shuffle(a) { return [...a].sort(() => Math.random() - 0.5); }

function maybeUnlock() {
  const cid = state.selectedCore;
  const req = coreData.find(c => c.id === cid).evolutionConditions;
  const cond =
    (req.includes('블랙홀') && state.stats.blackholeKills > 30) ||
    (req.includes('보호막') && state.stats.shieldAbsorb > 500) ||
    (req.includes('드론') && state.stats.droneDamage > 400) ||
    (req.includes('궁극기') && state.stats.noUltWave > 15) ||
    (req.includes('저체력') && state.stats.bossLowHpKill > 0);

  if (cond && state.coreEvolution[cid] < 5) {
    state.coreEvolution[cid]++;
    flash(`${getCore().name} 진화 단계 +1`);
  }

  if (game.wave > 22) {
    const locked = coreData.filter(c => !state.unlockedCores.includes(c.id));
    if (locked.length) state.unlockedCores.push(locked[(Math.random() * locked.length) | 0].id);
  }

  if (state.stats.riskPick >= 3 && !state.hiddenClues.includes('위험 공명')) state.hiddenClues.push('위험 공명');
  if (state.stats.blackholeKills > 20 && !state.hiddenClues.includes('심연의 좌표')) state.hiddenClues.push('심연의 좌표');
  if (state.stats.droneDamage > 1000 && !state.hiddenClues.includes('군체의 계산식')) state.hiddenClues.push('군체의 계산식');

  if (state.hiddenClues.length >= 3) {
    const omega = coreData.find(c => c.name === '오메가 코어');
    if (omega && !state.unlockedCores.includes(omega.id)) {
      state.unlockedCores.push(omega.id);
      flash('히든 코어 해금: 오메가 코어');
    }
  }
}

function checkUnlockTitles() {
  if (state.stats.totalKills > 100 && !state.titles.includes('t0')) state.titles.push('t0');
  if (state.stats.bestWave >= 30 && !state.titles.includes('t1')) state.titles.push('t1');
  if (state.stats.blackholeKills > 40 && !state.titles.includes('t2')) state.titles.push('t2');
  if (state.hiddenClues.length >= 3 && !state.titles.includes('t3')) state.titles.push('t3');
  if (state.prestige.times >= 3 && !state.titles.includes('t4')) state.titles.push('t4');
}

function claimMission(mid) {
  const m = missions.find(x => x.id === mid);
  if (!m) return;
  const p = state.missionProgress[mid] || 0;
  if (p < m.target) return;
  state.resources.coin += m.reward;
  state.missionProgress[mid] = 0;
  flash(`미션 보상 +${m.reward} 코인`);
}

function flash(msg) {
  const div = document.createElement('div'); div.textContent = msg; div.className = 'glass';
  Object.assign(div.style, { position: 'absolute', left: '50%', top: '100px', transform: 'translateX(-50%)', padding: '8px 12px', zIndex: 40 });
  document.body.appendChild(div); setTimeout(() => div.remove(), 1300);
}

function panel(title, html) { return `<div class='panel glass'><h2>${title}</h2>${html}</div>`; }
const panelContainer = document.getElementById('panelContainer');
let currentScreen = 'main';
function setScreen(name) {
  currentScreen = name;
  document.querySelectorAll('[data-screen]').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === name));
  refreshPanels();
}
document.querySelectorAll('[data-screen]').forEach(btn => btn.onclick = () => setScreen(btn.dataset.screen));

function refreshPanels() {
  const core = getCore();
  const screens = {
    main: () => panel('Main Combat View', `<div class='card'><span class='badge'>Run Status</span><p>${game.inBattle ? '전투 진행 중' : '대기 중'} / 웨이브 ${game.wave}</p><button id='startBtn'>Start Run</button> <button id='retBtn' class='warn'>Runaway (귀환)</button><div class='small'>Space 또는 모바일 궁극기 버튼으로 즉시 발동.</div></div><div class='card'><b>실시간 모듈 상태</b><div class='small'>모듈 ${moduleStats().owned.length}개 장착 / 궁극기 충전 ${Math.floor(game.ultCharge)}</div></div>`),
    upgradeCenter: () => panel('Upgrade & Mastery Center', `<div class='grid2'>${PERMANENT_UPGRADES.map(up => {
      const lv = getPermanentLevel(up.id);
      const cost = getUpgradeCost(up);
      const unit = up.type === 'energy' ? '에너지' : '코인';
      return `<div class='card'><b>${up.name}</b><div class='small'>${up.desc}</div><div class='small'>Lv.${lv} · 비용 ${cost} ${unit}</div><button data-pup='${up.id}'>강화</button></div>`;
    }).join('')}</div><div class='card'><b>Mastery Snapshot</b><div class='small'>현재 코어 ${core.name} · 마스터리 Lv.${state.coreMastery[core.id].lv} · 진화 ${state.coreEvolution[core.id]}</div></div>`),
    coreSelect: () => panel('코어 선택', coreData.map(c => `<div class='card'><b>${state.unlockedCores.includes(c.id) ? c.name : '??? 실루엣'}</b><div class='small'>${state.unlockedCores.includes(c.id) ? c.description : '히든 조건 필요'}</div><div class='small'>진화 ${state.coreEvolution[c.id]} / 마스터리 ${state.coreMastery[c.id].lv}</div><div class='small'>패턴: ${c.attackPattern}</div><button data-core='${c.id}' ${!state.unlockedCores.includes(c.id) ? 'disabled' : ''}>선택</button></div>`).join('')),
    codex: () => panel('도감', `<input id='codexSearch' placeholder='검색 (코어/적/보스/모듈)'/><div class='mono' id='codexBody'></div>`),
    missions: () => panel('Mission & Rewards Dashboard', `<div class='list-scroll'>${missions.map(m => {
      const progress = state.missionProgress[m.id] || 0;
      const ratio = Math.min(100, Math.floor((progress / m.target) * 100));
      return `<div class='card'><b>${m.name}</b><div class='small'>${progress}/${m.target} 보상 ${m.reward}</div><div style='height:6px;background:rgba(255,255,255,.12);border-radius:999px;overflow:hidden;margin:6px 0;'><div style='width:${ratio}%;height:100%;background:linear-gradient(90deg,#61f2ff,#bc7cff);'></div></div><button data-mission='${m.id}'>보상 수령</button></div>`;
    }).join('')}</div>`),
    research: () => panel('연구소', `<div class='grid2'>
      <div class='card'><b>자동화 연구</b><p class='small'>코스트 200 연구</p><button id='r1'>구매</button></div>
      <div class='card'><b>오메가 연구</b><p class='small'>코스트 300 연구</p><button id='r2'>구매</button></div>
      <div class='card'><b>전역 보상 배율</b><p class='small'>코스트 240 연구</p><button id='r3'>강화</button></div>
      <div class='card'><b>진화 슬롯</b><p class='small'>코스트 260 연구</p><button id='r4'>강화</button></div></div>`),
    relics: () => panel('유물', relics.map(r => `<div class='card'><b>${r.name}</b><div class='small'>${r.description}</div><div class='small'>${state.unlockedRelics.includes(r.id) ? '해금됨' : '잠김'} / ${r.unlockCondition}</div><button data-rel='${r.id}'>해금 시도</button></div>`).join('')),
    mastery: () => panel('마스터리', `<div class='card'>현재 코어 ${core.name} Lv.${state.coreMastery[core.id].lv} XP ${state.coreMastery[core.id].xp}</div>${coreData.map(c => `<div class='card'><b>${c.name}</b> Lv.${state.coreMastery[c.id].lv}</div>`).join('')}`),
    challenge: () => panel('도전 모드', challengeModes.map(c => `<div class='card'><b>${c.name}</b><div class='small'>${c.rule}</div><button data-ch='${c.name}'>적용</button></div>`).join('')),
    prestige: () => panel('프레스티지', `<div class='card'>포인트 ${state.prestige.points} / 횟수 ${state.prestige.times}</div><button id='prestigeBtn'>프레스티지 실행</button><p class='small'>초월 포인트, 코어 기억, 유물 슬롯, 자동화, 오메가 연구 강화</p>`),
    hidden: () => panel('히든 단서', `<div class='card'><b>단서 목록</b>${state.hiddenClues.map(c => `<div>• ${c}</div>`).join('') || '<div>아직 발견 없음</div>'}</div><div class='card'>히든 보스 조우: ${state.seenHiddenBoss ? '예' : '아니오'}</div>`),
    planner: () => panel('기획서 열람', `<div class='small'>검색/접기 기능: 검색은 브라우저 찾기(Ctrl+F)와 본문 스크롤을 제공합니다.</div><div class='mono'>${ORIGINAL_PLANNER_TEXT}</div>`)
  };
  const renderScreen = screens[currentScreen] || screens.main;
  panelContainer.innerHTML = renderScreen();

  const sb = document.getElementById('startBtn'); if (sb) sb.onclick = () => startRun();
  const rb = document.getElementById('retBtn'); if (rb) rb.onclick = () => { if (game.inBattle) { game.inBattle = false; grantMetaRewards('retreat'); } };
  panelContainer.querySelectorAll('[data-pup]').forEach(b => b.onclick = () => buyPermanentUpgrade(b.dataset.pup));
  panelContainer.querySelectorAll('[data-core]').forEach(b => b.onclick = () => { state.selectedCore = b.dataset.core; flash(`${getCore().name} 선택`); refreshPanels(); });
  panelContainer.querySelectorAll('[data-ch]').forEach(b => b.onclick = () => { game.challenge = challengeModes.find(x => x.name === b.dataset.ch); flash(`도전 모드 적용: ${game.challenge.name}`); });
  panelContainer.querySelectorAll('[data-rel]').forEach(b => b.onclick = () => {
    const id = b.dataset.rel;
    if (!state.unlockedRelics.includes(id) && state.resources.coin >= 120) {
      state.resources.coin -= 120;
      state.unlockedRelics.push(id);
      flash('유물 해금');
      refreshPanels();
    }
  });
  panelContainer.querySelectorAll('[data-mission]').forEach(b => b.onclick = () => { claimMission(b.dataset.mission); refreshPanels(); });

  const pbtn = document.getElementById('prestigeBtn');
  if (pbtn) pbtn.onclick = () => {
    const gain = Math.floor(state.stats.bestWave / 20);
    if (gain > 0) {
      state.prestige.points += gain;
      state.prestige.times++;
      state.prestige.globalMul += 0.08;
      state.resources.coin = 0; state.resources.energy = 0; state.resources.research = 0;
      flash(`프레스티지 +${gain}`);
    }
  };

  const search = document.getElementById('codexSearch');
  const body = document.getElementById('codexBody');
  if (search && body) {
    const refresh = () => {
      const q = search.value.trim();
      const src = [...coreData, ...enemyData, ...modules, ...ultimates, ...bosses, ...relics, ...missions, ...titles];
      body.textContent = src
        .filter(x => !q || JSON.stringify(x).includes(q))
        .slice(0, 1000)
        .map(x => `${x.name || x.id} | ${x.category || ''} | ${x.description || x.ability || x.unlockCondition || ''}`)
        .join('\n');
    };
    search.oninput = refresh;
    refresh();
  }

  ['r1', 'r2', 'r3', 'r4'].forEach((id, i) => {
    const b = document.getElementById(id);
    if (b) b.onclick = () => {
      const cost = [200, 300, 240, 260][i];
      if (state.resources.research >= cost) {
        state.resources.research -= cost;
        if (i === 2) state.prestige.globalMul += 0.02;
        if (i === 1) state.prestige.omegaResearch++;
        if (i === 3) state.coreEvolution[state.selectedCore] += 1;
        flash('연구 완료');
        refreshPanels();
      }
    };
  });
}
setScreen('main');

function updateHud() {
  const stats = [
    ['코인', Math.floor(state.resources.coin)],
    ['연구', Math.floor(state.resources.research)],
    ['에너지', Math.floor(state.resources.energy)],
    ['웨이브', game.wave],
    ['HP', `${Math.max(0, Math.floor(game.hp))}/${Math.floor(game.maxHp)}`],
    ['실드', `${Math.floor(game.shield)}/${Math.floor(game.maxShield)}`],
    ['궁극기', `${Math.floor(game.ultCharge)}${game.challenge?.effect?.silence ? ' (봉인)' : ''}`],
    ['모드', game.challenge?.name || '기본'],
    ['코어', getCore().name],
    ['배율', `x${state.prestige.globalMul.toFixed(2)}`]
  ];
  document.getElementById('hudStats').innerHTML = stats.map(([label, value]) => `<div class='stat'><span class='label'>${label}</span><span class='value'>${value}</span></div>`).join('');
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  update(dt); render(); updateHud();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
setInterval(() => save(), 15000);

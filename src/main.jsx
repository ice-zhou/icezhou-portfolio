import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { Alignment, Fit, Layout, Rive as RiveRuntime } from '@rive-app/canvas';
import './styles.css';

const Spline = React.lazy(() => import('@splinetool/react-spline'));
const RivePlayer = React.lazy(() => import('@rive-app/react-canvas'));

const remote = {
  profile: 'https://framerusercontent.com/images/nKZxL3ov6hieQXZbst1I06HCxPI.jpg?width=627&height=627',
  navAvatar: '/assets/nav-avatar.jpg',
  avatar: 'https://framerusercontent.com/images/GPvMOYFAY3ni4KJV3GQuc3IF4.jpg?width=400&height=400',
  hero: 'https://framerusercontent.com/images/ILyIs9RAVctBPayP51c5h9h183I.png?scale-down-to=2048&width=3408&height=1680',
  game: 'https://framerusercontent.com/images/36ShfVCREfvo4ZUY5WJmijhZeE.png?width=600&height=400',
  ui: 'https://framerusercontent.com/images/zDfwxSRLwzsOZCr0BxmoiFm89g.png?scale-down-to=2048&width=2400&height=1600',
  redStudy:
    'https://framerusercontent.com/images/jj62p6Si3j6yUdEU8fQ6GtQreRg.jpeg?scale-down-to=2048&width=3222&height=2240',
  eclipse:
    'https://framerusercontent.com/images/geeG47IkajQh035JWtE0QL7uWwg.jpeg?scale-down-to=2048&width=3262&height=2300',
};

const heroSplineScene = 'https://prod.spline.design/PxOKxwKBiQAInzI6/scene.splinecode?v=camera-final-20260521';
const avatarRive = {
  src: '/assets/avatar.riv',
  artboard: 'Avatars',
  stateMachines: 'State Machine 1',
};

const works = [
  {
    slug: 'astranova-mission-identity',
    title: '米线游戏制作管理',
    type: '3D Design',
    image: remote.profile,
    alt: 'Minimal gray 3D production objects',
  },
  {
    slug: 'magma-essence-branding',
    title: 'MAGMA Essence Branding',
    type: 'Branding',
    image: remote.game,
    alt: 'Blue 3D user interface composition',
  },
  {
    slug: 'rouge-reverie',
    title: 'Rouge Reverie',
    type: 'Art Direction',
    image: '/assets/work-rouge.jpeg',
    alt: 'Editorial portrait of a woman in red',
  },
  {
    slug: 'red-study',
    title: 'Red Study',
    type: 'Art Direction',
    image: remote.redStudy,
    alt: 'Portrait of woman in red with glowing skin and holding tennis racket',
  },
  {
    slug: 'eclipse-editorial-series',
    title: 'Eclipse Editorial Series',
    type: 'Art Direction',
    image: remote.eclipse,
    alt: 'Stylish sunglasses portrait',
  },
  {
    slug: 'vortex-one-racing-identity',
    title: 'Vortex One Racing Identity',
    type: 'TVC',
    image: '/assets/work-vortex.png',
    alt: 'Focused racer portrait',
  },
];

const featuredWorks = works
  .filter((work) => !['rouge-reverie', 'red-study'].includes(work.slug))
  .slice(0, 4);

const workApproach = [
  {
    slug: 'project-framing',
    number: '01',
    title: '米线游戏制作管理系统',
    description: 'Define the story, product goal, and visual direction before the interface starts taking shape.',
    image: '/assets/mixian-cover.png',
    video: '/assets/miline-cover.mp4',
    tags: ['复杂系统', 'UX strategy', 'Scope'],
  },
  {
    slug: 'visual-system',
    number: '02',
    title: '本地化翻译编辑器',
    description: 'Build a flexible design language for screens, motion states, assets, and repeated project moments.',
    image: remote.game,
    video: '/assets/bg-type-2.mp4',
    tags: ['复杂系统', 'UX strategy', 'Scope'],
  },
  {
    slug: 'motion-prototype',
    number: '03',
    title: 'HoYo & Seed Design',
    description: 'Translate key interactions into timing, rhythm, and animated prototypes that make the work feel alive.',
    image: remote.hero,
    video: '/assets/component-library-cover-v2.mp4',
    tags: ['Motion', 'Spline', 'Rive'],
  },
  {
    slug: 'case-delivery',
    number: '04',
    title: 'Case delivery',
    description: 'Package each project into a clear portfolio narrative with images, context, and scalable detail pages.',
    image: '/assets/ascii-game-controller-black.gif',
    imageClassName: 'ascii-controller-cover',
    tags: ['Portfolio', 'Case study', 'Launch'],
  },
];

const expertise = [
  {
    title: 'Art Direction',
    image: '/assets/art-direction.svg',
    alt: 'An abstract shape that representative of Art Direction',
    text: 'Development of visual concepts, compositions, and campaign identities that define how a story is seen and remembered.',
  },
  {
    title: 'Film & Motion',
    image: '/assets/film-motion.svg',
    alt: 'An abstract shape that representative of Film & Motion',
    text: 'Cinematic storytelling through rhythm, light, and movement, guiding attention and emotion with intent.',
  },
];

const awards = [
  {
    title: '米哈游',
    label: '[企业效能｜B端]',
    year: '2026',
    roleTitle: '资深UX设计师',
    badge: '连续绩效季涨薪20%，优秀导师',
    intro:
      '负责企业效能方向多个核心 B 端系统设计，覆盖游戏制作管理、本地化协作、设计系统与组件配置平台。作为设计侧 Owner，承担产品 0-1 设计、复杂流程梳理、体验方案设计、设计规范建设及设计小组协作支持。',
    details: [
      {
        title: '米线游戏制作管理系统',
        text: '面向游戏项目组的制作管理系统，服务游戏策划、制作、程序、QA 等全流程协作场景。作为设计侧 Owner，负责产品从 0-1 的整体 UX 设计，并带领设计小组长期支持上线与迭代。',
      },
      {
        title: 'LMS 本地化系统',
        text: '面向游戏国际化与多语言本地化协作场景，负责整个产品 UX 设计。系统服务版本内容更新、多语种翻译、语言审核、本地化适配等复杂流程。',
      },
      {
        title: 'HoYo Design 组件体系与组件配置平台',
        text: '作为设计侧 Owner，负责米哈游基础组件体系 HoYo Design 的 0-1 搭建，并在此基础上完成组件库配置平台设计与上线。支持不同业务平台基于统一组件体系进行风格定制，降低重复设计与研发成本。',
      },
    ],
    metaRole: 'UX设计师',
    metaYear: '2022.08 – 至今',
  },
  {
    title: '字节跳动',
    label: '[教育线｜B+C端]',
    year: '2022',
    roleTitle: 'UX 设计师',
    badge: '绩效M+ 完成2-1～2-2晋级',
    intro:
      '负责教育资源生产方向业务，包括国内外教育资源生产、消费、结算、产能监控、质量管控，以及面向海外市场的题目快速问答体验。',
    details: [
      {
        title: '磁极众包 & Solverlance',
        items: [
          '0-1 负责磁极众包（国内）与 Solverlance（海外）Web + H5 端设计。',
          '面向 B 端资源生产流程，设计覆盖任务生产、任务消费、结算、产能监控、质量管理等核心模块。',
          '面向 C 端用户，支持美国、印度市场的题目快速问答场景。',
          '负责产品内动效设计、运营活动设计与关键视觉体验。',
        ],
      },
      {
        title: 'Seed 组件库 & Brickform 低代码搭建平台',
        items: [
          '结合教育资源生产业务特性，与前端团队从 0-1 搭建 Seed 组件库。',
          '组件库支持 Web 端搭建后无缝适配 H5 端，提升跨端设计与研发效率。',
          '基于 Seed 组件库，完成教育资源生产系统低代码搭建平台 Brickform 的设计。',
          '支持业务方根据不同生产场景快速搭建资源生产系统。',
        ],
      },
    ],
    metaRole: 'UX 设计师',
    metaYear: '2020.08 – 2022.08',
  },
  {
    title: '爱奇艺',
    label: '[智能平台｜C端]',
    year: '2020',
    roleTitle: 'UI / 产品体验设计师',
    badge: '绩效A+ 2年2涨',
    intro:
      '负责爱奇艺主站创作中心模块 UI 设计，包括剧情二创、剧情表情包制作、视频剪辑等内容创作工具。创作中心基于爱奇艺视频资源，为用户提供内容再创作能力。',
    details: [
      {
        title: '爱奇艺主站创作中心',
        items: [
          '独立负责爱奇艺主站创作中心模块 UI 设计。',
          '设计剧情二创、剧情表情包制作、视频剪辑等内容创作场景。',
          '支持创作中心相关重大节日活动、创作奖励、流量扶持等运营活动视觉设计。',
          '根据内容创作场景持续优化用户体验与视觉表达。',
        ],
      },
      {
        title: '随刻 Vlog 视频 App',
        items: [
          '参与 0-1 搭建随刻 Vlog 视频 App。',
          '负责视频剪辑部分设计，支持 Vlog 细分领域视频创作体验。',
          '参与移动端内容创作工具的交互与视觉体验设计。',
        ],
      },
    ],
    metaRole: 'UI / 产品体验设计师',
    metaYear: '2018.08 – 2020.08',
  },
  {
    title: '沪江',
    label: '[CCtalk｜C端]',
    year: '2018',
    roleTitle: 'UI 设计师',
    badge: '',
    intro:
      '负责教育直播产品 CCtalk 移动端与 Web 端 UI 设计，覆盖老师端授课、学员端学习、在线学习社区等核心场景。',
    details: [
      {
        title: 'CCtalk 直播教育平台',
        items: [
          '负责 CCtalk 移动端、Web 端核心功能 UI 设计。',
          '独立负责微课小程序 UI 设计。',
          '支持老师端授课、学员端学习、在线学习社区等场景体验优化。',
          '定期收集业务需求，结合老师与学员用户反馈，规划产品优化路径并推进落地。',
        ],
      },
    ],
    metaRole: 'UI 设计师',
    metaYear: '2017.08 – 2018.08',
  },
];

const efficiencyShowcase = {
  hero: '/assets/figma-ai-hero.png',
  heroVideo: '/assets/ascii-magic-8.mp4',
  heroPoster: '/assets/ascii-magic-7.png',
  practices: [
    {
      kicker: 'AI x AE',
      title: '抽奖动画自动化插件',
      image: '/assets/figma-ai-card-ae.png',
      alt: 'AI x AE 抽奖动画自动化插件',
    },
    {
      kicker: 'AI x Skill',
      title: '生成符合设计规范页面',
      image: '/assets/figma-ai-card-skill.png',
      alt: 'AI x Skill 生成符合设计规范页面',
    },
    {
      kicker: 'AI x Design Context',
      title: '理解功能逻辑生成设计',
      image: '/assets/figma-ai-card-context.png',
      alt: 'AI x Design Context 理解功能逻辑生成设计',
    },
  ],
};

const quotes = [
  {
    text: 'Working together was an inspiring experience. The attention to detail, ability to translate abstract ideas into visuals, and the precision in execution made our brand identity feel alive. The result exceeded expectations and set a new standard for how we present ourselves.',
    by: 'Sarah Mitchell · [Creative Director at Acme Inc]',
  },
  {
    text: 'Working together felt like directing a story rather than producing a project. Every frame carried intention, every decision felt cinematic. The campaign became more than visuals, it became a language.',
    by: 'Marco Ruiz · [Executive Producer at Northline]',
  },
  {
    text: 'A rare balance of restraint and imagination. The work gave us a system we could grow with, while still feeling distinct in every single touchpoint.',
    by: 'Lena Park · [Brand Lead at Aurelia]',
  },
];

const journals = [
  ['On visual rhythm and restraint', 'Essay', '2026'],
  ['Building identity systems around motion', 'Process', '2025'],
  ['Why campaigns need a cinematic spine', 'Notes', '2025'],
];

const workDetails = {
  'astranova-mission-identity': {
    facts: [
      ['Project', '米线游戏制作管理'],
      ['Role', '设计主owner，0-1搭建+跟进迭代'],
      ['Company', '米哈游'],
      ['Industry', '上线，交付5个游戏项目组'],
      ['Timeline', '2023.12-至今'],
      ['Contributors', 'Finn Wilder, Ava Chen, Leo Hart'],
      ['Year', '2025'],
    ],
    headline:
      '"Designing for space is not about escaping reality, but about expanding it. The mission is not just to reach orbit, but to make people feel something when they look up. It’s about translating the unknown into form, turning science into emotion, and building symbols that remind us how small we are and how far we can go."',
    copy: [
      'AstraNova Mission Identity is a conceptual branding and visual design project for a fictional private space mission. The goal was to reimagine how aerospace branding could feel in the modern era less institutional, more emotional, and rooted in the awe of human ambition.',
      'The visual direction centered on the contrast between fragility and strength. We used light, reflection, and slow-motion 3D sequences to communicate the tension between isolation and discovery. The identity system extends across mission badges, capsule markings, digital dashboards, and motion pieces.',
    ],
    images: [
      { src: remote.profile, alt: 'Minimal gray 3D production objects' },
      { src: '/assets/work-astranova.png', alt: 'Space Mission - Focused Astronaut' },
      { src: remote.hero, alt: '3D motion and design icon composition' },
      { src: remote.game, alt: 'Blue 3D user interface composition' },
      { src: '/assets/work-vortex.png', alt: 'Focused racer portrait' },
    ],
  },
  'magma-essence-branding': {
    facts: [
      ['Project', 'MAGMA Essence Branding'],
      ['Role', 'Branding, Photography Direction'],
      ['Company', 'Ember Atelier'],
      ['Industry', 'Fragrance, Fashion, Lifestyle'],
      ['Timeline', '7 Weeks'],
      ['Contributors', 'Finn Wilder, Lina Vesari, Tomas Kade'],
      ['Year', '2025'],
    ],
    headline:
      '"Power can be silent. Heat can be invisible. True identity burns from within, not through noise, but through presence."',
    copy: [
      'MAGMA Essence is a conceptual fragrance branding project inspired by primal energy and the quiet power of transformation. The brand explores the connection between heat, identity, and form, a fragrance that embodies intensity without chaos.',
      'The visual direction centers on the contrast between raw earth and refined design. Textures of volcanic rock and liquid fire meet minimal, monolithic packaging that feels sculpted rather than manufactured. Every frame is designed to convey tension between restraint and eruption, the calm before ignition.',
    ],
    images: [
      { src: remote.game, alt: 'Blue 3D user interface composition' },
      {
        src: 'https://framerusercontent.com/images/NwWohqk00OzMlTfPpT1z9CK1evU.webp?width=1808&height=2400',
        alt: 'Silhouetted portrait in red and black lighting',
      },
      {
        src: 'https://framerusercontent.com/images/JbulSr4IrzsMNdLwzSsKFsADNek.png?width=1648&height=890',
        alt: 'Person in white hoodie against a red background',
      },
      {
        src: 'https://framerusercontent.com/images/EWgeEfHlzrZZVlD9zD1N8Wp5NxU.webp?width=1808&height=2400',
        alt: 'Black dropper bottle on molten rock',
      },
      {
        src: 'https://framerusercontent.com/images/qt6wIvDz4GiQctX0k5DNtzpWeA.webp?scale-down-to=4096&width=3616&height=4800',
        alt: 'Perfume bottle resting over glowing lava',
      },
      {
        src: 'https://framerusercontent.com/images/g8qE9VfveBboKiTnYyF1IDr1HJM.webp?width=1808&height=2400',
        alt: 'Black cap placed on volcanic surface',
      },
    ],
  },
  'rouge-reverie': {
    facts: [
      ['Project', 'Rouge Reverie'],
      ['Role', 'Art direction, image system, editorial layout'],
      ['Company', 'Independent concept'],
      ['Industry', 'Fashion / Editorial'],
      ['Timeline', '2025.01-2025.02'],
      ['Contributors', 'IceZhou, Sarah Mitchell'],
      ['Year', '2025'],
    ],
    headline:
      '"The image system is built around restraint: one clear mood, one strong color temperature, and enough negative space for the portrait to hold the whole story."',
    copy: [
      'Rouge Reverie is an editorial direction study centered on portrait rhythm, color restraint, and cinematic cropping. The project frames fashion imagery as a sequence of quiet moments rather than a single campaign still.',
      'The visual system balances soft skin tones, saturated red accents, and sparse typography. The result is a portfolio-ready case study that can scale from image-led hero sections into detail pages with supporting motion and layout treatments.',
    ],
    images: [
      { src: '/assets/work-rouge.jpeg', alt: 'Editorial portrait of a woman in red' },
      { src: remote.redStudy, alt: 'Portrait of woman in red with glowing skin and holding tennis racket' },
      { src: '/assets/work-obsidian.jpeg', alt: 'Dark editorial product study' },
      { src: remote.eclipse, alt: 'Stylish sunglasses portrait' },
      { src: '/assets/work-magma.jpeg', alt: 'Abstract editorial branding study' },
    ],
  },
  'red-study': {
    facts: [
      ['Project', 'Red Study'],
      ['Role', 'Creative direction, visual research, case composition'],
      ['Company', 'Independent concept'],
      ['Industry', 'Art direction / Campaign'],
      ['Timeline', '2024.10-2024.12'],
      ['Contributors', 'IceZhou, Marco Ruiz'],
      ['Year', '2024'],
    ],
    headline:
      '"Red is treated less as a color and more as a pacing device, guiding the viewer through heat, focus, pause, and release."',
    copy: [
      'Red Study is a campaign and portrait exploration that uses a narrow color field to create intensity across a set of still images. The project studies how a strong visual motif can unify different compositions without flattening the emotion of each image.',
      'The case page is structured for image-heavy presentation, with generous spacing and large-format gallery moments. It is intended as a flexible template for future projects that need to show process, mood, and final campaign materials together.',
    ],
    images: [
      { src: remote.redStudy, alt: 'Portrait of woman in red with glowing skin and holding tennis racket' },
      { src: remote.eclipse, alt: 'Stylish sunglasses portrait' },
      { src: '/assets/work-rouge.jpeg', alt: 'Editorial portrait of a woman in red' },
      { src: '/assets/work-vortex.png', alt: 'Focused racer portrait' },
      { src: remote.hero, alt: '3D motion and design icon composition' },
    ],
  },
  'eclipse-editorial-series': {
    facts: [
      ['Project', 'Eclipse Editorial Series'],
      ['Role', 'Editorial direction, look development, image sequencing'],
      ['Company', 'Independent concept'],
      ['Industry', 'Fashion / Editorial'],
      ['Timeline', '2024.08-2024.09'],
      ['Contributors', 'IceZhou, Lena Park'],
      ['Year', '2024'],
    ],
    headline:
      '"The series uses distance, reflection, and cropped detail to make the styling feel observed rather than staged."',
    copy: [
      'Eclipse Editorial Series is a fashion image sequence focused on accessories, expression, and the tension between close-up detail and atmospheric space.',
      'The layout system favors large image fields and quiet captions so the photography can carry the narrative. It can be extended into campaign pages, lookbooks, and motion-led social edits.',
    ],
    images: [
      { src: remote.eclipse, alt: 'Stylish sunglasses portrait' },
      { src: remote.redStudy, alt: 'Portrait of woman in red with glowing skin and holding tennis racket' },
      { src: '/assets/work-rouge.jpeg', alt: 'Editorial portrait of a woman in red' },
      { src: '/assets/work-obsidian.jpeg', alt: 'Dark editorial product study' },
      { src: remote.ui, alt: 'Digital product interface composition' },
    ],
  },
  'vortex-one-racing-identity': {
    facts: [
      ['Project', 'Vortex One Racing Identity'],
      ['Role', 'Visual identity, motion framing, launch direction'],
      ['Company', 'Independent concept'],
      ['Industry', 'Sports / TVC'],
      ['Timeline', '2024.05-2024.07'],
      ['Contributors', 'IceZhou, Finn Wilder'],
      ['Year', '2024'],
    ],
    headline:
      '"The identity moves like a race broadcast: fast, graphic, tightly framed, and always built around the emotional pressure of the next second."',
    copy: [
      'Vortex One Racing Identity is a motion-first branding concept for a fictional racing team. The project combines cinematic portraits, bold graphic crops, and fast-moving layout structures.',
      'The system was designed to work across launch films, broadcast graphics, social motion, and case-study imagery. It gives the project a high-speed surface while preserving a clean portfolio narrative.',
    ],
    images: [
      { src: '/assets/work-vortex.png', alt: 'Focused racer portrait' },
      { src: remote.hero, alt: '3D motion and design icon composition' },
      { src: remote.game, alt: 'Blue 3D user interface composition' },
      { src: '/assets/work-reality.png', alt: 'Reality themed visual direction' },
      { src: remote.profile, alt: 'Minimal gray 3D production objects' },
    ],
  },
};

const navItems = ['Works [ 4 ]', 'About', 'Journal [ 5 ]', 'Contact', 'All Pages [ 11 ]'];
const heroTitle = 'UX & Motion Designer';
const themeStorageKey = 'icezhou-portfolio-theme';

const getInitialTheme = () => {
  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
};

const initialTheme = getInitialTheme();
document.documentElement.dataset.theme = initialTheme;

const getRouteFromWindow = () => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
});

const routeTransitionTiming = {
  cover: 360,
  reveal: 680,
};

const getRoutePath = (route) => `${route.pathname}${route.search}`;

const getRouteUrl = (route) => `${route.pathname}${route.search}${route.hash}`;

const getTransitionDirection = (fromRoute, toRoute) => {
  const fromDetail = fromRoute.pathname.startsWith('/works/');
  const toDetail = toRoute.pathname.startsWith('/works/');

  if (fromDetail && !toDetail) return 'back';
  return 'forward';
};

function scrollToRouteTarget(route) {
  if (route.hash) {
    const target = document.getElementById(route.hash.slice(1));
    if (target) {
      target.scrollIntoView({ block: 'start' });
      return;
    }
  }

  window.scrollTo({ top: 0, left: 0 });
}

function Reveal({ children, className = '', delay = 0, float = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: float ? 72 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: '-6% 0px -6% 0px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function FloatGroup({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 120 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: '-6% 0px -6% 0px' }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function MotionSection({ children, className = '', id, sticky = false }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: sticky ? 0 : 128 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: '-4% 0px -4% 0px' }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}

function ParallaxImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  as: Tag = 'figure',
  hover = true,
}) {
  return (
    <Tag className={`parallax-frame ${className}`}>
      <motion.img
        className={imageClassName}
        src={src}
        alt={alt}
        loading={loading}
        whileHover={hover ? { scale: 1.035 } : undefined}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </Tag>
  );
}

function HeroCover() {
  const coverRef = useRef(null);
  const hasLeftView = useRef(true);
  const [replayKey, setReplayKey] = useState(0);
  const replayScene = `${heroSplineScene}&replay=${replayKey}`;

  useEffect(() => {
    const cover = coverRef.current;
    if (!cover) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hasLeftView.current) {
            setReplayKey((current) => current + 1);
            hasLeftView.current = false;
          }
        } else {
          hasLeftView.current = true;
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(cover);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={coverRef} className="hero-media hero-media-static">
      <div
        key={replayScene}
        className="spline-cover"
        dangerouslySetInnerHTML={{
          __html: `<spline-viewer url="${replayScene}"></spline-viewer>`,
        }}
      />
    </figure>
  );
}

function AnimatedHeroTitle() {
  const titleRef = useRef(null);
  const hasLeftView = useRef(true);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (hasLeftView.current) {
            setReplayKey((current) => current + 1);
            hasLeftView.current = false;
          }
        } else {
          hasLeftView.current = true;
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return (
    <h1 ref={titleRef} className="hero-title-animated" aria-label={heroTitle}>
      <motion.span
        key={replayKey}
        className="hero-title-image-wrap"
        aria-hidden="true"
        initial={{ y: 18, opacity: 0, filter: 'blur(16px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
      >
        <img className="hero-title-image hero-title-image-dark" src="/assets/hero-title-dark.png" alt="" fetchPriority="high" />
        <img
          className="hero-title-image hero-title-image-light"
          src="/assets/hero-title-light.png"
          alt=""
          fetchPriority="high"
        />
      </motion.span>
    </h1>
  );
}

function RiveAvatar() {
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const inputsRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let isDisposed = false;
    let resizeObserver;

    const resizeRive = () => {
      riveRef.current?.resizeDrawingSurfaceToCanvas();
    };

    const riveInstance = new RiveRuntime({
      src: avatarRive.src,
      canvas,
      artboard: avatarRive.artboard,
      stateMachines: avatarRive.stateMachines,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
      }),
      onLoad: () => {
        if (isDisposed) return;

        resizeRive();
        const stateInputs = riveInstance.stateMachineInputs(avatarRive.stateMachines) || [];
        inputsRef.current = stateInputs.reduce((inputs, input) => {
          inputs[input.name] = input;
          return inputs;
        }, {});
      },
    });

    riveRef.current = riveInstance;
    window.addEventListener('resize', resizeRive);

    if ('ResizeObserver' in window && canvas.parentElement) {
      resizeObserver = new ResizeObserver(resizeRive);
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', resizeRive);
      resizeObserver?.disconnect();
      riveInstance.cleanup();
      riveRef.current = null;
      inputsRef.current = {};
    };
  }, []);

  const updateInput = (name, value = true) => {
    const input = inputsRef.current[name];
    if (!input) return;

    if (typeof input.fire === 'function') {
      input.fire();
    } else if ('value' in input) {
      input.value = value;
    }
  };

  const handlePointerEnter = () => {
    updateInput('face hover', true);
    updateInput('head-hover', true);
    updateInput('cursor follow', true);
  };

  const handlePointerMove = () => {
    updateInput('cursor follow', true);
  };

  const handlePointerLeave = () => {
    updateInput('face unhover', true);
    updateInput('face hover', false);
    updateInput('head-hover', false);
    updateInput('cursor follow', false);
  };

  return (
    <canvas
      ref={canvasRef}
      className="hero-avatar-canvas"
      width="314"
      height="314"
      aria-label="Animated designer avatar"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    />
  );
}

function Header({ routePath = window.location.pathname, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const showNavAvatar = false;
  const isDark = theme === 'dark';

  return (
    <header className="site-header">
      <a className={`nav-brand${showNavAvatar ? ' has-avatar' : ''}`} href="/" aria-label="周塞寒 home">
        <span className={`nav-avatar-link${showNavAvatar ? ' is-visible' : ''}`} aria-hidden="true">
          <img src={remote.navAvatar} alt="" />
        </span>
        <span className="nav-brand-copy">
          <span className="nav-name">周塞寒</span>
          <small>UX Motion Design</small>
        </span>
      </a>
      <div className="nav-actions">
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={item.startsWith('Works') ? '/#works' : '/#contact'}>
              {item}
            </a>
          ))}
        </nav>
        <button
          className="theme-toggle"
          type="button"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
        >
          {isDark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
        </button>
        <button
          className="menu-button"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={25} strokeWidth={2} /> : <Menu size={25} strokeWidth={2} />}
        </button>
      </div>
      <motion.nav
        className="mobile-nav"
        aria-label="Mobile navigation"
        initial={false}
        animate={open ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, height: 'auto', pointerEvents: 'auto' },
          closed: { opacity: 0, height: 0, pointerEvents: 'none' },
        }}
      >
        <a href="/" onClick={() => setOpen(false)}>
          周塞寒
        </a>
        {navItems.map((item) => (
          <a key={item} href={item.startsWith('Works') ? '/#works' : '/#contact'} onClick={() => setOpen(false)}>
            {item}
          </a>
        ))}
        <button
          className="theme-toggle mobile-theme-toggle"
          type="button"
          onClick={() => {
            onToggleTheme();
            setOpen(false);
          }}
        >
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </motion.nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-top">
        <Reveal className="intro-note" float={false}>
          <span></span>
          <p>
            It’s about emotion and clarity. It is the balance between structure and imagination, between timeless form
            and new possibilities.
          </p>
        </Reveal>
      </div>
      <div className="hero-title-row">
        <AnimatedHeroTitle />
        <Reveal className="hero-avatar" delay={0.08} float={false}>
          <RiveAvatar />
        </Reveal>
      </div>
      <HeroCover />
    </section>
  );
}

function WorkGrid() {
  const stickyIntroRef = useRef(null);
  const [introStyle, setIntroStyle] = useState({});

  useEffect(() => {
    let frame = 0;

    const updateIntroProgress = () => {
      frame = 0;
      const intro = stickyIntroRef.current;
      if (!intro || window.matchMedia('(max-width: 900px)').matches) {
        setIntroStyle({});
        return;
      }

      const stickyTop = parseFloat(window.getComputedStyle(intro).top) || 0;
      const parentRect = intro.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const progress = Math.min(1, Math.max(0, (stickyTop - parentRect.top) / 320));
      const viewportWidth = window.innerWidth;
      const expandedTitleSize = Math.min(78, Math.max(44, viewportWidth * 0.051));
      const compactTitleSize = 40;
      const titleSize = expandedTitleSize - (expandedTitleSize - compactTitleSize) * progress;
      const titleLine = 1.35 - 0.15 * progress;
      const stickyBleed = 24;
      const cardGap = 26;
      const expandedIntroHeight = Math.min(285, Math.max(250, viewportWidth * 0.172)) + stickyBleed;
      const compactIntroHeight = stickyBleed + 28 + 28 + compactTitleSize * 1.2 * 2 + 28;
      const currentIntroHeight = expandedIntroHeight - (expandedIntroHeight - compactIntroHeight) * progress;
      const expandedCardTop = stickyTop + stickyBleed + (expandedIntroHeight - stickyBleed) + cardGap;
      const compactCardTop = stickyTop + stickyBleed + 28 + 28 + compactTitleSize * 1.2 * 2 + 32;
      const cardTop = expandedCardTop - (expandedCardTop - compactCardTop) * progress;

      const nextStyle = {
        '--works-title-size': `${titleSize.toFixed(2)}px`,
        '--works-title-line': titleLine.toFixed(3),
        '--works-current-intro-height': `${currentIntroHeight.toFixed(2)}px`,
        '--works-card-top': `${cardTop.toFixed(2)}px`,
      };

      setIntroStyle((current) =>
        current['--works-title-size'] === nextStyle['--works-title-size'] &&
        current['--works-card-top'] === nextStyle['--works-card-top']
          ? current
          : nextStyle,
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateIntroProgress);
    };

    updateIntroProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return (
    <MotionSection className="section work-section" id="works">
      <div className="work-approach" style={introStyle}>
        <div className="section-head work-section-head">
          <h2>核心项目</h2>
        </div>
        <div className="work-pinned-list">
          <div className="work-sticky-intro" ref={stickyIntroRef}>
            <Reveal className="work-approach-head">
              <div>
                <span className="section-pill">
                  <i></i>
                  Works
                </span>
                <h3>
                  游戏业务
                  <br />
                  效率研发工具-UX设计
                </h3>
              </div>
              <a href="#works" className="approach-link">
                <span>下载PDF版本</span>
                <ArrowUpRight size={30} strokeWidth={2.2} />
              </a>
            </Reveal>
          </div>
          <div className="work-approach-stack">
            {workApproach.map((item, index) => (
              <WorkApproachCard
                item={item}
                index={index}
                key={item.title}
              />
            ))}
          </div>
        </div>
        <EfficiencyShowcase />
      </div>
    </MotionSection>
  );
}

function WorkApproachCard({ item, index }) {
  return (
    <a
      className="work-approach-card"
      href={`/works/${item.slug}`}
      aria-label={item.title}
      style={{ zIndex: index + 1 }}
    >
      <figure>
        {item.video ? (
          <video
            className="work-approach-video"
            src={item.video}
            poster={item.image}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onCanPlay={(event) => {
              event.currentTarget.play().catch(() => {});
            }}
            aria-hidden="true"
          />
        ) : (
          <img
            className={item.imageClassName || undefined}
            src={item.image}
            alt=""
            loading={index > 1 ? 'lazy' : 'eager'}
          />
        )}
      </figure>
      <div className="work-approach-copy">
        <span>{item.number}</span>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
        <div className="approach-tags">
          {item.tags.map((tag) => (
            <small key={tag}>{tag}</small>
          ))}
        </div>
      </div>
    </a>
  );
}

function EfficiencyShowcase() {
  return (
    <section className="ai-exploration-section" id="ai-exploration" aria-label="AI Exploration">
      <AiVideoShrinkStage />
    </section>
  );
}

function AiVideoShrinkStage() {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const headRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const head = headRef.current;
    const content = contentRef.current;
    if (!stage || !frame || !head || !content) return undefined;

    let raf = 0;

    const readPxVar = (name, fallback) => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smooth = (value) => value * value * (3 - 2 * value);

    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const scrollable = Math.max(1, rect.height - viewportH);
      const progress = smooth(clamp(-rect.top / scrollable));
      const pagePad = readPxVar('--page-pad', 24);
      const pageMax = readPxVar('--page-max', 1300);
      const targetW = Math.min(viewportW - pagePad * 2, pageMax);
      const targetH = Math.min(325, Math.max(180, (targetW / 1502) * 325));
      const targetRadius = viewportW < 760 ? 18 : 22;
      const width = viewportW + (targetW - viewportW) * progress;
      const height = viewportH + (targetH - viewportH) * progress;
      const radius = targetRadius * progress;
      const centeredTop = (viewportH - height) / 2;
      const headBottom = head.offsetTop + head.offsetHeight;
      const finalTop = Math.min(viewportH - targetH - 28, headBottom + 32);
      const y = (finalTop - centeredTop) * progress;
      const frameTop = centeredTop + y;
      const finalContentTop = finalTop + targetH + 32;

      stage.style.setProperty('--ai-shrink-progress', progress.toFixed(4));
      stage.style.setProperty('--ai-final-content-top', `${finalContentTop}px`);
      frame.style.width = `${width}px`;
      frame.style.height = `${height}px`;
      frame.style.borderRadius = `${radius}px`;
      frame.style.transform = `translate3d(-50%, calc(-50% + ${y}px), 0)`;
      const clearProgress = clamp((frameTop - headBottom - 8) / 24);
      const headProgress = clearProgress * clamp((progress - 0.72) / 0.18);
      head.style.opacity = headProgress.toFixed(4);
      head.style.transform = `translate3d(-50%, ${(1 - headProgress) * 22}px, 0)`;
      content.style.setProperty('--ai-content-offset', `${finalContentTop - viewportH}px`);
    };

    const requestUpdate = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="ai-video-shrink-stage" ref={stageRef}>
        <div className="ai-video-shrink-sticky">
          <div className="ai-video-shrink-head" ref={headRef}>
            <div className="ai-exploration-title">
              <span className="section-pill">
                <i></i>
                Works
              </span>
              <h2>
                AI
                <br />
                探索与实践
              </h2>
            </div>
            <a href="#ai-exploration" className="ai-exploration-link">
              <span>下载PDF版本</span>
              <ArrowUpRight size={30} strokeWidth={2.2} />
            </a>
          </div>
          <figure className="ai-video-shrink-frame" ref={frameRef}>
            <video
              src={efficiencyShowcase.heroVideo}
              poster={efficiencyShowcase.heroPoster}
              aria-label="AI Exploration 视觉展示"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </figure>
        </div>
      </div>
      <div className="ai-video-shrink-content" ref={contentRef}>
        <div className="ai-practice-list" aria-label="AI 实践列表">
          {efficiencyShowcase.practices.map((item, index) => (
            <article className="ai-practice-card" key={`${item.title}-${index}`} aria-label={item.title}>
              <div className="ai-practice-copy">
                <span>AI</span>
                <h3>
                  <small>{item.kicker}</small>
                  {item.title}
                </h3>
              </div>
              <img src={item.image} alt={item.alt} loading="lazy" />
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function Expertise() {
  return (
    <MotionSection className="section split-section content-810 sticky-module" id="about" sticky>
      <aside className="sticky-title">
        <Reveal className="section-copy sticky-title-inner">
          <h2>
            个人信息 <span>[2]</span>
          </h2>
          <p>Design across brand, campaign, and visual narrative, shaping ideas into memorable experiences.</p>
        </Reveal>
      </aside>
      <div className="expertise-grid">
        {expertise.map((item) => (
          <Reveal key={item.title} className="expertise-card">
            <figure>
              <img src={item.image} alt={item.alt} loading="lazy" />
            </figure>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </MotionSection>
  );
}

function Awards() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <MotionSection className="section rows-section resume-section resume-recap-section content-810 sticky-module" sticky>
      <aside className="sticky-title">
        <Reveal className="rows-title resume-recap-title sticky-title-inner">
          <h2>
            履历 <span>[4]</span>
          </h2>
          <p className="resume-recap-period">2017.08 - 至今</p>
        </Reveal>
      </aside>
      <div className="resume-accordion">
        {awards.map((item, index) => (
          <ResumeAccordionItem
            item={item}
            index={index}
            isOpen={openIndex === index}
            key={item.title}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </MotionSection>
  );
}

function ResumeAccordionItem({ item, index, isOpen, onToggle }) {
  const panelId = `resume-panel-${index}`;
  const resumeMetaLabel = item.label
    .replace('[', '')
    .replace(']', '')
    .replace(/｜/g, ' | ')
    .replace(/([BC])端/g, '$1 端');
  const resumeNo = String(index + 1).padStart(2, '0');

  return (
    <article className={`resume-accordion-item${isOpen ? ' is-open' : ''}`}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="resume-accordion-trigger"
        onClick={onToggle}
        type="button"
      >
        <span className="resume-accordion-year">{item.year}</span>
        <span className="resume-accordion-heading">
          <span>{item.title}</span>
          <small>[{resumeMetaLabel}]</small>
        </span>
        <span className="resume-accordion-icon" aria-hidden="true" />
      </button>
      <motion.div
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="resume-accordion-panel"
        id={panelId}
        initial={false}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="resume-accordion-panel-year" aria-hidden="true">
          {item.year}
        </span>
        <div className="resume-accordion-copy is-mihoyo-detail">
          <div className="mihoyo-resume-detail">
            <div className="mihoyo-role">
              <h4>
                <span className="mihoyo-role-title">{item.roleTitle}</span>
                {item.badge ? <span className="mihoyo-role-badge">{item.badge}</span> : null}
              </h4>
              <p>{item.intro}</p>
            </div>
            <div className="mihoyo-project-list">
              {item.details.map((detail) => (
                <section className="mihoyo-project" key={detail.title}>
                  <h4>{detail.title}</h4>
                  {detail.items ? (
                    <ul>
                      {detail.items.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{detail.text}</p>
                  )}
                </section>
              ))}
            </div>
            <dl className="mihoyo-meta">
              <div>
                <dt>Role</dt>
                <dd>{item.metaRole}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{item.metaYear}</dd>
              </div>
              <div>
                <dt>No.</dt>
                <dd>{resumeNo}</dd>
              </div>
            </dl>
          </div>
        </div>
      </motion.div>
    </article>
  );
}

function Skills() {
  return (
    <MotionSection className="section split-section skills-section content-810 sticky-module" sticky>
      <aside className="sticky-title">
        <Reveal className="section-copy sticky-title-inner">
          <h2>
            主要技能 <span>[2]</span>
          </h2>
          <p>Design across brand, campaign, and visual narrative, shaping ideas into memorable experiences.</p>
        </Reveal>
      </aside>
      <div className="expertise-grid">
        {expertise.map((item) => (
          <Reveal key={`skill-${item.title}`} className="expertise-card">
            <figure>
              <img src={item.image} alt={item.alt} loading="lazy" />
            </figure>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </MotionSection>
  );
}

function Testimonials() {
  return (
    <MotionSection className="section quote-section sticky-module" sticky>
      <aside className="sticky-title">
        <Reveal className="section-copy sticky-title-inner">
          <h2>
            In Their Words <span>[3]</span>
          </h2>
          <p>Words that reflect the impact of the work, told by those who experienced it.</p>
        </Reveal>
      </aside>
      <div className="quotes">
        {quotes.map((quote) => (
          <Reveal className="quote" key={quote.by}>
            <h3>“{quote.text}”</h3>
            <p>{quote.by}</p>
          </Reveal>
        ))}
      </div>
    </MotionSection>
  );
}

function Journal() {
  return (
    <MotionSection className="section rows-section journal-section sticky-module" sticky>
      <aside className="sticky-title">
        <Reveal className="rows-title sticky-title-inner">
          <h2>
            Journal <span>[5]</span>
          </h2>
        </Reveal>
      </aside>
      <div className="rows">
        {journals.map(([title, label, year]) => (
          <Reveal className="award-row journal-row" key={title}>
            <h3>{title}</h3>
            <span>·</span>
            <p>[{label}]</p>
            <time>{year}</time>
          </Reveal>
        ))}
      </div>
    </MotionSection>
  );
}

function InteractiveEmbed({ kind, src }) {
  if (!src) return null;

  return (
    <Suspense fallback={<div className="embed-fallback" />}>
      {kind === 'spline' ? <Spline scene={src} /> : <RivePlayer src={src} />}
    </Suspense>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact" aria-label="Footer" />
  );
}

function RouteTransitionOverlay({ transition }) {
  if (transition.phase === 'idle') return null;

  const isBack = transition.direction === 'back';
  const startY = isBack ? '-100%' : '100%';
  const endY = isBack ? '100%' : '-100%';

  return (
    <motion.div
      key={transition.id}
      className="route-transition-cover"
      initial={{ y: startY }}
      animate={{ y: transition.phase === 'covering' ? '0%' : endY }}
      transition={{
        duration: transition.phase === 'covering' ? 0.36 : 0.68,
        ease: transition.phase === 'covering' ? [0.76, 0, 0.24, 1] : [0.22, 1, 0.36, 1],
      }}
      aria-hidden="true"
    />
  );
}

function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <WorkGrid />
        <Expertise />
        <Awards />
        <Skills />
      </main>
      <Footer />
    </>
  );
}

function WorkDetail({ work, detail }) {
  const facts = detail.facts;
  const relatedWorks = featuredWorks.filter((item) => item.slug !== work.slug).slice(0, 2);

  return (
    <>
      <main className="detail-page" id="top">
        <aside className="detail-sidebar" aria-label="Project details">
          {facts.map(([label, value]) => (
            <div className="detail-fact" key={label}>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
          ))}
        </aside>
        <article className="detail-content">
          <Reveal className="detail-intro">
            <h1>{detail.headline}</h1>
          </Reveal>
          <Reveal className="detail-copy" delay={0.05}>
            {detail.copy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <div className="detail-gallery">
            {detail.images.map((image, index) => (
              <Reveal className={`detail-image${index === 0 ? ' detail-image-wide' : ''}`} key={`${image.src}-${index}`}>
                <ParallaxImage
                  src={image.src}
                  alt={image.alt}
                  loading={index > 1 ? 'lazy' : 'eager'}
                  hover={false}
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="related-title">
            <h2>Related works</h2>
          </Reveal>
          <div className="detail-related-grid">
            {relatedWorks.map((related, index) => (
              <Reveal className="detail-related-card" key={related.slug} delay={index * 0.08}>
                <a className="image-link" href={`/works/${related.slug}`} aria-label={related.title}>
                  <ParallaxImage
                    as="span"
                    src={related.image}
                    alt={related.alt}
                    loading="lazy"
                    hover={false}
                  />
                </a>
                <p>{related.type}</p>
                <h3>
                  <a href={`/works/${related.slug}`}>{related.title}</a>
                </h3>
              </Reveal>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [route, setRoute] = useState(getRouteFromWindow);
  const [theme, setTheme] = useState(initialTheme);
  const [routeTransition, setRouteTransition] = useState({
    phase: 'idle',
    direction: 'forward',
    id: 0,
  });
  const routeRef = useRef(route);
  const transitionTimersRef = useRef([]);
  const workMatch = route.pathname.match(/^\/works\/([^/]+)\/?$/);
  const approachWorkItems = workApproach.map((item) => ({
    slug: item.slug,
    title: item.title,
    type: 'Project approach',
    image: item.image,
    alt: item.title,
    description: item.description,
  }));
  const currentWork = workMatch ? [...works, ...approachWorkItems].find((work) => work.slug === workMatch[1]) : null;
  const currentDetail = currentWork
    ? workDetails[currentWork.slug] || {
        facts:
          currentWork.slug === 'project-framing'
            ? [
                ['项目', '米线游戏制作管理'],
                ['角色', '设计Owner，0-1搭建+全程跟进迭代'],
                ['公司', '米哈游'],
                ['项目状态', '上线，交付5个游戏项目组'],
                ['迭代周期', '2023.12-至今'],
                ['更新时间', '2026'],
              ]
            : [
                ['Project', currentWork.title],
                ['Role', 'Portfolio structure, content direction, interaction design'],
                ['Company', 'IceZhou Studio'],
                ['Industry', currentWork.type],
                ['Timeline', '2025'],
                ['Contributors', 'IceZhou'],
                ['Year', '2025'],
              ],
        headline: `"${currentWork.title} is structured as a portfolio case system: clear enough to scan quickly, but rich enough to hold process, imagery, and interaction details."`,
        copy: [
          currentWork.description || 'A structured portfolio module designed to turn project material into a clear case-study narrative.',
          'The page follows the same detail structure as the main project cases, with a left information rail, a large editorial statement, supporting notes, and a scalable image gallery for future assets.',
        ],
        images: [
          { src: currentWork.image, alt: currentWork.alt },
          { src: remote.hero, alt: '3D motion and design icon composition' },
          { src: remote.game, alt: 'Blue 3D user interface composition' },
          { src: '/assets/work-approach-case-delivery.png', alt: 'Portfolio case delivery visual' },
        ],
    }
    : null;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useLayoutEffect(() => {
    routeRef.current = route;
    scrollToRouteTarget(route);
  }, [route.pathname, route.search, route.hash]);

  useEffect(() => {
    if (!route.hash) return undefined;

    const timer = window.setTimeout(() => {
      scrollToRouteTarget(route);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [route.pathname, route.search, route.hash]);

  useEffect(() => {
    const clearTransitionTimers = () => {
      transitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      transitionTimersRef.current = [];
    };

    const commitRoute = (nextRoute, mode) => {
      if (mode === 'push') {
        window.history.pushState({}, '', getRouteUrl(nextRoute));
      } else if (mode === 'replace') {
        window.history.replaceState({}, '', getRouteUrl(nextRoute));
      }

      routeRef.current = nextRoute;
      setRoute(nextRoute);
    };

    const navigateToRoute = (nextRoute, mode = 'push') => {
      const fromRoute = routeRef.current;

      if (getRouteUrl(fromRoute) === getRouteUrl(nextRoute)) {
        return;
      }

      if (getRoutePath(fromRoute) === getRoutePath(nextRoute)) {
        commitRoute(nextRoute, mode);
        return;
      }

      clearTransitionTimers();
      const direction = getTransitionDirection(fromRoute, nextRoute);
      const transitionId = Date.now();

      document.documentElement.classList.add('is-route-transitioning');
      setRouteTransition({ phase: 'covering', direction, id: transitionId });

      transitionTimersRef.current.push(
        window.setTimeout(() => {
          commitRoute(nextRoute, mode);
          setRouteTransition({ phase: 'revealing', direction, id: transitionId });
        }, routeTransitionTiming.cover)
      );

      transitionTimersRef.current.push(
        window.setTimeout(() => {
          setRouteTransition({ phase: 'idle', direction, id: transitionId });
          document.documentElement.classList.remove('is-route-transitioning');
        }, routeTransitionTiming.cover + routeTransitionTiming.reveal)
      );
    };

    const handlePopState = () => {
      navigateToRoute(getRouteFromWindow(), 'none');
    };

    const handleClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = event.target.closest?.('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const nextUrl = new URL(href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;

      const nextRoute = {
        pathname: nextUrl.pathname,
        search: nextUrl.search,
        hash: nextUrl.hash,
      };

      if (getRouteUrl(routeRef.current) === getRouteUrl(nextRoute)) {
        return;
      }

      event.preventDefault();
      navigateToRoute(nextRoute);
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);

    return () => {
      clearTransitionTimers();
      document.documentElement.classList.remove('is-route-transitioning');
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const page = currentWork && currentDetail ? <WorkDetail work={currentWork} detail={currentDetail} /> : <HomePage />;

  return (
    <>
      <Header
        routePath={route.pathname}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />
      <RouteTransitionOverlay transition={routeTransition} />
      {page}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

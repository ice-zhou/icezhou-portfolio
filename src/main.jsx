import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

const heroSplineScene = 'https://my.spline.design/interactivecubes-fIjLWa5vl6SUskp5fLpiWVtD/';
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
    description: '米哈游游戏研发团队的游戏制作管理平台，通过任务结构化、排期可视化、流程规则化与资源透明化，提升复杂内容生产的协同效率与交付确定性。',
    image: '/assets/mixian-cover.png',
    video: '/assets/miline-cover.mp4',
    tags: ['复杂系统', '游戏项目管理', '数据中心'],
  },
  {
    slug: 'visual-system',
    number: '02',
    title: '本地化翻译编辑器',
    description: '为米哈游国际化团队；构建集翻译编辑、上下文辅助、TM/TB 资产复用、审校质检于一体的协作型编辑器，帮助多语种团队在高频版本迭代中提升翻译效率与交付一致性。',
    image: remote.game,
    video: '/assets/bg-type-2.mp4',
    tags: ['复杂工具', '多语种协作', '游戏本地化'],
  },
  {
    slug: 'motion-prototype',
    number: '03',
    title: 'HoYo & Seed Design',
    description: '主导0-1搭建米哈游HoYo组件库 & 字节教育线Seed组件库',
    image: '/assets/component-library-display/hyd/01.png',
    video: '/assets/component-library-cover-v2.mp4',
    tags: ['组件库', '基建系统', '映射', '配置平台'],
  },
  {
    slug: 'case-delivery',
    number: '04',
    title: '磁极 & Solverlance',
    description: '字节跳动教育资产生产平台',
    image: '/assets/ascii-game-controller-black.gif',
    imageClassName: 'ascii-controller-cover',
    tags: ['Portfolio', 'Case study', 'Launch'],
  },
];

const projectFramingGallery = Array.from({ length: 30 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  const assetVersion = ['01', '05', '08'].includes(number) ? '?v=portfolio-20260626d' : '';
  return {
    src: `/assets/mixian-portfolio/${number}.png${assetVersion}`,
    previewSrc: `/assets/mixian-portfolio-preview/${number}.png${assetVersion}`,
    alt: `米线游戏制作管理项目图 ${number}`,
    preserveRatio: true,
  };
});

const localizationGallery = Array.from({ length: 34 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    src: `/assets/localization-display/${number}.png`,
    previewSrc: `/assets/localization-preview/${number}.png`,
    alt: `本地化翻译编辑器项目图 ${number}`,
    preserveRatio: true,
  };
});

const componentLibraryGallery = [
  ...Array.from({ length: 9 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return {
      src: `/assets/component-library-display/hyd/${number}.png`,
      previewSrc: `/assets/component-library-preview/hyd/${number}.png`,
      alt: `HoYo Design 组件库展示图 ${number}`,
      preserveRatio: true,
    };
  }),
  ...Array.from({ length: 5 }, (_, index) => {
    const number = String(index + 10).padStart(2, '0');
    return {
      src: `/assets/component-library-display/seed/${number}.png`,
      previewSrc: `/assets/component-library-preview/seed/${number}.png`,
      alt: `Seed Design 组件库展示图 ${number}`,
      preserveRatio: true,
    };
  }),
];

const detailCopyHeadingTexts = new Set([
  'HoYo Design 组件体系与组件配置平台',
  'Seed 组件库 & Brickform 低代码搭建平台',
  '项目背景',
  '方案设计',
  '核心能力',
  '项目价值',
]);

const aiAeFigmaAssets = {
  flowPlan: 'https://www.figma.com/api/mcp/asset/ee3ec65b-bafa-449a-8685-d14bb9189b4b',
  dualPreviewA: 'https://www.figma.com/api/mcp/asset/87c8bf78-14f8-4c4c-bf25-05de811d2e39',
  dualPreviewB: 'https://www.figma.com/api/mcp/asset/7807ad55-4f0b-4484-8075-f749211efc35',
  workflowBefore: 'https://www.figma.com/api/mcp/asset/d480636b-82d1-4c9d-96f1-bb7f57681ba0',
  materialOverview: 'https://www.figma.com/api/mcp/asset/d34f4d14-b6a5-4aca-94f6-b0d9b9604343',
  replacePanel: 'https://www.figma.com/api/mcp/asset/17bae010-be4c-4b28-bb0b-abe2d9573aa8',
  instantReplace: 'https://www.figma.com/api/mcp/asset/a3e221cd-b4b0-4153-8b4b-b48a29327029',
  animationSafe: 'https://www.figma.com/api/mcp/asset/0bae60c0-0bcc-44e3-a3dc-7ccc46a64059',
  frameTemplate: 'https://www.figma.com/api/mcp/asset/faa8eef8-9e4e-43b5-86a9-5c31c4b70b94',
  framePanel: 'https://www.figma.com/api/mcp/asset/9c0f4aac-b8ce-4898-b584-5733b3c8ab00',
  exportPath: 'https://www.figma.com/api/mcp/asset/9f6f91bf-0495-4a86-a0e8-0aebdd9fab20',
  mobileExportA: 'https://www.figma.com/api/mcp/asset/ca320291-90c1-4419-b11c-9e7ec36b6025',
  mobileExportB: 'https://www.figma.com/api/mcp/asset/3c5b975d-4a1a-4aad-a801-951a874b7c85',
  mp4Export: 'https://www.figma.com/api/mcp/asset/9871cdf5-a764-47c5-8720-f4089d03ed37',
  apngExport: 'https://www.figma.com/api/mcp/asset/10b0a714-2850-403f-bebe-0d2a5e0dd80e',
  workflowAfter: 'https://www.figma.com/api/mcp/asset/0fb02422-5c99-4613-8053-03c6e6c1b718',
  finalEffectRight: '/assets/ai-ae-final-effect-right.png',
  finalEffectLeft: '/assets/ai-ae-final-effect-left.png',
};

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
      slug: 'ai-ae-automation',
      kicker: 'AI x AE',
      title: '抽奖动画自动化插件',
      image: '/assets/ai-card-visual-1.png',
      alt: 'AI x AE 抽奖动画自动化插件',
      description: '用 AI 解析动效脚本与抽奖流程，将 AE 动画资产整理为可复用、可交付的自动化插件方案。',
    },
    {
      slug: 'ai-skill-design-system',
      kicker: 'AI x Skill',
      title: '生成符合设计规范页面',
      image: '/assets/ai-card-visual-2.png',
      alt: 'AI x Skill 生成符合设计规范页面',
      description: '基于设计规范、组件规则和页面语义，让 AI Skill 辅助生成更接近真实设计系统的页面初稿。',
    },
    {
      slug: 'ai-design-context',
      kicker: 'AI x Design Context',
      title: '理解功能逻辑生成设计',
      image: '/assets/ai-card-visual-3.png',
      alt: 'AI x Design Context 理解功能逻辑生成设计',
      description: '将业务规则、状态逻辑和交互约束转译为设计上下文，帮助 AI 输出更贴近产品逻辑的设计结果。',
    },
  ],
};

const secondaryContentCards = [
  ...workApproach.map((item) => ({
    slug: item.slug,
    title: item.title,
    type: 'Works',
    image: item.image,
    video: item.video,
    alt: item.title,
  })),
  ...efficiencyShowcase.practices.map((item) => ({
    slug: item.slug,
    title: item.title,
    type: 'AI',
    image: item.image,
    alt: item.alt || item.title,
  })),
];

function getOtherContentCards(currentSlug, limit = 2) {
  const currentIndex = secondaryContentCards.findIndex((item) => item.slug === currentSlug);

  if (currentIndex === -1) {
    return secondaryContentCards.slice(0, limit);
  }

  return Array.from({ length: secondaryContentCards.length - 1 }, (_, offset) => {
    const nextIndex = (currentIndex + offset + 1) % secondaryContentCards.length;
    return secondaryContentCards[nextIndex];
  }).slice(0, limit);
}

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
  'project-framing': {
    facts: [
      ['项目', '米线游戏制作管理'],
      ['角色', '设计Owner，0-1搭建+全程跟进迭代'],
      ['公司', '米哈游'],
      ['项目状态', '上线，交付5个游戏项目组'],
      ['迭代周期', '2023.12-至今'],
      ['更新时间', '2026'],
    ],
    headline: '米线游戏制作管理系统',
    copy: [
      '米线平台是面向大型游戏项目研发流程的生产协同平台，核心目标是帮助策划、PM、环节负责人、组长与一线制作人员，在复杂版本制作中完成需求拆解、任务分配、流程流转、进度追踪、资源评估与质量管控。',
      '它并不是一个单纯的项目管理工具，而是更贴近游戏内容生产场景的研发生产管线平台：从版本需求产生，到任务逐级拆解，再到原画、3D、绑定、动画、特效等多环节协同制作，平台通过结构化任务、可视化排期、工作流规则和人员负载管理，保障大量内容可以在有限版本周期内稳定推进。',
    ],
    images: projectFramingGallery,
  },
  'visual-system': {
    facts: [
      ['项目', '本地化翻译编辑器'],
      ['角色', '设计Owner，复杂工具体验设计'],
      ['公司', '米哈游'],
      ['项目状态', '服务游戏国际化与多语种协作'],
      ['迭代周期', '2024-至今'],
      ['更新时间', '2026'],
    ],
    headline: '本地化翻译编辑器',
    copy: [
      '本地化翻译编辑器面向游戏国际化与多语言本地化协作场景，覆盖版本内容更新、多语种翻译、上下文辅助、术语资产复用、审校质检与交付管理等复杂流程。',
      '项目目标是在高频版本迭代中提升翻译效率与交付一致性：通过结构化编辑区、TM/TB 资产复用、上下文信息聚合、问题定位与多角色协作机制，帮助翻译、审校、PM 与业务方在同一工作流中稳定推进内容本地化。',
    ],
    images: localizationGallery,
  },
  'motion-prototype': {
    facts: [
      ['项目', 'HoYo & Seed Design'],
      ['角色', '设计侧 Owner，组件体系 0-1 搭建'],
      ['公司', '米哈游 / 字节跳动'],
      ['项目类型', '设计系统 / 组件库 / 低代码平台'],
      ['核心内容', 'HoYo Design、Seed 组件库、Brickform'],
      ['更新时间', '2026'],
    ],
    headline: 'HoYo & Seed Design 系统搭建',
    copy: [
      'HoYo Design 组件体系与组件配置平台',
      '作为设计侧 Owner，负责米哈游基础组件体系 HoYo Design 的 0-1 搭建，并在此基础上完成组件库配置平台设计与上线。支持不同业务平台基于统一组件体系进行风格定制，降低重复设计与研发成本。',
      'Seed 组件库 & Brickform 低代码搭建平台',
      '结合教育资源生产业务特性，与前端团队从 0-1 搭建 Seed 组件库。组件库支持 Web 端搭建后无缝适配 H5 端，提升跨端设计与研发效率。',
      '基于 Seed 组件库，完成教育资源生产系统低代码搭建平台 Brickform 的设计。支持业务方根据不同生产场景快速搭建资源生产系统。',
    ],
    images: componentLibraryGallery,
  },
  'ai-ae-automation': {
    facts: [
      ['项目', '米哈游抽奖动画支持'],
      ['角色', '视觉+动画设计'],
      ['公司', '米哈游'],
      ['项目状态', '25、26年终抽奖、春招秋招抽奖'],
      ['迭代周期', '周期性支持'],
      ['更新时间', '2026'],
    ],
    headline: 'AI X AE插件抽奖动画快速换肤',
    copyBlocks: [
      { type: 'sectionTitle', text: '🎰 项目背景', tone: 'muted' },
      {
        type: 'paragraphs',
        items: [
          '目前米哈游的抽奖系统有：年会 & 内推 两个抽奖系统。',
          '二者的区别在于：',
          '前者每人仅又一次抽奖机会并且无法转让抽奖次数；后者每人有0-无限的抽奖次数，并且抽奖次数可转让。二者每年的交互流程基本大差不差，重点在于 KV & 抽奖的动画制作。',
          '同时为避免 KV 的不确定从而阻塞后续产出，协作时需严格按照下图中所述确定 & 交付各阶段产物👇🏻',
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.flowPlan, alt: '抽奖动画协作阶段规划', aspectRatio: '920 / 133' },
      {
        type: 'richParagraphs',
        items: [
          [{ text: '其中，年会抽奖动画是公司年度最重要的活动，5000块保底奖品的激励基本上是公司100%全员参与，同时也是公司对外部宣传的重要载体' }],
          [
            { text: '在每次抽奖活动节点，需要根据招聘招聘活动设计风格和构思玩法，无论是设计还是企宣都需要投入，大量的资源去实现，RoI很低。所以后续所有抽奖活动' },
            { text: '采取“换肤”的方式实现，即不改变玩法和动画效果，只需要根据当期的活动风格，更换动画素材上线即可', tone: 'yellow' },
          ],
        ],
      },
      {
        type: 'videoPair',
        videos: [
          { src: '/assets/ai-ae-lottery-red.mov', label: '红色抽奖动画循环预览', aspectRatio: '451 / 250' },
          { src: '/assets/ai-ae-lottery-blue.mov', label: '蓝色抽奖动画循环预览', aspectRatio: '469 / 248' },
        ],
      },
      {
        type: 'paragraphs',
        items: ['抽奖活动换肤，虽然动画本身倒是不用调整了，但还是存在非常多的“体力活”，对准确性和灵活性有着非常高的要求'],
      },
      {
        type: 'orderedPoints',
        items: [
          ['01.帧数准：', '开奖动画分为开奖前（常规轮播）、开奖中（开奖动态效果；营造氛围）、开奖后（奖品展示），三段式动画分阶段播放，这就要求动画每次导出的帧数点必须做到分毫不差，差一帧动画就“穿帮”。'],
          ['02.变化多：', '虽然动画变了，但是抽奖卡面和背景氛围、奖品都在不停的修改和变化，只要有调整，整个动画都需要重新换肤+K帧导出'],
          ['03.多端展示：', '抽奖活动不仅支持移动端，还需要支持线下电视端抽取，大家都认为在大屏幕电视端中大奖的概率更高，所以这就要求我的抽奖动画必须支持多端导出，电视端为MP4、H5端为APNG'],
          ['04.合理压缩：', '电视端的MP4对于视频尺寸要求不高，H5就需要在清晰度和尺寸上进行权衡，所以H5的动画需要在压缩尺寸上进行单独优化'],
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.workflowBefore, alt: '抽奖换肤原工作流', aspectRatio: '920 / 259' },
      {
        type: 'richParagraphs',
        items: [
          [
            { text: '以25秋招抽奖项目周期为例，' },
            { text: '视觉+动画修改次数14次', tone: 'yellow' },
            { text: '，中期新增子公司抽奖场景，每单次手动执行所有动画修改至少' },
            { text: '耗时40min+ ，帧数出错可能10%', tone: 'yellow' },
            { text: '。' },
          ],
        ],
      },
      { type: 'sectionTitle', text: '🤔 这件事的思考', tone: 'muted' },
      {
        type: 'richParagraphs',
        items: [
          [
            { text: '抽奖换肤这件事属于' },
            { text: '简单、固定周期性、重复性劳动', tone: 'yellow' },
            { text: '需求。但还是每次都需要抽调人力支持并且反复修改，想把自己从枯燥乏味的反复操作的流程中解脱出来，甚至把这个活可以直接交给企宣同学自己去完成' },
          ],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: '流程链路理清跑通后，抽奖换肤实际上会成为一件纯粹的“体力活”，企宣同学只需要严格按照流程文档输出对应的帧数和格式就行。那么既然有明确的流程和相对固定的动画模版，就可以通过插件的方式按照制定好的工作流自动导出。',
      },
      {
        type: 'paragraphs',
        items: [
          '全自动化&半自动化：',
          '考虑中间导出环节还需要人工确认，例如卡面和特效结合效果等，所以采用了核心环节自动化的方式来设计AE插件',
        ],
      },
      { type: 'sectionTitle', text: '🕹️ 核心环节自动化', tone: 'strong' },
      { type: 'moduleTitle', text: '01 更换动画素材' },
      { type: 'subTitle', text: '🤡 典型的机械劳动' },
      {
        type: 'paragraphs',
        items: [
          '抽奖动画内用到了大量静态视觉素材，静态视觉素材的每次修改，动画内容也必须修改；还有一部分问题是需要真正走完动画流程后，配置测试环境后才能发现',
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.materialOverview, alt: '抽奖动画素材替换概览', aspectRatio: '1149 / 386' },
      {
        type: 'paragraphs',
        items: [
          '以2026年抽奖项目过程中，当有以下几个情况的素材图修改造成了非常多了时间浪费和重复性劳动',
          '1. 卡牌卡面设计图调整\n2. mi和lml logo替换修改\n3. 卡背上的发光效果在移动端看起来模糊，要去掉\n4. 尺寸裁切有问题，出现穿帮\n.........',
          '每一次静态图的修改伴随着重复性劳动',
        ],
      },
      { type: 'subTitle', text: '🎉 AE插件-一键替换素材' },
      {
        type: 'paragraphs',
        items: [
          '在插件内选择原素材名和目标素材名，点击“执行替换”可替换文件内所有素材文件，不需要重复性的一个一个替换',
          '插件会默认自动拉取当前动画文件内所有素材内容，若有素材的变动（修改名称、增加、删除等），可点击“刷新素材列表”实时更新替换素材列表',
          '素材列表支持搜索选择，注意，同名素材不会合并展示（AE底层逻辑使用同素材在不同合成里分开展示）',
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.replacePanel, alt: 'AE 插件一键替换素材面板', aspectRatio: '2380 / 818' },
      { type: 'bulletCaption', text: '瞬间替换流程' },
      { type: 'image', src: aiAeFigmaAssets.instantReplace, alt: '一键替换素材流程', aspectRatio: '1920 / 1016' },
      { type: 'bulletCaption', text: '替换不影响所有动画' },
      { type: 'image', src: aiAeFigmaAssets.animationSafe, alt: '替换后动画效果保持稳定', aspectRatio: '1920 / 984' },
      { type: 'moduleTitle', text: '02 固定动画环节、固定帧数输出' },
      { type: 'subTitle', text: '🤯 考验眼力和手力精准微操' },
      {
        type: 'paragraphs',
        items: [
          '抽奖环节分为三个大步骤，开奖前-start；开奖中-ing；开奖后-end 展示端上分为：点位端和移动端，这样就需要进精准的找到并导出6组帧数的动画，繁琐而机械 ，帧数还不能出错，容易跳帧穿帮，  随便改改样式又要重新导出',
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.frameTemplate, alt: '固定帧数输出范围示意', aspectRatio: '2684 / 276' },
      { type: 'subTitle', text: '🎉 AE插件-帧数模版化存储+批量导出' },
      {
        type: 'paragraphs',
        items: [
          '因为每个流程环节的动画都是有固定帧数范围的，所以可以采取模版的方式将6个帧数段的动画进行封装，在插件内只需要一次性录入好 点位端：开奖前-start；开奖中-ing；开奖后-end 、移动端：开奖前-start；开奖中-ing；开奖后-end  6段帧数的模版即可，模版在插件内可记忆',
          '插件内支持帧数模版多选，同一类型的帧数模版可以一次性导出',
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.framePanel, alt: '帧数模版化存储面板', className: 'detail-copy-image-small', aspectRatio: '410 / 452' },
      { type: 'moduleTitle', text: '03 多种格式灵活高效输出' },
      { type: 'subTitle', text: '🤯 双端导出格式不一样' },
      { type: 'minorTitle', text: '点位端' },
      {
        type: 'callout',
        tone: 'warning',
        text: '点位端：最终交付MP4版本文件；MP4动画文件需拆分如表中3个流程，注意视频整体不小于于15m',
      },
      {
        type: 'paragraphs',
        items: [
          '点位端需要单独导出H.264 mp4文件，3个帧数点位就需要3段mp4视频，且一共小于15mb 。',
          '还有一个坑点是，如果走AE-渲染队列-导出H.264 这个路径，视频的尺寸会远远大于',
          'AE-Adobe Media Encoder队列-导出H.264路径，所以导出视频这个步骤是推荐去Adobe Media Encoder导出',
          '整个导出路径变得更长了',
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.exportPath, alt: '点位端导出路径示意', aspectRatio: '2048 / 110' },
      { type: 'minorTitle', text: '移动端' },
      {
        type: 'calloutWithImages',
        tone: 'warning',
        text: '移动端：最终交付 APNG动画+序列帧 文件需拆分3个流程交付，注意所有 APNG动画加在一起小于10m',
        images: [
          { src: aiAeFigmaAssets.mobileExportA, alt: '移动端 APNG 导出说明图一', aspectRatio: '608 / 188' },
          { src: aiAeFigmaAssets.mobileExportB, alt: '移动端 APNG 导出说明图二', aspectRatio: '182 / 185' },
        ],
      },
      {
        type: 'paragraphs',
        items: ['移动端需要交付Apng序列帧，目前版本的AE只支持导出png序列帧，要想导出Apng序列帧需要借助第三方导出工具辅助导出，非常耗时耗力'],
      },
      { type: 'subTitle', text: '🎉 AE插件-灵活自由的选择导出方式' },
      {
        type: 'paragraphs',
        items: [
          '衔接帧数模版功能，可以自由选择想要的导出格式，直接输出交付的目标内容',
          '选择固定的帧数模版-直接导出mp4',
        ],
      },
      { type: 'image', src: aiAeFigmaAssets.mp4Export, alt: '固定帧数模版导出 MP4', aspectRatio: '1920 / 1436' },
      { type: 'caption', text: '选择固定的帧数模版-直接导出mp4' },
      { type: 'image', src: aiAeFigmaAssets.apngExport, alt: '固定帧数模版导出 APNG', aspectRatio: '1920 / 1332' },
      { type: 'sectionTitle', text: '两种工作流的对比图' },
      {
        type: 'paragraphs',
        items: [
          '过往的投入耗时，每次企宣更换静态图都需要动画侧同步修改，重新导出流程能统计到的有6次重复导出动画，还不包括后期测试阶段的反复修改，每单次手动执行修改至少耗时40min+ ，帧数出错可能20%',
          '运用AE插件封装工作流后，预计单次执行所有动画导出时间在5min以内，帧数出错可能0%',
        ],
      },
      {
        type: 'callout',
        tone: 'success',
        text: '一键换素材图 - 勾选点位 - 选中格式 - 导出 - 结束',
      },
      { type: 'image', src: aiAeFigmaAssets.workflowAfter, alt: 'AE 插件封装后的抽奖换肤工作流', aspectRatio: '4096 / 3268' },
      { type: 'sectionTitle', text: '🥁 最终效果', tone: 'strong' },
      {
        type: 'richParagraphs',
        items: [
          [{ text: '在2025年秋招活动后，利用AI落地AE换肤工具，并且在2026年会抽奖活动中完美落地，动画上线效果完美' }],
          [
            { text: '设计侧动画环节' },
            { text: '效率提升80%', tone: 'green' },
            { text: '，后续企宣侧抽奖动画需求全都可' },
            { text: '交给企宣同学自己通过插件完成', tone: 'green' },
          ],
        ],
      },
      {
        type: 'imagePair',
        className: 'detail-copy-final-effect-pair',
        columns: '467fr 443fr',
        images: [
          {
            src: aiAeFigmaAssets.finalEffectLeft,
            alt: '2026 年会抽奖活动现场搭建图',
            aspectRatio: '467 / 461',
            objectPosition: '50% 50%',
          },
          {
            src: aiAeFigmaAssets.finalEffectRight,
            alt: '2026 年会抽奖活动现场互动图',
            aspectRatio: '443 / 461',
            objectPosition: '50% 0%',
          },
        ],
      },
    ],
    images: [],
  },
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

const navItems = [
  { label: '核心项目 [4]', href: '/#works' },
  { label: 'AI [3]', href: '/#ai-exploration' },
  { label: '关于', href: '/#about' },
  { label: '履历', href: '/#resume' },
  { label: '联系', href: '/#contact' },
];
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
      <iframe
        key={replayKey}
        className="spline-cover"
        src={heroSplineScene}
        title="Interactive cubes Spline animation"
        allow="autoplay; fullscreen"
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

function useHeaderHiddenOverAi(routePath) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (routePath !== '/') {
      setHidden(false);
      return undefined;
    }

    let frameId = 0;

    const update = () => {
      frameId = 0;
      const section = document.getElementById('ai-exploration');

      if (!section) {
        setHidden(false);
        return;
      }

      const probeY = 80;
      const rect = section.getBoundingClientRect();
      const shouldHide = rect.top <= probeY && rect.bottom > probeY;
      setHidden((current) => (current === shouldHide ? current : shouldHide));
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [routePath]);

  return hidden;
}

function Header({ routePath = window.location.pathname, theme, onToggleTheme, hideForAi = false }) {
  const [open, setOpen] = useState(false);
  const showNavAvatar = false;
  const isDark = theme === 'dark';

  useEffect(() => {
    if (hideForAi) {
      setOpen(false);
    }
  }, [hideForAi]);

  return (
    <header className={`site-header${hideForAi ? ' is-hidden-over-ai' : ''}`}>
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
            <a key={item.label} href={item.href}>
              {item.label}
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
          <a key={item.label} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
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

      const viewportWidth = window.innerWidth;
      const introScrollDistance = Math.min(6200, Math.max(3900, window.innerHeight * 4.85));
      const progress = Math.min(1, Math.max(0, (stickyTop - parentRect.top) / introScrollDistance));
      const titleProgress = Math.min(1, progress * 18);
      const expandedTitleSize = Math.min(78, Math.max(44, viewportWidth * 0.051));
      const compactTitleSize = 40;
      const titleSize = expandedTitleSize - (expandedTitleSize - compactTitleSize) * titleProgress;
      const titleLine = 1.35 - 0.15 * titleProgress;
      const stickyBleed = 24;
      const expandedIntroHeight = Math.min(285, Math.max(250, viewportWidth * 0.172)) + stickyBleed;
      const compactIntroHeight = stickyBleed + 28 + 28 + compactTitleSize * 1.2 * 2 + 28;
      const currentIntroHeight = expandedIntroHeight - (expandedIntroHeight - compactIntroHeight) * titleProgress;

      const nextStyle = {
        '--works-title-size': `${titleSize.toFixed(2)}px`,
        '--works-title-line': titleLine.toFixed(3),
        '--works-current-intro-height': `${currentIntroHeight.toFixed(2)}px`,
      };

      setIntroStyle((current) =>
        current['--works-title-size'] === nextStyle['--works-title-size'] &&
        current['--works-current-intro-height'] === nextStyle['--works-current-intro-height']
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

function resetAiCardTilt(card) {
  card.style.setProperty('--tilt-rotate-x', '0deg');
  card.style.setProperty('--tilt-rotate-y', '0deg');
  card.style.setProperty('--tilt-glare-opacity', '0');
}

function handleAiCardTiltMove(event) {
  if (event.pointerType && event.pointerType !== 'mouse') return;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateY = (x - 0.5) * 9;
  const rotateX = (0.5 - y) * 6;

  card.style.setProperty('--tilt-rotate-x', `${rotateX.toFixed(2)}deg`);
  card.style.setProperty('--tilt-rotate-y', `${rotateY.toFixed(2)}deg`);
  card.style.setProperty('--tilt-glare-x', `${(x * 100).toFixed(1)}%`);
  card.style.setProperty('--tilt-glare-y', `${(y * 100).toFixed(1)}%`);
  card.style.setProperty('--tilt-glare-opacity', '0.2');
}

function handleAiCardTiltReset(event) {
  resetAiCardTilt(event.currentTarget);
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
      const targetW = Math.min(viewportW - pagePad * 4, pageMax - pagePad * 4);
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
            <a href="#ai-exploration" className="approach-link ai-exploration-link">
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
            <a
              className="ai-practice-card"
              href={`/works/${item.slug}`}
              key={`${item.title}-${index}`}
              aria-label={item.title}
              onPointerMove={handleAiCardTiltMove}
              onPointerLeave={handleAiCardTiltReset}
              onPointerCancel={handleAiCardTiltReset}
            >
              <div className="ai-practice-copy">
                <span>AI</span>
                <h3>
                  <small>{item.kicker}</small>
                  {item.title}
                </h3>
              </div>
              <img src={item.image} alt={item.alt} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

function Expertise() {
  const profileRows = [
    ['[毕业院校]', '鲁迅美术学院', '2013-2017'],
    ['[学历]', '本科', ''],
    ['[专业]', '传媒动画', '动效 / 叙事 / 视觉表达'],
    ['[研究方向]', '移动新媒体', '交互媒介 / 数字体验'],
    ['[个人网站]', 'ice_zhou.art', 'Portfolio'],
    ['[电话（+86）]', '13942083539', 'WeChat 同号'],
    ['[工作地点]', '上海', '可考虑江浙沪'],
  ];

  return (
    <MotionSection className="section profile-info-section" id="about">
      <Reveal className="profile-info-media" delay={0.02}>
        <img src="/assets/profile-photo-figma.png" alt="周塞寒头像" loading="lazy" />
      </Reveal>
      <Reveal className="profile-info-content" delay={0.08}>
        <div className="profile-info-heading">
          <h2>周塞寒</h2>
          <span aria-hidden="true">·</span>
          <h3>UX设计专家</h3>
          <span aria-hidden="true">·</span>
          <h3>9年经验</h3>
        </div>
        <div className="profile-info-table" aria-label="个人信息">
          {profileRows.map(([label, value, note]) => (
            <div className="profile-info-row" key={label}>
              <span>{label}</span>
              <i aria-hidden="true">·</i>
              <strong>{value}</strong>
              <em>{note}</em>
            </div>
          ))}
        </div>
        <Reveal className="profile-info-label" delay={0.18}>
          <h4>
            个人信息 <span>[2]</span>
          </h4>
          <p>复杂 B 端系统体验、动效表达与设计工程化实践。</p>
        </Reveal>
      </Reveal>
    </MotionSection>
  );
}

function Awards() {
  const [openIndexes, setOpenIndexes] = useState(() => new Set([0]));

  const handleToggle = (index) => {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <MotionSection className="section rows-section resume-section resume-recap-section content-810 sticky-module" id="resume" sticky>
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
            isOpen={openIndexes.has(index)}
            key={item.title}
            onToggle={() => handleToggle(index)}
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
  const footerRef = useRef(null);
  const footerVideoRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const loopVideo = footerVideoRef.current;
    if (!footer) return undefined;

    let isVisible = false;

    const playContactMotion = () => {
      footer.classList.remove('is-contact-playing');
      void footer.offsetWidth;
      footer.classList.add('is-contact-playing');
    };

    const playLoopVideo = () => {
      loopVideo?.play().catch(() => {});
    };

    const resetContactMotion = () => {
      footer.classList.remove('is-contact-playing');
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          isVisible = true;
          playLoopVideo();
          playContactMotion();
        } else if (!entry.isIntersecting && isVisible) {
          isVisible = false;
          loopVideo?.pause();
          resetContactMotion();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer className="footer goodbye-footer" id="contact" aria-label="Footer" ref={footerRef}>
      <div className="goodbye-inner">
        <div className="goodbye-strip" aria-label="Contact">
          <div className="goodbye-left-cluster">
            <a className="goodbye-block goodbye-left-shape goodbye-block-dot" href="#about" aria-label="Contact">
              ·
            </a>
            <span className="goodbye-block goodbye-left-shape goodbye-block-slash">/</span>
            <span className="goodbye-block goodbye-left-shape goodbye-block-contact">Contact</span>
            <span className="goodbye-adhesion goodbye-adhesion-dot" aria-hidden="true">
              <svg viewBox="-24 -18 32 36" focusable="false">
                <path d="M-0.131 -11.374 C-0.131 -11.374 -8.574 -7.127 -16.44 -11.374 L-16.44 11.373 C-16.44 11.373 -8.574 6.065 -0.131 11.373 Z" />
              </svg>
            </span>
            <span className="goodbye-adhesion goodbye-adhesion-contact" aria-hidden="true">
              <svg viewBox="-24 -18 32 36" focusable="false">
                <path d="M-0.131 -11.374 C-0.131 -11.374 -8.574 -7.127 -16.44 -11.374 L-16.44 11.373 C-16.44 11.373 -8.574 6.065 -0.131 11.373 Z" />
              </svg>
            </span>
          </div>
          <figure className="goodbye-image-pill">
            <video
              ref={footerVideoRef}
              aria-label="Ice Zhou contact video"
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/goodbye-strip.png"
              preload="auto"
              src="/assets/footer-contact-video.mov"
              onPointerEnter={() => footerVideoRef.current?.play().catch(() => {})}
            />
          </figure>
          <a className="goodbye-arrow" href="#" aria-label="Back to top">
            <span aria-hidden="true" />
          </a>
          <span className="goodbye-block goodbye-block-me" aria-label="Me, 13942083539, zhousaihanwork@gmail">
            <span className="goodbye-flip-track" aria-hidden="true">
              <span>“Me”</span>
              <span>13942083539</span>
              <span>zhousaihanwork@gmail</span>
              <span>“Me”</span>
            </span>
          </span>
        </div>
        <p>Designed and Coded by Ice Zhou • Copyright @ 2026|</p>
      </div>
    </footer>
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

function renderDetailCopyBlock(block, index, mediaPreview = {}) {
  const key = `${block.type}-${index}`;
  const headingId = getDetailHeadingId(block, index);
  const openMediaPreview = mediaPreview.openMediaPreview || (() => {});

  if (block.type === 'sectionTitle') {
    return (
      <h2
        className={`detail-copy-section-title detail-copy-section-title-${block.tone || 'default'}`}
        data-detail-toc-id={headingId}
        id={headingId}
        key={key}
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === 'moduleTitle') {
    return (
      <h3 className="detail-copy-module-title" data-detail-toc-id={headingId} id={headingId} key={key}>
        {block.text}
      </h3>
    );
  }

  if (block.type === 'subTitle') {
    return (
      <h4 className="detail-copy-subtitle" data-detail-toc-id={headingId} id={headingId} key={key}>
        {block.text}
      </h4>
    );
  }

  if (block.type === 'minorTitle') {
    return (
      <p className="detail-copy-minor-title" key={key}>
        {block.text}
      </p>
    );
  }

  if (block.type === 'callout') {
    return (
      <p className={`detail-copy-callout detail-copy-callout-${block.tone || 'default'}`} key={key}>
        <span aria-hidden="true">💡</span>
        <span>{block.text}</span>
      </p>
    );
  }

  if (block.type === 'calloutWithImages') {
    return (
      <div className={`detail-copy-callout detail-copy-callout-with-images detail-copy-callout-${block.tone || 'default'}`} key={key}>
        <p>
          <span aria-hidden="true">💡</span>
          <span>{block.text}</span>
        </p>
        <div className="detail-copy-callout-images">
          {block.images.map((image) => (
            <figure
              className="detail-copy-figure"
              key={image.src}
              style={image.aspectRatio ? { aspectRatio: image.aspectRatio } : undefined}
            >
              <button
                className="detail-copy-media-button"
                type="button"
                onClick={() => openMediaPreview(image.src)}
                aria-label={`放大预览：${image.alt || '图片'}`}
              >
                <img src={image.src} alt={image.alt || ''} loading="lazy" />
              </button>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === 'caption') {
    return (
      <p className="detail-copy-caption" key={key}>
        {block.text}
      </p>
    );
  }

  if (block.type === 'bulletCaption') {
    return (
      <ul className="detail-copy-bullet-caption" key={key}>
        <li>{block.text}</li>
      </ul>
    );
  }

  if (block.type === 'image') {
    return (
      <figure
        className={`detail-copy-figure ${block.className || ''}`}
        key={key}
        style={block.aspectRatio ? { aspectRatio: block.aspectRatio } : undefined}
      >
        <button
          className="detail-copy-media-button"
          type="button"
          onClick={() => openMediaPreview(block.src)}
          aria-label={`放大预览：${block.alt || '图片'}`}
        >
          <img src={block.src} alt={block.alt || ''} loading="lazy" />
        </button>
      </figure>
    );
  }

  if (block.type === 'imagePair') {
    return (
      <div
        className={`detail-copy-image-pair ${block.className || ''}`}
        key={key}
        style={block.columns ? { gridTemplateColumns: block.columns } : undefined}
      >
        {block.images.map((image) => (
          <figure
            className="detail-copy-figure"
            key={image.src}
            style={image.aspectRatio ? { aspectRatio: image.aspectRatio } : undefined}
          >
            <button
              className="detail-copy-media-button"
              type="button"
              onClick={() => openMediaPreview(image.src)}
              aria-label={`放大预览：${image.alt || '图片'}`}
            >
              <img
                src={image.src}
                alt={image.alt || ''}
                loading="lazy"
                style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
              />
            </button>
          </figure>
        ))}
      </div>
    );
  }

  if (block.type === 'videoPair') {
    return (
      <div className="detail-copy-video-pair" key={key}>
        {block.videos.map((video) => (
          <figure className="detail-copy-video-figure" key={video.src}>
            <button
              className="detail-copy-media-button"
              type="button"
              onClick={() => openMediaPreview(video.src)}
              aria-label={`放大预览：${video.label || '视频'}`}
            >
              <video
                src={video.src}
                aria-label={video.label}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </button>
          </figure>
        ))}
      </div>
    );
  }

  if (block.type === 'orderedPoints') {
    return (
      <div className="detail-copy-points" key={key}>
        {block.items.map(([title, text]) => (
          <div className="detail-copy-point" key={title}>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === 'richParagraphs') {
    return (
      <div className="detail-copy-paragraphs" key={key}>
        {block.items.map((segments, paragraphIndex) => (
          <p key={`${key}-paragraph-${paragraphIndex}`}>
            {segments.map((segment, segmentIndex) => (
              <span className={segment.tone ? `detail-copy-text-${segment.tone}` : undefined} key={`${segment.text}-${segmentIndex}`}>
                {segment.text}
              </span>
            ))}
          </p>
        ))}
      </div>
    );
  }

  if (block.type === 'paragraphs') {
    return (
      <div className="detail-copy-paragraphs" key={key}>
        {block.items.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  return null;
}

function getDetailHeadingId(block, index) {
  if (!['sectionTitle', 'moduleTitle', 'subTitle'].includes(block.type)) {
    return undefined;
  }

  return `detail-section-${index}`;
}

function getDetailTocItems(copyBlocks = []) {
  return copyBlocks
    .map((block, index) => {
      const id = getDetailHeadingId(block, index);

      if (!id) return null;

      const level = block.type === 'sectionTitle' ? 1 : block.type === 'moduleTitle' ? 2 : 3;
      return {
        id,
        level,
        text: block.text,
      };
    })
    .filter(Boolean);
}

function getDetailMediaItems(detail) {
  const copyMedia = (detail.copyBlocks || []).flatMap((block) => {
    if (block.type === 'image') {
      return [{ type: 'image', src: block.src, previewSrc: block.previewSrc, alt: block.alt || '图片预览' }];
    }

    if (block.type === 'imagePair' || block.type === 'calloutWithImages') {
      return (block.images || []).map((image) => ({
        type: 'image',
        src: image.src,
        previewSrc: image.previewSrc,
        alt: image.alt || '图片预览',
      }));
    }

    if (block.type === 'videoPair') {
      return (block.videos || []).map((video) => ({
        type: 'video',
        src: video.src,
        alt: video.label || '视频预览',
      }));
    }

    return [];
  });

  const galleryMedia = (detail.images || []).map((image) => ({
    type: 'image',
    src: image.src,
    previewSrc: image.previewSrc,
    alt: image.alt || '图片预览',
  }));

  return [...copyMedia, ...galleryMedia];
}

function getDetailHeroCard(work) {
  const aiPractice = efficiencyShowcase.practices.find((item) => item.slug === work.slug);

  if (aiPractice) {
    return {
      label: 'AI',
      kicker: aiPractice.kicker,
      title: aiPractice.title,
      image: aiPractice.image,
      alt: aiPractice.alt,
      className: 'is-ai-card',
    };
  }

  return {
    label: 'Works',
    kicker: work.type,
    title: work.title,
    image: work.image,
    video: work.video,
    alt: work.alt || work.title,
    className: 'is-work-card',
  };
}

function DetailHeroCard({ work }) {
  const card = getDetailHeroCard(work);

  return (
    <div className={`detail-hero-card ${card.className}`} aria-label={`${card.title} 展示卡片`}>
      <div className="detail-hero-card-copy">
        <span>{card.label}</span>
        <h2>
          <small>{card.kicker}</small>
          {card.title}
        </h2>
      </div>
      {card.video ? (
        <video
          src={card.video}
          poster={card.image}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <img src={card.image} alt={card.alt} loading="eager" />
      )}
    </div>
  );
}

function WorkDetail({ work, detail }) {
  const facts = detail.facts;
  const otherContentCards = getOtherContentCards(work.slug);
  const tocItems = useMemo(() => getDetailTocItems(detail.copyBlocks), [detail.copyBlocks]);
  const mediaItems = useMemo(() => getDetailMediaItems(detail), [detail]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [previewCursor, setPreviewCursor] = useState({ x: 0, y: 0, active: false });
  const [detailCursor, setDetailCursor] = useState({ x: 0, y: 0, active: false });
  const [showDetailToc, setShowDetailToc] = useState(false);
  const [activeTocId, setActiveTocId] = useState(tocItems[0]?.id || null);
  const previewMedia = previewIndex === null ? null : mediaItems[previewIndex];
  const mediaCount = mediaItems.length;
  const galleryMediaOffset = mediaItems.length - detail.images.length;

  const movePreview = (direction) => {
    setPreviewIndex((currentIndex) => {
      if (!mediaCount) return null;
      const nextIndex = currentIndex === null ? 0 : currentIndex + direction;
      return (nextIndex + mediaCount) % mediaCount;
    });
  };

  useEffect(() => {
    if (previewIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setPreviewIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        movePreview(-1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        movePreview(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewIndex, mediaCount]);

  useEffect(() => {
    if (!tocItems.length) return undefined;

    const updateTocState = () => {
      const copy = document.querySelector('.detail-copy');
      if (!copy) return;

      const copyTop = copy.getBoundingClientRect().top;
      const nextShowToc = copyTop <= 112;
      setShowDetailToc(nextShowToc);

      const headingElements = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);
      const activeHeading =
        [...headingElements].reverse().find((heading) => heading.getBoundingClientRect().top <= 160) ||
        headingElements[0];

      if (activeHeading) {
        setActiveTocId(activeHeading.id);
      }
    };

    updateTocState();
    window.addEventListener('scroll', updateTocState, { passive: true });
    window.addEventListener('resize', updateTocState);

    return () => {
      window.removeEventListener('scroll', updateTocState);
      window.removeEventListener('resize', updateTocState);
    };
  }, [tocItems]);

  const handleTocClick = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  };

  const openMediaPreview = (src) => {
    const nextIndex = mediaItems.findIndex((item) => item.src === src);
    if (nextIndex === -1) return;
    setDetailCursor((cursor) => ({ ...cursor, active: false }));
    setPreviewIndex(nextIndex);
  };

  return (
    <>
      <main className="detail-page" id="top">
        <aside className={`detail-sidebar${showDetailToc && tocItems.length ? ' is-toc-mode' : ''}`} aria-label="Project details">
          <div className="detail-sidebar-panel detail-sidebar-facts">
            {facts.map(([label, value]) => (
              <div className="detail-fact" key={label}>
                <p>{label}</p>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          {tocItems.length ? (
            <nav className="detail-sidebar-panel detail-toc" aria-label="文章目录">
              {tocItems.map((item) => (
                <a
                  className={`detail-toc-link detail-toc-level-${item.level}${activeTocId === item.id ? ' is-active' : ''}`}
                  href={`#${item.id}`}
                  key={item.id}
                  onClick={(event) => handleTocClick(event, item.id)}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          ) : null}
        </aside>
        <article className="detail-content">
          <Reveal className="detail-intro">
            <h1>{detail.headline}</h1>
          </Reveal>
          <Reveal className="detail-hero-card-wrap" delay={0.04}>
            <DetailHeroCard work={work} />
          </Reveal>
          {detail.copyBlocks ? (
            <div className="detail-copy">
              {detail.copyBlocks.map((block, index) => renderDetailCopyBlock(block, index, { openMediaPreview }))}
            </div>
          ) : (
            <Reveal className="detail-copy" delay={0.05}>
              {detail.copy.map((paragraph) =>
                detailCopyHeadingTexts.has(paragraph) ? (
                  <h2 className="detail-copy-heading" key={paragraph}>
                    {paragraph}
                  </h2>
                ) : (
                  <p key={paragraph}>{paragraph}</p>
                ),
              )}
            </Reveal>
          )}
          {detail.images.length ? (
            <div className="detail-gallery">
              {detail.images.map((image, index) => (
                <Reveal
                  className={`detail-image${index === 0 && !image.preserveRatio ? ' detail-image-wide' : ''}${
                    image.preserveRatio ? ' detail-image-natural' : ''
                  }`}
                  key={`${image.src}-${index}`}
                >
                  <button
                    className="detail-image-button"
                    type="button"
                  onClick={() => {
                    setDetailCursor((cursor) => ({ ...cursor, active: false }));
                    setPreviewIndex(galleryMediaOffset + index);
                  }}
                    onPointerMove={(event) =>
                      setDetailCursor({ x: event.clientX, y: event.clientY, active: true })
                    }
                    onPointerEnter={(event) =>
                      setDetailCursor({ x: event.clientX, y: event.clientY, active: true })
                    }
                    onPointerLeave={() => setDetailCursor((cursor) => ({ ...cursor, active: false }))}
                    aria-label={`预览图片：${image.alt}`}
                  >
                    <img src={image.src} alt={image.alt} loading={index > 1 ? 'lazy' : 'eager'} />
                  </button>
                </Reveal>
              ))}
            </div>
          ) : null}
          <Reveal className="related-title">
            <h2>其他内容</h2>
          </Reveal>
          <div className="detail-related-grid">
            {otherContentCards.map((related, index) => (
              <Reveal className="detail-related-card" key={related.slug} delay={index * 0.08}>
                <a className="image-link" href={`/works/${related.slug}`} aria-label={related.title}>
                  <span className="detail-related-cover">
                    {related.video ? (
                      <video
                        src={related.video}
                        poster={related.image}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        aria-hidden="true"
                        onCanPlay={(event) => {
                          event.currentTarget.play().catch(() => {});
                        }}
                      />
                    ) : (
                      <img src={related.image} alt={related.alt} loading="lazy" />
                    )}
                  </span>
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
      <span
        className={`detail-hover-cursor${detailCursor.active ? ' is-visible' : ''}`}
        style={{ left: `${detailCursor.x}px`, top: `${detailCursor.y}px` }}
        aria-hidden="true"
      />
      {previewMedia ? (
        <div
          className="image-preview"
          role="dialog"
          aria-modal="true"
          aria-label="媒体预览"
          onPointerMove={(event) =>
            setPreviewCursor({ x: event.clientX, y: event.clientY, active: true })
          }
          onPointerEnter={(event) =>
            setPreviewCursor({ x: event.clientX, y: event.clientY, active: true })
          }
          onPointerLeave={() => setPreviewCursor((cursor) => ({ ...cursor, active: false }))}
        >
          <button
            className="image-preview-close"
            type="button"
            onClick={() => setPreviewIndex(null)}
            aria-label="关闭媒体预览"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
          <button
            className="image-preview-zone image-preview-zone-left"
            type="button"
            onClick={() => movePreview(-1)}
            aria-label="上一个媒体"
          />
          <figure className="image-preview-figure">
            {previewMedia.type === 'video' ? (
              <video
                src={previewMedia.src}
                aria-label={previewMedia.alt}
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : (
              <img src={previewMedia.previewSrc || previewMedia.src} alt={previewMedia.alt} />
            )}
            <figcaption>
              {String(previewIndex + 1).padStart(2, '0')} / {String(mediaCount).padStart(2, '0')}
            </figcaption>
          </figure>
          <button
            className="image-preview-zone image-preview-zone-right"
            type="button"
            onClick={() => movePreview(1)}
            aria-label="下一个媒体"
          />
          <span
            className={`image-preview-cursor${previewCursor.active ? ' is-visible' : ''}`}
            style={{ left: `${previewCursor.x}px`, top: `${previewCursor.y}px` }}
            aria-hidden="true"
          />
        </div>
      ) : null}
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
  const aiWorkItems = efficiencyShowcase.practices.map((item) => ({
    slug: item.slug,
    title: item.title,
    type: 'AI exploration',
    image: item.image,
    alt: item.alt,
    description: item.description,
  }));
  const currentWork = workMatch
    ? [...works, ...approachWorkItems, ...aiWorkItems].find((work) => work.slug === workMatch[1])
    : null;
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
        headline:
          currentWork.slug === 'project-framing'
            ? '米线游戏制作管理系统'
            : `"${currentWork.title} is structured as a portfolio case system: clear enough to scan quickly, but rich enough to hold process, imagery, and interaction details."`,
        copy:
          currentWork.slug === 'project-framing'
            ? [
                '米线平台是面向大型游戏项目研发流程的生产协同平台，核心目标是帮助策划、PM、环节负责人、组长与一线制作人员，在复杂版本制作中完成需求拆解、任务分配、流程流转、进度追踪、资源评估与质量管控。',
                '它并不是一个单纯的项目管理工具，而是更贴近游戏内容生产场景的研发生产管线平台：从版本需求产生，到任务逐级拆解，再到原画、3D、绑定、动画、特效等多环节协同制作，平台通过结构化任务、可视化排期、工作流规则和人员负载管理，保障大量内容可以在有限版本周期内稳定推进。',
              ]
            : [
                currentWork.description || 'A structured portfolio module designed to turn project material into a clear case-study narrative.',
                'The page follows the same detail structure as the main project cases, with a left information rail, a large editorial statement, supporting notes, and a scalable image gallery for future assets.',
              ],
        images:
          currentWork.slug === 'project-framing'
            ? projectFramingGallery
            : currentWork.slug === 'visual-system'
              ? localizationGallery
            : [
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
  const hideHeaderOverAi = useHeaderHiddenOverAi(route.pathname);

  return (
    <>
      <Header
        routePath={route.pathname}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        hideForAi={hideHeaderOverAi}
      />
      <RouteTransitionOverlay transition={routeTransition} />
      {page}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

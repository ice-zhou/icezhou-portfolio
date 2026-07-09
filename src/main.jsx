import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { Alignment, Fit, Layout, Rive as RiveRuntime } from '@rive-app/canvas';
import './styles.css';

const remote = {
  profile: 'https://framerusercontent.com/images/nKZxL3ov6hieQXZbst1I06HCxPI.jpg?width=627&height=627',
  navAvatar: '/assets/nav-avatar.jpg?v=20260708',
  favicon: '/assets/site-favicon.jpg?v=20260708',
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

const resumePdf = {
  url: import.meta.env.VITE_RESUME_PDF_URL || '/assets/zhou-saihan-ux-designer.pdf',
  filename: '周塞寒-UX设计师.pdf',
};

const mergeClassNames = (...classNames) => classNames.filter(Boolean).join(' ');

const PlaceholderImage = React.forwardRef(function PlaceholderImage(
  { className = '', src, onLoad, onError, ...props },
  forwardedRef,
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const nodeRef = useRef(null);

  const setRefs = useCallback(
    (node) => {
      nodeRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  useEffect(() => {
    setIsLoaded(false);
    const node = nodeRef.current;
    if (node?.complete && node.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <img
      {...props}
      ref={setRefs}
      src={src}
      className={mergeClassNames('image-placeholder', isLoaded && 'is-loaded', className)}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        setIsLoaded(false);
        onError?.(event);
      }}
    />
  );
});

const LazyVideo = React.forwardRef(function LazyVideo(
  { src, autoPlay = true, preload = 'metadata', rootMargin = '600px', ...props },
  forwardedRef,
) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const nodeRef = useRef(null);

  const setRefs = useCallback(
    (node) => {
      nodeRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || shouldLoad) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !autoPlay) return;
    nodeRef.current?.play().catch(() => {});
  }, [autoPlay, shouldLoad, src]);

  return (
    <video
      ref={setRefs}
      src={shouldLoad ? src : undefined}
      autoPlay={shouldLoad ? autoPlay : false}
      preload={shouldLoad ? preload : 'none'}
      {...props}
    />
  );
});

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
    detailHeroImage: '/assets/localization-hero-object.png',
    detailHeroImageMode: 'contain',
    video: '/assets/bg-type-2.mp4',
    tags: ['复杂工具', '多语种协作', '游戏本地化'],
  },
  {
    slug: 'motion-prototype',
    number: '03',
    title: 'HoYo&Seed Design 组件库',
    titleParts: ['HoYo', '&', 'Seed', 'Design', '组件库'],
    description: '米哈游 HoYoDesign 组件库  +  可视化配置平台\n字节跳动教育 SeedDesign 组件库  +  低代码配置平台',
    image: '/assets/component-library-display/hyd/01.png',
    detailHeroImage: '/assets/component-library-hero-object.png',
    detailHeroImageMode: 'contain',
    video: '/assets/component-library-cover-v2.mp4',
    tags: ['组件库', '基建系统', '映射', '配置平台'],
  },
  {
    slug: 'case-delivery',
    number: '04',
    title: '磁极众包 & Solvelancer',
    titleParts: ['磁极众包', '&', 'Solvelancer'],
    description:
      '全球众包平台，使企业及业务方能够将零散工作外包给分布式劳动力。目前可接纳文字、图片、视频等教育内容资产的生产，产品功能允许多端配置生产流程，包括生产、质检、仲裁、验收等多个生产节点的自由定制',
    image: '/assets/magnetic-crowd/01.png',
    detailHeroImage: '/assets/magnetic-crowd-hero-object.png?v=magnetic-hero-object-20260705b',
    detailHeroImageMode: 'contain',
    detailHeroLabel: 'Works',
    detailHeroKicker: 'Project approach',
    detailHeroVariant: 'compact-figma',
    video: '/assets/magnetic-crowd-cover.mp4?v=magnetic-cover-latest-20260703',
    tags: ['众包平台', 'Web + H5', '教育资产'],
  },
];

const lifeLinkTabs = [
  {
    showcaseIndex: 0,
    items: [
      { icon: '⛺️', label: '露营' },
      { icon: '🏔️', label: '徒步' },
      { icon: '🎸', label: '摇滚' },
    ],
  },
  {
    showcaseIndex: 12,
    items: [
      { icon: '🛩️', label: '旅行' },
      { icon: '📸', label: '摄影' },
      { icon: '🎮', label: '游戏' },
    ],
  },
];

const getLifeTabIndexForShowcase = (showcaseIndex) => {
  let tabIndex = 0;
  lifeLinkTabs.forEach((tab, index) => {
    if (showcaseIndex >= tab.showcaseIndex) {
      tabIndex = index;
    }
  });
  return tabIndex;
};

const lifeLinkShowcases = [
  {
    label: '露营',
    main: '/assets/life-tabs/first-group/01.png',
    alt: '露营生活照片',
    mainPosition: '50% 50%',
  },
  {
    label: '旅行',
    main: '/assets/life-tabs/first-group/02.png',
    alt: '旅行生活照片',
    mainPosition: '50% 50%',
  },
  {
    label: '徒步',
    main: '/assets/life-tabs/first-group/03.png',
    alt: '徒步生活照片',
    mainPosition: '50% 50%',
  },
  {
    label: '露营细节',
    main: '/assets/life-tabs/first-group/04.png',
    alt: '露营生活细节',
    mainPosition: '50% 50%',
  },
  {
    label: '旅行路上',
    main: '/assets/life-tabs/first-group/05.png',
    alt: '旅行生活照片',
    mainPosition: '50% 50%',
  },
  {
    label: '山野徒步',
    main: '/assets/life-tabs/first-group/06.png',
    alt: '山野徒步照片',
    mainPosition: '50% 50%',
  },
  {
    label: '户外片段',
    main: '/assets/life-tabs/first-group/07.png',
    alt: '户外生活照片',
    mainPosition: '50% 50%',
  },
  {
    label: '旅途记录',
    main: '/assets/life-tabs/first-group/08.png',
    alt: '旅途记录照片',
    mainPosition: '50% 50%',
  },
  {
    label: '自然风景',
    main: '/assets/life-tabs/first-group/09.png',
    alt: '自然风景照片',
    mainPosition: '50% 50%',
  },
  {
    label: '摇滚现场',
    main: '/assets/life-tabs/first-group/10.png',
    alt: '摇滚现场照片',
    mainPosition: '50% 50%',
  },
  {
    label: '音乐节现场',
    main: '/assets/life-tabs/first-group/11.png',
    alt: '音乐节现场照片',
    mainPosition: '50% 50%',
  },
  {
    label: '舞台演出',
    main: '/assets/life-tabs/first-group/12.png',
    alt: '舞台演出照片',
    mainPosition: '50% 50%',
  },
  ...Array.from({ length: 10 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return {
      label: `第二组 ${number}`,
      main: `/assets/life-tabs/second-group/${number}.png`,
      alt: `第二组生活照片 ${number}`,
      mainPosition: '50% 50%',
    };
  }),
];

const getLifeTabShowcaseRange = (tabIndex) => {
  const start = lifeLinkTabs[tabIndex].showcaseIndex;
  const end = lifeLinkTabs[tabIndex + 1]?.showcaseIndex ?? lifeLinkShowcases.length;
  return {
    start,
    end,
    length: end - start,
  };
};

const projectFramingFigmaBoardUrl =
  'https://www.figma.com/board/c294SSyHAp8Incr6QWVvK3/%E6%B8%B8%E6%88%8F%E7%BE%8E%E6%9C%AF%E5%88%B6%E4%BD%9C%E6%B5%81%E7%A8%8B?node-id=0-1&t=fV5slRJQCqZNdwG4-1';
const projectFramingFigmaEmbed = {
  type: 'figmaEmbed',
  src: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(projectFramingFigmaBoardUrl)}`,
  title: '游戏美术制作流程 Figma 小窗预览',
};

const projectFramingGallery = Array.from({ length: 30 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  const assetVersion = ['01', '05', '08'].includes(number) ? '?v=portfolio-20260626d' : '';
  return {
    number,
    src: `/assets/mixian-portfolio/${number}.png${assetVersion}`,
    previewSrc: `/assets/mixian-portfolio-preview/${number}.png${assetVersion}`,
    alt: `米线游戏制作管理项目图 ${number}`,
    preserveRatio: true,
  };
})
  .filter((image) => image.number !== '17')
  .flatMap((image, index) => (index === 0 ? [image, projectFramingFigmaEmbed] : [image]));

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

const magneticCrowdGallery = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    src: `/assets/magnetic-crowd/${number}.png`,
    alt: `磁极众包与 Solvelancer 项目图 ${number}`,
    preserveRatio: true,
    loading: 'eager',
  };
});

const detailCopyHeadingTexts = new Set([
  'HoYo Design 组件体系与配置平台',
  'Seed组件库 & Brickform低代码搭建平台',
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

const aiSkillFigmaAssets = {
  constraintLight: 'https://www.figma.com/api/mcp/asset/28bff141-09d4-4a66-aebf-bb0b81e1543a',
  constraintDark: 'https://www.figma.com/api/mcp/asset/f2156a17-64a2-456b-9aba-dc94ab52f0eb',
  componentSkillA: 'https://www.figma.com/api/mcp/asset/b41c35ca-e58b-4228-9c5e-d32c7d895863',
  componentSkillB: 'https://www.figma.com/api/mcp/asset/de76c333-4786-4808-8c6b-7961ed81817a',
  pageSkillA: 'https://www.figma.com/api/mcp/asset/5788d6de-7ad0-40fe-a59b-96aa8b8d5b38',
  pageSkillB: 'https://www.figma.com/api/mcp/asset/4335f197-bca7-496f-b39e-9550a5999bec',
  blockSkillA: 'https://www.figma.com/api/mcp/asset/8bd020a7-049e-4da7-8ec3-178b4897c005',
  blockSkillB: 'https://www.figma.com/api/mcp/asset/a82c9493-4040-4e1c-946b-f256b183aa85',
  gitBanner: 'https://www.figma.com/api/mcp/asset/309086b0-996e-4415-b761-c87e294ffa4c',
  gitMobileA: 'https://www.figma.com/api/mcp/asset/6df0cf2d-9556-4d2a-8a1c-e7b39196ea25',
  gitMobileB: 'https://www.figma.com/api/mcp/asset/d97c64d2-17ec-4f6e-b1fc-aacb246d664e',
  gitRules: 'https://www.figma.com/api/mcp/asset/c8d83e51-1641-4812-ad49-65598177bba1',
  scenarioDesigner: 'https://www.figma.com/api/mcp/asset/a8c9dece-767d-4bcb-9188-18dbbebf86fd',
  scenarioProduct: 'https://www.figma.com/api/mcp/asset/8eea619f-8732-4749-a8d6-907b98c7644c',
  scenarioGameTeam: 'https://www.figma.com/api/mcp/asset/e11db05d-b6b2-455d-b30f-e784813da741',
};

const aiDesignContextFigmaAssets = {
  targetChain: 'https://www.figma.com/api/mcp/asset/7a7a2eff-665f-4e42-93d4-d27961a60449',
  iterationChain: 'https://www.figma.com/api/mcp/asset/0c1157bf-c5a2-4275-92c9-47258cf91302',
  logicMap: 'https://www.figma.com/api/mcp/asset/4ac0058e-3b51-4873-889d-ab1648bf65e9',
  contextPath: 'https://www.figma.com/api/mcp/asset/43004607-c282-4828-be32-d7e7efcb8810',
  contextSchema: 'https://www.figma.com/api/mcp/asset/ee34fc10-417e-40b6-b437-8ae502228288',
  skillPattern: 'https://www.figma.com/api/mcp/asset/d5cba248-d338-4720-8bae-b2381f25d4e2',
  routingTree: 'https://www.figma.com/api/mcp/asset/ae92f730-c0fd-40e5-9c82-b55274dfe08c',
  endToEnd: 'https://www.figma.com/api/mcp/asset/4ffec97e-5bbd-4af0-8031-2f5c47c2ec78',
  simpleCase: 'https://www.figma.com/api/mcp/asset/b854d99b-ac15-41d6-a426-dce1275fd05c',
  simpleResultA: 'https://www.figma.com/api/mcp/asset/08b40dcf-d487-45b8-a534-3734b20aed8a',
  simpleResultB: 'https://www.figma.com/api/mcp/asset/6a4be23a-f71d-4652-934a-627187f16d8b',
  simpleScore: 'https://www.figma.com/api/mcp/asset/3c0bdda9-2f92-4320-b223-a9e901bbcef5',
  simpleResultC: 'https://www.figma.com/api/mcp/asset/39f40253-7923-4b2c-a7d0-fb7fe92d9678',
  mediumReference: 'https://www.figma.com/api/mcp/asset/554ccd2b-17d0-4c56-b6d0-bf789490eda2',
  mediumCompareA: 'https://www.figma.com/api/mcp/asset/60b0039f-559d-4056-8e90-faad04e67d80',
  mediumCompareB: 'https://www.figma.com/api/mcp/asset/fc71b65d-e863-46c3-ad7d-ad7c1db058fb',
  mediumCompareC: 'https://www.figma.com/api/mcp/asset/75d5e385-97a4-4ea2-9b96-8a8480c7edab',
  mediumCompareD: 'https://www.figma.com/api/mcp/asset/bf38b053-cd72-4788-95d5-febeee97790e',
  complexReviewA: 'https://www.figma.com/api/mcp/asset/bc20a33d-2011-469e-9eaa-89f8273226b1',
  complexReviewB: 'https://www.figma.com/api/mcp/asset/a4ddb320-2703-4602-887b-9371cd5534cb',
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
        title: 'HoYo Design 组件体系与配置平台',
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
    roleTitle: 'UX设计师',
    badge: '绩效M+ 完成2-1～2-2晋级',
    intro:
      '负责教育资源生产方向业务，包括国内外教育资源生产、消费、结算、产能监控、质量管控，以及面向海外市场的题目快速问答体验。',
    details: [
      {
        title: '磁极众包 & Solvelancer',
        items: [
          '0-1负责磁极众包(国内)与Solvelancer(海外)Web + H5 端设计',
          '面向 B 端资源生产流程，设计覆盖任务生产、任务消费、结算、产能监控、质量管理等核心模块。',
          '面向 C 端用户，支持美国、印度市场的题目快速问答场景。',
          '负责产品内动效设计、运营活动设计与关键视觉体验。',
        ],
      },
      {
        title: 'Seed组件库 & Brickform低代码搭建平台',
        items: [
          '结合教育资源生产业务特性，与前端团队从 0-1 搭建 Seed 组件库。',
          '组件库支持 Web 端搭建后无缝适配 H5 端，提升跨端设计与研发效率。',
          '基于 Seed 组件库，完成教育资源生产系统低代码搭建平台 Brickform 的设计。',
          '支持业务方根据不同生产场景快速搭建资源生产系统。',
        ],
      },
    ],
    metaRole: 'UX设计师',
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
    year: '2017',
    roleTitle: 'UI设计师',
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
    metaRole: 'UI设计师',
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
      title: '设计系统Skill建设',
      image: '/assets/ai-card-visual-2.png',
      alt: 'AI x Skill 设计系统Skill建设',
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
  const isAiSlug = efficiencyShowcase.practices.some((item) => item.slug === currentSlug);
  const sourceCards = secondaryContentCards.filter((item) => (isAiSlug ? item.type === 'AI' : item.type !== 'AI'));
  const currentIndex = sourceCards.findIndex((item) => item.slug === currentSlug);

  if (currentIndex === -1) {
    return sourceCards.slice(0, limit);
  }

  return Array.from({ length: sourceCards.length - 1 }, (_, offset) => {
    const nextIndex = (currentIndex + offset + 1) % sourceCards.length;
    return sourceCards[nextIndex];
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
      'HoYo Design 组件体系与配置平台',
      '作为设计侧 Owner，负责米哈游基础组件体系 HoYo Design 的 0-1 搭建，并在此基础上完成组件库配置平台设计与上线。支持不同业务平台基于统一组件体系进行风格定制，降低重复设计与研发成本。',
      'Seed组件库 & Brickform低代码搭建平台',
      '结合教育资源生产业务特性，与前端团队从 0-1 搭建 Seed 组件库。组件库支持 Web 端搭建后无缝适配 H5 端，提升跨端设计与研发效率。',
      '基于 Seed 组件库，完成教育资源生产系统低代码搭建平台 Brickform 的设计。支持业务方根据不同生产场景快速搭建资源生产系统。',
    ],
    images: componentLibraryGallery,
  },
  'case-delivery': {
    facts: [
      ['项目', '磁极 / Solvelancer'],
      ['角色', 'UX设计师'],
      ['公司', '字节跳动'],
      ['项目类型', '教育资产生产平台'],
      ['端类型', 'Web + Mobile'],
      ['更新时间', '2026'],
    ],
    headline: '" 磁极/solvelancer(众包教育资产生产平台）"',
    copyBlocks: [
      { type: 'sectionTitle', text: '🎰 项目背景', tone: 'muted' },
      {
        type: 'richParagraphs',
        items: [
          [
            { text: '磁极是一个' },
            { text: '全球众包平台', tone: 'yellow' },
            { text: '，使企业及业务方能够将零散的工作外包给分布式劳动力，与用户共创价值。目前可接纳文字、图片、视频等' },
            { text: '教育内容资产的生产', tone: 'yellow' },
            { text: '，产品功能允许多端（web & mobile）配置生产流程，包括生产、质检、仲裁、验收等多个生产节点的自由定制。' },
          ],
          [
            {
              text: '教育资产的积累是非常庞大的工作量；磁极众包的模式使公司及业务方能够利用来自全球自由职业者的集体智慧和技能来进行流水线且标准化业务流程，将耗时的项目分解成更小、更易于管理的微任务，由分散的人力高效、弹性地通过互联网来完成，降低教育资产生产成本。',
            },
          ],
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/02.png', alt: '平台任务广场', aspectRatio: '16 / 9' },
      { type: 'moduleTitle', text: '什么是教育内容资产，在教育业务中会起到什么作用' },
      {
        type: 'paragraphs',
        items: [
          '设想功能场景：用户使用拍搜软件，查找题目时；会出现2个结果：成功搜出题目；未成功搜出题目\n那么精准快速的匹配对应的正确答案得益于我们丰富的题库积累，通过图书采买的方式积累了大量的题目资源，包括题目、答案、解析、点评，并将他们录入到图库中（主动生产）\n\n而未命中的题目则也会通过算法切题，快速投入到生产线中进行补答案；补解析；补视频等流程，以快速的给用户返回正确结果（被动生产）',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/03.png', alt: '平台题目来源', aspectRatio: '16 / 9' },
      {
        type: 'processTable',
        headers: ['', '生产必要流程', '生产必要流程', '生产必要流程'],
        rows: [
          ['1', '资源打包投放', '业务运营（EHI\\EHD\\ENP\\EHIN\\EV）', 'B端后台（PC）'],
          ['2', '分配生产任务', '平台运营、供应商管理员、工会管理员', 'B端后台（PC）'],
          ['3', '磁极平台', '生产员、质检员、仲裁员、抽检员', 'C端平台（PC\\Mobile）'],
          ['4', '实时生产监控', '业务运营、平台运营', 'B端后台（PC）'],
          ['5', '验收入库', '业务运营', 'B端后台（PC）'],
        ],
        highlightRow: 2,
      },
      { type: 'sectionTitle', text: '🕹️ 主要设计动作', tone: 'muted' },
      { type: 'moduleTitle', text: '01 可广泛应用的视觉设计', tocLabel: '01 可广泛应用的视觉设计' },
      {
        type: 'paragraphs',
        items: [
          '考虑平台国际化的定位；国际化产品的视觉语言应该能够尽可能多的服务更广泛的地区，产品的设计语言应该受到不同文化和社会背景的人的认同喜欢，同时要小心规避国家和地区的文化差异和法律风险。',
          '起初是想用人物插图来传达平台的品牌和调性，但插画内容中，\n1.人种（黄白黑种人，在国外人种在图中占的数量比例都要需要注意）、\n2.装扮（如阿拉伯伊朗印度等地区女性角色要有头巾、印度市场锡克教男性要有头巾），\n为了避免这些局限因素和文化风险，我后面优化了风格，用3d的风格作为平台的主要的视觉传达手段，模型的搭建与任务场景一致，形成联动关系，增加视觉上的z轴效果，使平台具有科技、自由、灵活的感觉',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/04.png', alt: '可广泛应用的视觉设计', aspectRatio: '16 / 9' },
      { type: 'moduleTitle', text: '02 打造简洁高效、快速上手页面设计', tocLabel: '02 简洁高效、快速上手' },
      { type: 'subTitle', text: '1.任务页要有明确一致的设计语言，' },
      {
        type: 'paragraphs',
        items: [
          '尽量通过简洁高效的框架结构，保持所有任务页设计结构的一致性，从而降低用户的认知负担，提升工作效率，即便是做不同任务类型或角色时，也能快速上手，完成任务，拿到奖励',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/10.png', alt: '简洁高效、快速上手页面设计', aspectRatio: '1920 / 9497' },
      {
        type: 'paragraphs',
        items: [
          '通过清晰明确的信息结构布局和统一的任务卡操作逻辑、减轻了用户切换任务和角色时的上手难度，提升了工作效率，减轻了视觉负担。也为设计开发能总结规律、抽象通用能力的工作打下基础众包任务卡整理',
          '是否能够高效的完成任务，并获得奖金是平台留住用户并且能保持黏性的根本，但平台任务页常常会充斥着大量繁杂枯燥的信息内容、用户要在平台上做大量需要集中注意的工作，这要求平台要有统一整体的设计语言和规范清晰的视觉层级。',
        ],
      },
      { type: 'subTitle', text: '2.简化复杂操作，增加辅助工具' },
      {
        type: 'paragraphs',
        items: [
          '我们观察和调研了用户完成任务时的操作习惯和步骤，明确了优化方向，通过增加功能和简化步骤的方式来减轻用户负担；提升工作效率',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/11.png', alt: '提效辅助工具', aspectRatio: '1920 / 3041' },
      { type: 'moduleTitle', text: 'Result（取得了那些成果？哪些可量化）', tocLabel: '任务卡设计成效' },
      {
        type: 'paragraphs',
        items: [
          '我们针对任务卡的满意度情况；对146位印度的自由职业者做了调查：有80%的用户满意任务卡的操作流程和页面设计，反馈的词云中频率最高频的正向词汇是“Easy to use”，提效设计使用率高达91%。任务平均超时率从54.9%降低到27.3%',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/12.png', alt: '任务卡设计成效', aspectRatio: '1920 / 1387' },
      { type: 'moduleTitle', text: '02 设计研发全链路提效降本', tocLabel: '02 设计研发提效降本' },
      {
        type: 'paragraphs',
        items: [
          '我们的业务方有：学习灯、大力辅导、Gauthmath、Snapsolve、K12精品题库.......',
          '业务方：设计开发流程长、不能灵活定制的配置不同业务所需的产出。不能快速调整生产策略和定价\n设计开发：尽全力做到快速响应业务而且重复工作特别多。尽管大家已经超负荷工作，但还是不及业务方预期。',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/05.png', alt: '业务方与设计研发诉求', aspectRatio: '16 / 9' },
      {
        type: 'paragraphs',
        items: [
          'Task：\n1.使磁极众包平台可快速响应不同业务的定制生产需求（提效率）\n2.设计研发可低成本快速高质量的完成需求，（降成本）\nAction：设计与研发一起整合资源、尝试抽象通用能力的基础上降低设计研发成本',
        ],
      },
      { type: 'subTitle', text: '1.搭建可web和h5映射的seed组件库' },
      {
        type: 'paragraphs',
        items: [
          '平台需要同时满足web和h5端，所以每一个组件的设计上要能够关联映射，由此推导出的开发方案支持开发一遍代码，就实现多端支持，设计研发不需要再同时维护 2 个端，以提升众包平台整体响应效率',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/06.png', alt: 'Seed 组件库双端映射', aspectRatio: '1920 / 4123' },
      { type: 'subTitle', text: '2.寻找共性：框架式搭建任务卡' },
      {
        type: 'paragraphs',
        items: [
          '第一阶段：针对平台的生产任务卡抽象出基础的小组件，共建seed UI组件库（包括基础组件业务组件）\n第二阶段：由小组件拼装成大的操作区块；如书页预览区、截图操作区、视频生产区等\n第三阶段：开发可将监控埋点、 屏幕适配规则、多语言适配等应用框架进行封装，形成下面几个布局规则',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/07.png', alt: '框架式搭建任务卡', aspectRatio: '1920 / 2993' },
      { type: 'subTitle', text: '3..实现业务方自主自由配置' },
      {
        type: 'paragraphs',
        items: [
          '通过以上2步的铺垫，进一步实现业务方的自主任务卡配置，我们b端搭建brickform可视化的配置系统，操作简单便利，业务方可以根据自己业务的实际情况调整模版；功能模块、生产内容等，上线后平台可以快速灵活响应业务方众口难调、变化莫测的教育内容生产需求。设计和研发之后只需要继续查缺补漏来不断完善设计资源库即可',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/08.png', alt: '业务方自主配置', aspectRatio: '1920 / 3006' },
      { type: 'moduleTitle', text: 'Result（取得了那些成果？哪些可量化）', tocLabel: '平台化搭建成效' },
      {
        type: 'paragraphs',
        items: [
          '通过以上几个行动，我们5个月的时间里完成了5条业务产线、46个生产功能的迁移，帮助业务实现了70w+的产能目标，研发设计提升效率60%以上（基于任务卡上线所耗时间和投入人力与之前相比）',
        ],
      },
      { type: 'image', src: '/assets/magnetic-crowd/09.png', alt: '磁极与 Solvelancer 项目成果汇总', aspectRatio: '1920 / 2646' },
    ],
    images: [],
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
  'ai-skill-design-system': {
    facts: [
      ['项目', '设计系统Skill建设'],
      ['角色', '规范整理+Skill设计'],
      ['公司', '米哈游'],
      ['项目状态', '已上线，优化中'],
      ['迭代周期', 'v1.0 2026.04-2026.05'],
      ['更新时间', '2026'],
    ],
    headline: '" 设计系统Skill建设 "',
    copyBlocks: [
      { type: 'sectionTitle', text: '🎰 项目背景：从“AI 生成 UI”到“AI 生成符合规范的设计稿”', tocLabel: '🎰 从 AI 生成 UI 到规范设计稿', tone: 'muted' },
      {
        type: 'paragraphs',
        items: [
          '随着 AI 逐渐进入设计生产流程，单纯让 AI 生成界面已经不是难点。真正的挑战在于：AI 生成的结果是否符合产品设计规范、是否能复用现有组件、是否能保持团队设计语言一致，并最终具备交付研发的可用性。',
          '在米线平台的设计系统建设中，我参与探索并搭建了 miline-design-system-skill。它的目标不是让 AI 随机生成“看起来差不多”的 UI，而是让 AI 基于米线组件体系、页面规则、样式 Token 和业务场景，生成默认符合设计规范的高保真设计稿。',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: '把AI纳入设计系统的一部分，希望能成为设计生产链路中的节点之一。',
      },
      { type: 'sectionTitle', text: '🎲 核心问题：AI 生成太随机', tocLabel: '🎲 AI 生成结果太随机', tone: 'muted' },
      {
        type: 'paragraphs',
        items: ['在早期探索中，我们发现 AI 直接生成设计稿时，容易出现几个问题：'],
      },
      {
        type: 'orderedPoints',
        items: [
          [
            '只理解表层样式，不理解组件使用场景',
            'AI可以模仿按钮、卡片、表格的外观，但并不一定知道在什么业务场景下应该使用哪种组件状态、哪种布局密度、哪种操作层级；只能通过大量的自然语言，描述非常基础的样式，效率非常低。',
          ],
          [
            '生成结果缺少设计系统约束',
            '如果没有明确的组件规则和页面规范，AI 很容易自由发挥，生成不符合团队规范的样式，导致后续仍然需要设计师大量返工。',
          ],
        ],
      },
      {
        type: 'imagePair',
        className: 'detail-copy-ai-skill-pair',
        columns: '479fr 384fr',
        images: [
          { src: aiSkillFigmaAssets.constraintLight, alt: '米线页面层级规范示意一', aspectRatio: '479 / 193' },
          { src: aiSkillFigmaAssets.constraintDark, alt: '米线页面层级规范示意二', aspectRatio: '384 / 194' },
        ],
      },
      {
        type: 'paragraphs',
        items: [
          '以米线场景为例，页面通过颜色明暗处理来做信息层级的展示，需要严格按照设计规范和标准。缺少约束的话，很难生成符合预期的页面。',
          '全自动化 & 半自动化：考虑中间导出环节还需要人工确认，例如卡面和特效结合效果等，所以采用了核心环节自动化的方式来设计 AE 插件。',
        ],
      },
      { type: 'sectionTitle', text: '🧑‍🎨 设计策略：把设计系统转化为 AI 可执行的 Skill', tocLabel: '🧑‍🎨 设计系统转化为 Skill', tone: 'muted' },
      {
        type: 'richParagraphs',
        items: [
          [
            { text: '我的判断是：设计系统不能只停留在“给人看的规范文档”，还需要进一步转化为 ' },
            { text: '“AI 能理解、能调用、能执行的规则系统”', tone: 'blue' },
            { text: '。' },
          ],
          [{ text: '因此，miline-design-system-skill 的建设重点不是简单描述组件长什么样，而是围绕两个层级展开：' }],
        ],
      },
      { type: 'moduleTitle', text: '01 组件 Skill：解决“什么时候用什么组件”', tocLabel: '01 组件 Skill：组件使用场景' },
      {
        type: 'paragraphs',
        items: [
          '组件 Skill 不只是把组件样式说明转成文字规则，而是要帮助 AI 理解组件背后的使用条件。',
          '什么场景使用主按钮，什么场景使用次按钮\n表格在什么情况下使用紧凑布局，什么情况下需要信息分组\n表单字段过多时如何组织层级\n弹窗、抽屉、页面跳转分别适合什么任务复杂度\n状态标签、风险提示、空状态应该如何表达',
          '组件 Skill 的核心价值，是让 AI 不仅知道“组件是什么”，更知道“组件应该在什么场景下被正确使用”。',
        ],
      },
      {
        type: 'imagePair',
        className: 'detail-copy-ai-skill-pair',
        columns: '350fr 299fr',
        images: [
          { src: aiSkillFigmaAssets.componentSkillA, alt: '组件 Skill 规则示意一', aspectRatio: '350 / 293' },
          { src: aiSkillFigmaAssets.componentSkillB, alt: '组件 Skill 规则示意二', aspectRatio: '299 / 291' },
        ],
      },
      { type: 'moduleTitle', text: '02 设计规范 Skill：解决“页面整体应该如何组织”', tocLabel: '02 设计规范 Skill：页面组织' },
      {
        type: 'paragraphs',
        items: [
          '设计规范 Skill 更偏全局视角，关注页面结构、功能层级、视觉层级和体验一致性。',
          '它需要告诉 AI：\n页面整体布局应该如何组织\n信息区、操作区、反馈区如何划分\n不同页面类型应该采用什么结构\n功能层级与视觉层级如何对应\n哪些设计模式可以复用，哪些样式不能自由创造',
          '这部分的重点，是把设计师的经验判断沉淀成可被 AI 执行的页面设计规则。',
        ],
      },
      {
        type: 'orderedPoints',
        items: [
          ['page-color-hierarchy', '（页面层级）：关注全局页面结构的层次（NavbarBar、Navsidebar、Content 等大区域之间的视觉层级）'],
          ['block-color-hierarchy', '（区块层级，本技能）：关注内容区域内部的容器嵌套关系（表单区、表格区、子面板、编辑区等的嵌套层次）'],
          ['page-layout-design', '关注布局结构和间距（组件尺寸、位置、间距）'],
        ],
      },
      {
        type: 'imagePair',
        className: 'detail-copy-ai-skill-pair',
        columns: '492fr 371fr',
        images: [
          { src: aiSkillFigmaAssets.pageSkillA, alt: '页面层级规则 Skill 示例一', aspectRatio: '492 / 404' },
          { src: aiSkillFigmaAssets.pageSkillB, alt: '页面层级规则 Skill 示例二', aspectRatio: '371 / 360' },
        ],
      },
      {
        type: 'imagePair',
        className: 'detail-copy-ai-skill-pair',
        columns: '493fr 371fr',
        images: [
          { src: aiSkillFigmaAssets.blockSkillA, alt: '区块层级规则 Skill 示例一', aspectRatio: '493 / 360' },
          { src: aiSkillFigmaAssets.blockSkillB, alt: '区块层级规则 Skill 示例二', aspectRatio: '371 / 360' },
        ],
      },
      { type: 'sectionTitle', text: '🔩 协作机制：通过 Git 管理 Skill 的共建与迭代', tocLabel: '🔩 Git 管理 Skill 共建迭代', tone: 'muted' },
      {
        type: 'paragraphs',
        items: [
          'Design System Skill 必然不是一次性产物，而是一个持续更新的团队资产。',
          '因此，我们采用 Git 进行多人协同和版本管理，让 Skill 的更新过程具备可追踪、可评审、可回滚的机制。',
          '这种方式让设计规范的更新不再依赖口头同步或零散文档，而是像代码一样被管理。',
          '每一次组件规则调整、页面模板补充、Token 更新、使用场景修正，都可以通过 Git 记录下来。团队成员可以清楚看到 Skill 的变化原因、修改内容和版本历史。',
        ],
      },
      { type: 'image', src: aiSkillFigmaAssets.gitBanner, alt: 'Git 管理 Skill 共建流程', aspectRatio: '920 / 177' },
      {
        type: 'imagePair',
        className: 'detail-copy-ai-skill-git-pair',
        columns: '202fr 198fr 385fr',
        images: [
          { src: aiSkillFigmaAssets.gitMobileA, alt: 'Skill 规则移动端示例一', aspectRatio: '202 / 535' },
          { src: aiSkillFigmaAssets.gitMobileB, alt: 'Skill 规则移动端示例二', aspectRatio: '198 / 535' },
          { src: aiSkillFigmaAssets.gitRules, alt: 'Skill 规则协作示例', aspectRatio: '385 / 427' },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: '这对设计系统建设非常关键：因为 AI 生成质量依赖规则质量，而规则质量依赖持续维护和团队共建。',
      },
      { type: 'sectionTitle', text: '⚒️ 使用场景：让 AI 进入真实设计生产链路', tocLabel: '⚒️ AI 进入真实设计生产链路', tone: 'muted' },
      {
        type: 'paragraphs',
        items: ['miline-design-system-skill 的价值，不只是服务设计师个人提效，而是覆盖设计、产品、研发和游戏项目组的多角色协作场景。'],
      },
      { type: 'moduleTitle', text: '场景一：设计师前期快速生成高保真方案', tocLabel: '场景一：设计师快速生成方案' },
      {
        type: 'paragraphs',
        items: [
          '在方案讨论早期，设计师可以基于 Skill 快速生成符合米线设计规范的高保真方案，用于内部沟通、方向验证和方案对齐。',
          '过去设计师需要先手动搭建基础结构、寻找组件、调整规范细节；现在 AI 可以先完成一部分结构化搭建工作，设计师把更多精力放在业务判断、信息架构和体验取舍上。',
        ],
      },
      { type: 'image', src: aiSkillFigmaAssets.scenarioDesigner, alt: '设计师快速生成高保真方案示例', aspectRatio: '4096 / 1062' },
      { type: 'moduleTitle', text: '场景二：产品自主生成规范化设计稿', tocLabel: '场景二：产品生成规范设计稿' },
      {
        type: 'paragraphs',
        items: [
          '产品经理在表达需求时，往往需要通过原型或草图说明想法。但传统原型与最终设计稿之间存在较大差距，容易产生理解偏差。',
          '通过 miline-design-system-skill，产品可以基于需求描述生成更接近真实设计规范的页面初稿，帮助产品、设计和研发更快对齐功能形态，减少早期沟通成本。',
        ],
      },
      { type: 'image', src: aiSkillFigmaAssets.scenarioProduct, alt: '产品自主生成规范化设计稿示例', aspectRatio: '1280 / 424' },
      { type: 'moduleTitle', text: '场景三：游戏项目组自主开发小工具并融入米线', tocLabel: '场景三：项目组小工具融入米线' },
      {
        type: 'paragraphs',
        items: [
          '游戏项目组经常会基于自身业务开发小工具，例如数据处理、任务管理、流程辅助或内容生产工具。',
          '如果每个小工具都自由设计，长期会造成体验割裂、维护成本上升。通过 Skill，项目组即使自行生成或开发工具，也能默认遵守米线设计规范，使工具自然融入平台生态。',
          '这让设计系统的价值从“规范约束”进一步升级为“平台级设计基础设施”。',
        ],
      },
      { type: 'image', src: aiSkillFigmaAssets.scenarioGameTeam, alt: '游戏项目组小工具融入米线示例', aspectRatio: '1280 / 722' },
      { type: 'sectionTitle', text: '⚒️ 设计价值：不是使用 AI，而是设计 AI 的工作边界', tocLabel: '⚒️ 设计 AI 的工作边界', tone: 'muted' },
      {
        type: 'paragraphs',
        items: ['在这个项目中，我的价值不只是探索 AI 工具，而是站在设计系统建设者的角度，重新定义 AI 应该如何参与设计流程。'],
      },
      { type: 'moduleTitle', text: '1）把隐性的设计经验显性化', tocLabel: '1）隐性设计经验显性化' },
      {
        type: 'paragraphs',
        items: [
          '很多设计判断过去存在于设计师经验中，例如“这个场景为什么用抽屉而不是弹窗”“为什么这个按钮不能放在主操作区”“为什么这个页面需要先展示数据概览再进入明细”。',
          '通过 Skill 建设，这些经验被转化为明确规则，让 AI、产品和其他设计师都可以复用。',
        ],
      },
      { type: 'moduleTitle', text: '2）把静态规范转化为可执行规则', tocLabel: '2）静态规范转为执行规则' },
      {
        type: 'paragraphs',
        items: [
          '传统设计规范通常是静态文档，更多用于查阅。',
          '而 Skill 的建设目标，是让规范变成 AI 可以理解和执行的生成条件。',
          '这让设计系统从“设计资产”进一步变成“生产力工具”。',
        ],
      },
      { type: 'moduleTitle', text: '3）把 AI 生成从不可控变成可控', tocLabel: '3）AI 生成从不可控到可控' },
      {
        type: 'paragraphs',
        items: [
          'AI 最大的问题不是不会生成，而是生成结果不可预测。',
          '通过组件 Skill、设计规范 Skill 和 Git 协作机制，为 AI 设置了明确边界，让它在统一设计语言、组件体系和页面规则中生成内容。',
          '这使 AI 生成结果更接近真实项目要求，也降低了后续设计修正和研发沟通成本。',
        ],
      },
      { type: 'sectionTitle', text: '🤯 阶段性边界：AI Skill 当前更适合规范化生成，而不是完整产品迭代', tocLabel: '🤯 Skill 更适合规范化生成', tone: 'muted' },
      {
        type: 'paragraphs',
        items: [
          '在 miline-design-system-skill 的探索过程中，我也意识到这套工作流存在明确的阶段性边界。',
          '它的价值并不是让 AI 直接替代设计师完成完整产品设计，也不能真正成为产品版本迭代中的正式设计环节。',
          '当前这套方法更适合解决的是：在组件使用、基础样式、页面布局和设计规范层面，对 AI 生成结果进行约束，让输出结果在视觉语言和组件体系上更接近米线平台规范。',
          '它能让 AI 生成结果从“完全不可控”变成“基础规范可控”，但还不能让 AI 稳定产出可以直接进入真实版本迭代的复杂业务方案。',
        ],
      },
      { type: 'moduleTitle', text: '1）当前只能控制“基础样式”，不能完整控制“复杂业务逻辑”', tocLabel: '1）基础样式可控，业务逻辑有限' },
      {
        type: 'paragraphs',
        items: [
          'miline-design-system-skill 可以有效约束 AI 使用正确的组件、Token、布局方式和基础视觉层级。',
          '例如按钮层级、表格样式、表单组织、弹窗结构、页面间距、颜色使用等基础规范，可以通过 Skill 得到一定程度的控制。但对于复杂业务页面来说，仅仅符合组件规范是不够的。',
          '真实产品页面往往存在大量业务耦合关系，例如：页面与上下游流程的关系、不同角色的权限差异、多状态之间的流转逻辑、数据字段之间的依赖关系、操作前后的反馈链路、异常情况与边界状态。',
          '这些内容很难只靠组件 Skill 和设计规范 Skill 完整覆盖。因此，当前 Skill 更像是帮助 AI 生成一个“规范化的界面起点”，而不是直接生成一个完整、严谨、可上线的产品设计方案。',
        ],
      },
      { type: 'moduleTitle', text: '2）对高耦合页面的生产力有限，更多是“参考”和“启发”', tocLabel: '2）高耦合页面更多是参考' },
      {
        type: 'paragraphs',
        items: [
          '对于结构简单、业务逻辑相对独立的页面，AI Skill 可以提供明显帮助。例如简单配置页、工具页、表单页、基础列表页、轻量数据页面等，AI 可以快速生成一个符合设计系统的初稿。',
          '但对于耦合度很高的复杂页面，它的效果会明显下降。例如工作流配置、任务流转、权限管理、数据分发、复杂审批、跨角色协作等页面，设计难点并不在于“页面长什么样”，而在于业务规则如何被表达、用户操作路径是否合理、不同角色之间如何协同、状态变化是否完整、异常情况是否被覆盖、信息优先级是否符合真实使用场景、页面是否能支撑长期版本演进。',
          '这些判断需要设计师基于业务上下文进行推理，而 AI 在缺少完整上下文的情况下，很难生成真正有产品思考的方案。因此，在复杂页面中，AI 生成结果更适合作为讨论材料、灵感参考或方案发散，而不能直接作为最终设计稿进入交付。',
        ],
      },
      { type: 'moduleTitle', text: '3）缺少完整上下文时，AI 只能生成“单点功能”，无法生成“系统方案”', tocLabel: '3）缺少上下文只能生成单点功能' },
      {
        type: 'paragraphs',
        items: [
          '当前工作流还有一个关键限制：AI 生成通常是围绕单个页面或单个功能展开的。',
          '它可以根据输入生成一个页面结构，也可以根据组件规则生成一个相对规范的界面。但如果没有完整的产品上下文，它很难判断这个页面在整个系统中的位置。',
          '例如它不一定知道：这个功能从哪里进入、用户完成任务前后分别发生什么、当前页面和其他模块之间有什么数据关系、哪些字段来自上游，哪些操作影响下游、当前功能在整个协作流程中承担什么角色、这个页面是否会影响其他角色的工作方式。',
          '缺少这些上下文时，AI 生成的内容往往是“局部正确”的，但未必是“系统正确”的。这也是为什么当前方法不能简单理解为完整设计自动化。',
          '它更适合承担局部页面生成、方案表达、样式统一和初期讨论辅助，而不是替代设计师完成完整的产品逻辑推导。',
        ],
      },
    ],
    images: [],
  },
  'ai-design-context': {
    facts: [
      ['项目', 'AI通过Design Context理解功能逻辑'],
      ['角色', '需求整理+Design Context设计'],
      ['公司', '米哈游'],
      ['项目状态', '已上线，优化中'],
      ['迭代周期', 'v1.0 2026.05-2026.07'],
      ['更新时间', '2026'],
    ],
    headline: '"AI x Design Context理解功能逻辑生成设计"',
    copyBlocks: [
      { type: 'sectionTitle', text: '🎰 核心目标', tone: 'muted' },
      {
        type: 'callout',
        tone: 'blue',
        icon: '💡',
        text: '构建设计侧上下文与规则体系，使 AI 能基于 PRD 稳定生成符合现有产品逻辑与设计规范的 Figma 页面',
      },
      { type: 'sectionTitle', text: '🖇️ 目标链路', tone: 'muted' },
      {
        type: 'paragraphs',
        items: ['功能模块A梳理：1.0PRD + 1.0 Design→ Design Context'],
      },
      { type: 'image', src: aiDesignContextFigmaAssets.targetChain, alt: '功能模块 Design Context 梳理链路', aspectRatio: '2334 / 686' },
      {
        type: 'richParagraphs',
        items: [
          [
            { text: '功能模块A迭代：1.0 Design Context →' },
            { text: '2.0PRD + 2.0 Design → Done→2.0 Design Context', tone: 'blue' },
          ],
        ],
      },
      { type: 'image', src: aiDesignContextFigmaAssets.iterationChain, alt: '功能模块 Design Context 迭代链路', aspectRatio: '3238 / 716' },
      { type: 'sectionTitle', text: '🧠 逻辑梳理', tone: 'muted' },
      { type: 'image', src: aiDesignContextFigmaAssets.logicMap, alt: 'Design Context 与 Design Skill 逻辑关系', aspectRatio: '2376 / 532' },
      { type: 'moduleTitle', text: '明确两个概念' },
      {
        type: 'richParagraphs',
        className: 'detail-copy-concept-list',
        items: [
          [
            { text: 'Design Context：' },
            { text: '继承能力', tone: 'blue' },
          ],
          [{ text: '提供功能区块级别上下文参考，保证任何功能的生成不是从0开始，有页面复用可调起复用' }],
          [{ text: '面向功能模块的设计上下文输入，提供该模块的最新页面样式、结构模式、交互链路、业务语义与版本继承关系，使 AI 的生成建立在现有产品基础上，而不是从零开始）' }],
          [
            { text: 'Design Skill：' },
            { text: '约束能力', tone: 'yellow' },
          ],
          [{ text: '提供底层样式的规范，保证页面一致性，在没有参考和复用页面的场景下，也能生成符合标准的设计页面' }],
          [{ text: '面向页面生成的设计规则能力，提供基础样式、组件约束、页面模板与状态规则，确保 AI 生成结果在结构、样式和交互上符合设计系统要求' }],
        ],
      },
      { type: 'subTitle', text: 'Design Context建设路径' },
      {
        type: 'paragraphs',
        items: ['在 skills/miline-figma/references/ 下新增 contexts/ 目录，按功能模块维护：'],
      },
      { type: 'image', src: aiDesignContextFigmaAssets.contextPath, alt: 'Design Context 文件目录结构', aspectRatio: '920 / 205' },
      {
        type: 'paragraphs',
        items: [
          '每个 Context 文件遵循固定 Schema（基于已有的 design-context-temple.md 扩展）：',
          '数据来源：可以通过 miline-figma 的 design-context 命令从 Figma 自动提取结构部分，人工补充业务语义和设计决策记录。',
        ],
      },
      { type: 'image', src: aiDesignContextFigmaAssets.contextSchema, alt: 'Design Context Schema 示例', aspectRatio: '916 / 685' },
      { type: 'subTitle', text: 'Design Skill 控制基础样式' },
      {
        type: 'paragraphs',
        items: ['不需要新建 Skill，而是在现有 miline-design-system-skill 的 patterns 层补充正向生成决策树。'],
      },
      { type: 'image', src: aiDesignContextFigmaAssets.skillPattern, alt: 'Design Skill patterns 层结构', aspectRatio: '920 / 182' },
      { type: 'paragraphs', items: ['generation-routing.md核心内容是一棵决策树：'] },
      { type: 'image', src: aiDesignContextFigmaAssets.routingTree, alt: 'generation-routing 决策树', aspectRatio: '920 / 261' },
      { type: 'paragraphs', items: ['端到端生成链路'] },
      { type: 'image', src: aiDesignContextFigmaAssets.endToEnd, alt: '端到端生成链路', aspectRatio: '920 / 422' },
      { type: 'sectionTitle', text: '🤹🏻 上手试试行不行', tone: 'muted' },
      { type: 'moduleTitle', text: '简单低复杂需求' },
      {
        type: 'richParagraphs',
        items: [[{ text: '→模块独立，页面简单、逻辑清晰、prd简单、历史背景少', tone: 'blue' }]],
      },
      { type: 'image', src: aiDesignContextFigmaAssets.simpleCase, alt: '简单低复杂需求示例', aspectRatio: '1280 / 441' },
      { type: 'minorTitle', text: '1.整理样式+功能逻辑' },
      {
        type: 'paragraphs',
        items: [
          '由于这个功能本身，在3.10版本内做为支持性功能而上马的，所以在整理功能时，我把产品功能逻辑和设计样式放在一起展示，希望可以增加AI读取Figma MCP时的准确性',
          '该内容以 miline-design-context 文件的形式存在，后续所有功能的上下文都可以存在这个结构下',
        ],
      },
      { type: 'markdownPanel', src: '/assets/version-overview01.md', title: 'Version Overview Module' },
      {
        type: 'richParagraphs',
        items: [
          [{ text: '优点：内容是可控的，可修改和维护的，所有不符合产品设计预期的都能控制', tone: 'green' }],
          [{ text: '缺点 ：整理成本高，米线历史内容太多太复杂时间周期长', tone: 'yellow' }],
        ],
      },
      { type: 'minorTitle', text: '2.新增需求+Design Context' },
      {
        type: 'paragraphs',
        items: ['一句话需求：在版本总览内增加全局搜索，可以通过关键字检索到所有版本内容'],
      },
      {
        type: 'callout',
        tone: 'blue',
        icon: '🤔',
        text: '这种功能简单的需求，我的目标预期流程是：产品直接对话/简单PRD-AI参考Design Context-直接生成内容-交付',
      },
      { type: 'paragraphs', items: ['那么带着这个目标，评估下Ai直出的表现'] },
      {
        type: 'imagePair',
        className: 'detail-copy-design-context-pair',
        columns: '438fr 315fr',
        images: [
          { src: aiDesignContextFigmaAssets.simpleResultA, alt: '简单需求 AI 生成结果一', aspectRatio: '438 / 370' },
          { src: aiDesignContextFigmaAssets.simpleResultB, alt: '简单需求 AI 生成结果二', aspectRatio: '315 / 413' },
        ],
      },
      { type: 'minorTitle', text: '3.效果评估' },
      {
        type: 'callout',
        tone: 'blue',
        icon: '🤔',
        text: '页面还原度  整体还原度70%',
      },
      { type: 'image', src: aiDesignContextFigmaAssets.simpleScore, alt: '简单需求页面还原度评估', aspectRatio: '920 / 207' },
      {
        type: 'imagePair',
        className: 'detail-copy-design-context-pair',
        columns: '438fr 418fr',
        images: [
          { src: aiDesignContextFigmaAssets.simpleResultA, alt: '简单需求原始参考', aspectRatio: '438 / 370' },
          { src: aiDesignContextFigmaAssets.simpleResultC, alt: '简单需求 AI 还原结果', aspectRatio: '418 / 371' },
        ],
      },
      { type: 'moduleTitle', text: '中等复杂需求' },
      {
        type: 'callout',
        tone: 'blue',
        icon: '🤔',
        text: '填入1.0功能PRD(历史)+1.0功能 Figma,生成该功能区块的Design Context。全部可控\n用_context-template 控制Design Context 内容',
      },
      {
        type: 'imagePanelPair',
        className: 'detail-copy-design-context-pair',
        columns: '236fr 654fr',
        image: { src: aiDesignContextFigmaAssets.mediumReference, alt: '中等复杂需求参考页面', aspectRatio: '236 / 382' },
        panelMarkdown: { src: '/assets/design-context-template.md', title: 'Design Context Template' },
      },
      { type: 'minorTitle', text: '1.功能prd输入<1.0人员自动流转>+功能设计稿 → 历史逻辑输入' },
      { type: 'minorTitle', text: '2.[Design Context: 该模块的 context.md] → 继承现有结构、样式、交互链路' },
      { type: 'markdownPanel', src: '/assets/personnel-auto-transfer-context.md', title: 'Personnel Auto Transfer Context' },
      { type: 'minorTitle', text: '3.[Design Skill: patterns/*.md + components/*.md+Token/*.md ] → 按规范约束执行裁决' },
      { type: 'minorTitle', text: '4.投喂新版本prd<2.0人员自动流转>生成可交互预览页面' },
      {
        type: 'orderedPoints',
        items: [
          ['基础样式“Design Skill”控制', '样式、颜色层级、结构基本正确，button select未使用组件'],
          ['规范命中', 'Skills内明确规范过的Dialog\\层级规范\\层级颜色规范等正确'],
          ['设计结果', '新生成的内容的设计合理，样式符合PRD和设计交付要求'],
        ],
      },
      {
        type: 'imagePair',
        className: 'detail-copy-design-context-pair',
        columns: '453fr 411fr',
        images: [
          { src: aiDesignContextFigmaAssets.mediumCompareA, alt: '中等复杂需求生成对比一', aspectRatio: '453 / 374' },
          { src: aiDesignContextFigmaAssets.mediumCompareB, alt: '中等复杂需求生成对比二', aspectRatio: '411 / 374' },
        ],
      },
      { type: 'paragraphs', items: ['2.0 和 1.0 设计对比，新功能增加“内包”自定权限配置'] },
      {
        type: 'imagePair',
        className: 'detail-copy-design-context-pair',
        columns: '332fr 532fr',
        images: [
          { src: aiDesignContextFigmaAssets.mediumCompareC, alt: '中等复杂需求 2.0 对比一', aspectRatio: '332 / 398' },
          { src: aiDesignContextFigmaAssets.mediumCompareD, alt: '中等复杂需求 2.0 对比二', aspectRatio: '532 / 317' },
        ],
      },
      {
        type: 'callout',
        tone: 'blue',
        icon: '🤔',
        text: '可以应用于中等复杂的功能模块，方法可行可推进',
      },
      { type: 'moduleTitle', text: '特别复杂需求' },
      {
        type: 'callout',
        tone: 'warning',
        icon: '🤔',
        text: '3.2.4集中对审阅需求模块进行功能优化，所以尝试Design Context方法完成需求\n审阅功能属于巨大复杂功能模块，竞品如“分秒帧”“RV”都是作为独立产品存在',
      },
      {
        type: 'richParagraphs',
        items: [
          [
            { text: '审阅功能本身就包含超级长上下文，' },
            { text: '产品PRD逻辑+设计交互逻辑', tone: 'yellow' },
            { text: '直接会顶爆Design Context，过程中尝试拆分审阅功能：审阅播放器、工具栏、对比模式、聚焦模式。还是不行，AI经常幻觉失忆，稍微复杂一点的功能需求生成的figma惨不忍睹。（或许可能拆的更细一点的Design Context能解决，整理成本非常高）' },
          ],
          [{ text: '而类似“审阅”这种大型复杂功能模块，米线至少有10个以上，他们之间互相咬合功能嵌套会导致Design Context成本很大，所以目前评估这套流程卡在了如何合理的方式让Ai理解我们米线功能的上下文这个点上' }],
        ],
      },
      { type: 'minorTitle', text: '2.[Design Context: 该模块的 context.md] → 继承现有结构、样式、交互链路' },
      { type: 'image', src: aiDesignContextFigmaAssets.complexReviewA, alt: '复杂审阅需求 Design Context 生成结果一', aspectRatio: '1280 / 745' },
      { type: 'image', src: aiDesignContextFigmaAssets.complexReviewB, alt: '复杂审阅需求 Design Context 生成结果二', aspectRatio: '1280 / 301' },
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
  { label: '核心项目', href: '/#works', sectionId: 'works' },
  { label: 'AI', href: '/#ai-exploration', sectionId: 'ai-exploration' },
  { label: '信息', href: '/#about', sectionId: 'about' },
  { label: '履历', href: '/#resume', sectionId: 'resume' },
  { label: '灵感', href: '/#inspiration', sectionId: 'inspiration' },
  { label: '联系', href: '/#contact', sectionId: 'contact' },
];
const heroTitle = 'UX & Motion Designer';
const themeStorageKey = 'icezhou-portfolio-theme';
const scrollStoragePrefix = 'icezhou-portfolio-scroll:';

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

const getRouteScrollKey = (route) => `${scrollStoragePrefix}${getRouteUrl(route)}`;

const getSavedRouteScroll = (route) => {
  const saved = window.sessionStorage.getItem(getRouteScrollKey(route));
  const value = saved === null ? Number.NaN : Number.parseFloat(saved);
  return Number.isFinite(value) ? value : null;
};

const saveRouteScroll = (route, scrollY = window.scrollY) => {
  window.sessionStorage.setItem(getRouteScrollKey(route), String(Math.max(0, Math.round(scrollY))));
};

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <Tag className={`parallax-frame ${className}`}>
      <motion.img
        className={mergeClassNames('image-placeholder', isLoaded && 'is-loaded', imageClassName)}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(false)}
        whileHover={hover ? { scale: 1.035 } : undefined}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </Tag>
  );
}

function HeroCover() {
  return (
    <figure className="hero-media hero-media-static">
      <iframe
        className="spline-cover"
        src={heroSplineScene}
        title="Interactive cubes Spline animation"
        allow="autoplay; fullscreen"
        loading="eager"
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
        <PlaceholderImage
          className="hero-title-image hero-title-image-dark"
          src="/assets/hero-title-container.png"
          alt=""
          fetchPriority="high"
        />
        <PlaceholderImage
          className="hero-title-image hero-title-image-light"
          src="/assets/hero-title-container.png"
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

function useActiveNavSection(routePath) {
  const [activeSection, setActiveSection] = useState(navItems[0].sectionId);

  useEffect(() => {
    if (routePath !== '/') {
      if (routePath.startsWith('/works/')) {
        const detailSlug = routePath.split('/').filter(Boolean).at(-1);
        const isAiDetail = efficiencyShowcase.practices.some((item) => item.slug === detailSlug);
        setActiveSection(isAiDetail ? 'ai-exploration' : 'works');
      } else {
        setActiveSection(null);
      }
      return undefined;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;
      const sections = navItems
        .map((item) => ({
          id: item.sectionId,
          element: document.getElementById(item.sectionId),
        }))
        .filter((item) => item.element);

      if (sections.length === 0) {
        setActiveSection(navItems[0].sectionId);
        return;
      }

      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;

      if (viewportBottom >= documentHeight - 8) {
        setActiveSection('contact');
        return;
      }

      const probeY = window.scrollY + Math.min(360, window.innerHeight * 0.36);
      const current = sections.reduce((active, section) => {
        return section.element.offsetTop <= probeY ? section.id : active;
      }, sections[0].id);

      setActiveSection((previous) => (previous === current ? previous : current));
    };

    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
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

  return activeSection;
}

function Header({ routePath = window.location.pathname, theme, onToggleTheme, hideForAi = false, homeHref = '/' }) {
  const [open, setOpen] = useState(false);
  const [pastFirstScreen, setPastFirstScreen] = useState(false);
  const activeSection = useActiveNavSection(routePath);
  const showNavAvatar = pastFirstScreen;
  const isDark = theme === 'dark';
  const isOverAi = routePath === '/' && activeSection === 'ai-exploration';

  useEffect(() => {
    if (hideForAi) {
      setOpen(false);
    }
  }, [hideForAi]);

  useEffect(() => {
    if (routePath !== '/') {
      setPastFirstScreen(false);
      return undefined;
    }

    let frameId = 0;
    const updateHeaderState = () => {
      frameId = 0;
      const threshold = Math.max(560, window.innerHeight - 80);
      setPastFirstScreen(window.scrollY >= threshold);
    };
    const requestUpdate = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateHeaderState);
    };

    updateHeaderState();
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

  return (
    <header
      className={`site-header${hideForAi ? ' is-hidden-over-ai' : ''}${pastFirstScreen ? ' is-past-first-screen' : ''}${
        isOverAi ? ' is-over-ai' : ''
      }`}
    >
      <a className={`nav-brand${showNavAvatar ? ' has-avatar' : ''}`} href={homeHref} aria-label="周塞寒 home">
        <span className={`nav-avatar-link${showNavAvatar ? ' is-visible' : ''}`} aria-hidden="true">
          <PlaceholderImage
            src={remote.navAvatar}
            alt=""
            onError={(event) => {
              if (event.currentTarget.src.includes('site-favicon.jpg')) return;
              event.currentTarget.src = remote.favicon;
            }}
          />
        </span>
        <span className="nav-brand-copy">
          <span className="nav-name">周塞寒</span>
          <small>UX Motion Design</small>
        </span>
      </a>
      <div className="nav-actions">
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              className={activeSection === item.sectionId ? 'is-active' : undefined}
              key={item.label}
              href={item.href}
            >
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
        <a href={homeHref} onClick={() => setOpen(false)}>
          周塞寒
        </a>
        {navItems.map((item) => (
          <a
            className={activeSection === item.sectionId ? 'is-active' : undefined}
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
          >
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
            9年工作经验，全栈设计能力，包括UX、动画、3D、品牌
            <br />
            整合设计思维和产品思维，积极探索人与AI系统的协作方式和创新
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
                  核心项目
                  <br />
                  效率研发工具-UX设计
                </h3>
              </div>
              <a href={resumePdf.url} download={resumePdf.filename} className="approach-link">
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
      id={`work-card-${item.slug}`}
      className={`work-approach-card work-card-${item.slug}`}
      href={`/works/${item.slug}`}
      aria-label={item.title}
    >
      <figure>
        {item.video ? (
          <LazyVideo
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
          <PlaceholderImage
            className={item.imageClassName || undefined}
            src={item.image}
            alt=""
            loading={index > 1 ? 'lazy' : 'eager'}
          />
        )}
      </figure>
      <div className="work-approach-copy">
        <span>{item.number}</span>
        <h4 className={item.titleParts ? 'work-approach-title-parts' : undefined}>
          {item.titleParts ? item.titleParts.map((part) => <span key={part}>{part}</span>) : item.title}
        </h4>
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
      const coverPad = readPxVar('--cover-pad', 24);
      const pageMax = readPxVar('--page-max', 1300);
      const targetW = Math.min(viewportW - coverPad * 2, pageMax - coverPad * 2);
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
            <a
              href={resumePdf.url}
              download={resumePdf.filename}
              className="approach-link ai-exploration-link"
            >
              <span>下载PDF版本</span>
              <ArrowUpRight size={30} strokeWidth={2.2} />
            </a>
          </div>
          <figure className="ai-video-shrink-frame" ref={frameRef}>
            <LazyVideo
              src={efficiencyShowcase.heroVideo}
              poster={efficiencyShowcase.heroPoster}
              aria-label="AI Exploration 视觉展示"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </figure>
        </div>
      </div>
      <div className="ai-video-shrink-content" ref={contentRef}>
        <div className="ai-practice-list" aria-label="AI 实践列表">
          {efficiencyShowcase.practices.map((item, index) => (
            <a
              id={`ai-card-${item.slug}`}
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
              <PlaceholderImage src={item.image} alt={item.alt} loading="lazy" />
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
        <PlaceholderImage src="/assets/profile-photo-figma.png" alt="周塞寒头像" loading="lazy" />
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

function LifeLinkSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeShowcase, setActiveShowcase] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [trackOffset, setTrackOffset] = useState(0);
  const lifeTrackRef = useRef(null);

  const updateLifeTrackOffset = () => {
    const track = lifeTrackRef.current;
    const range = getLifeTabShowcaseRange(activeTab);
    const activeTrackIndex = Math.max(0, Math.min(range.length - 1, activeShowcase - range.start));
    const activeCard = track?.children?.[activeTrackIndex];
    if (!track || !activeCard) return;

    const computedStyle = window.getComputedStyle(track);
    const inset = Number.parseFloat(computedStyle.getPropertyValue('--life-track-inset')) || 0;
    setTrackOffset(inset - activeCard.offsetLeft);
  };

  useEffect(() => {
    if (isAutoPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveShowcase((index) => {
        const nextIndex = (index + 1) % lifeLinkShowcases.length;
        setActiveTab(getLifeTabIndexForShowcase(nextIndex));
        return nextIndex;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isAutoPaused]);

  useLayoutEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateLifeTrackOffset);
    window.addEventListener('resize', updateLifeTrackOffset);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', updateLifeTrackOffset);
    };
  }, [activeShowcase, activeTab]);

  const handleShowcaseStep = (direction) => {
    setIsAutoPaused(true);
    setActiveShowcase((index) => {
      const range = getLifeTabShowcaseRange(activeTab);
      const relativeIndex = index < range.start || index >= range.end ? 0 : index - range.start;
      const nextIndex = range.start + ((relativeIndex + direction + range.length) % range.length);
      return nextIndex;
    });
  };

  const activeTabInfo = lifeLinkTabs[activeTab];
  const activeTabRange = getLifeTabShowcaseRange(activeTab);
  const activeGroupShowcases = lifeLinkShowcases.slice(activeTabRange.start, activeTabRange.end);
  const visibleShowcases = activeGroupShowcases.length > 0
    ? [...activeGroupShowcases, { ...activeGroupShowcases[0], isClone: true }]
    : [];
  const activeTabProgressIndex = Math.max(
    0,
    Math.min(activeTabRange.length - 1, activeShowcase - activeTabRange.start),
  );

  const handleTabSelect = (index) => {
    setIsAutoPaused(true);
    setActiveTab(index);
    setActiveShowcase(lifeLinkTabs[index].showcaseIndex);
  };

  return (
    <MotionSection className="life-link-section" id="inspiration" aria-label="Life Links">
      <Reveal className="life-link-inner">
        <div className="life-link-tabs" aria-label="生活方式标签">
          <div className="life-link-tab-grid">
            {lifeLinkTabs.map((tab, index) => (
              <button
                className={`life-link-tab${index === activeTab ? ' is-active' : ''}${
                  index === activeTab && !isAutoPaused ? ' is-auto-progress' : ''
                }`}
                key={tab.items.map((item) => item.label).join('-')}
                onClick={() => handleTabSelect(index)}
                type="button"
              >
                {tab.items.map((item, itemIndex) => (
                  <React.Fragment key={item.label}>
                    <span className="life-link-tab-item" style={{ '--life-progress-order': itemIndex }}>
                      <span className="life-link-tab-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="life-link-tab-label">{item.label}</span>
                    </span>
                    {itemIndex < tab.items.length - 1 ? (
                      <span
                        className="life-link-tab-separator"
                        aria-hidden="true"
                        style={{ '--life-progress-order': itemIndex + 0.5 }}
                      >
                        ·
                      </span>
                    ) : null}
                  </React.Fragment>
                ))}
              </button>
            ))}
          </div>
          <p>永远保持对世界的好奇心；努力工作也要好好生活</p>
        </div>

        <div className="life-link-gallery">
          <div className="life-link-stage" aria-live="polite">
            <div
              className="life-link-track"
              ref={lifeTrackRef}
              style={{ '--life-offset': `${trackOffset}px` }}
            >
              {visibleShowcases.map((showcase, index) => (
                <figure
                  className="life-link-image-card"
                  key={`${showcase.label}-${showcase.isClone ? 'clone' : index}`}
                  aria-hidden={showcase.isClone ? 'true' : undefined}
                >
                  <PlaceholderImage
                    src={showcase.main}
                    alt={showcase.alt}
                    style={{ objectPosition: showcase.mainPosition }}
                    loading="lazy"
                    onLoad={updateLifeTrackOffset}
                  />
                </figure>
              ))}
            </div>
          </div>
          <div className="life-link-controls" aria-label="切换生活图片">
            <button aria-label="上一张图片" onClick={() => handleShowcaseStep(-1)} type="button">
              <ArrowLeft size={18} strokeWidth={1.8} />
            </button>
            <span aria-live="polite">
              {String(activeTabProgressIndex + 1).padStart(2, '0')} / {String(activeTabRange.length).padStart(2, '0')}
            </span>
            <button aria-label="下一张图片" onClick={() => handleShowcaseStep(1)} type="button">
              <ArrowRight size={18} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </Reveal>
    </MotionSection>
  );
}

function Footer() {
  const footerRef = useRef(null);
  const footerVideoRef = useRef(null);
  const footerFlipTrackRef = useRef(null);
  const footerCopyTooltipTimerRef = useRef(null);
  const [footerCopyTooltipVisible, setFooterCopyTooltipVisible] = useState(false);
  const [footerInfoHoverable, setFooterInfoHoverable] = useState(false);
  const footerCopyValues = ['“Me”', '13942083539', 'zhousaihanwork@gmail', '“Me”'];

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

  useEffect(() => () => {
    if (footerCopyTooltipTimerRef.current) {
      window.clearTimeout(footerCopyTooltipTimerRef.current);
    }
  }, []);

  const isCopyableFooterInfo = (value) => !/[“”]/.test(value);

  const getVisibleFooterInfo = () => {
    const track = footerFlipTrackRef.current;
    if (!track) return footerCopyValues[0];

    const transform = window.getComputedStyle(track).transform;
    if (!transform || transform === 'none') return footerCopyValues[0];

    try {
      const matrix = new DOMMatrixReadOnly(transform);
      const index = Math.max(0, Math.min(footerCopyValues.length - 1, Math.round(Math.abs(matrix.m42) / 74)));
      return footerCopyValues[index] || footerCopyValues[0];
    } catch {
      return footerCopyValues[0];
    }
  };

  const handleFooterInfoPointerEnter = () => {
    setFooterInfoHoverable(isCopyableFooterInfo(getVisibleFooterInfo()));
  };

  const handleFooterInfoPointerLeave = () => {
    setFooterInfoHoverable(false);
  };

  const handleFooterInfoCopy = async () => {
    const value = getVisibleFooterInfo();
    if (!isCopyableFooterInfo(value)) return;

    const cleanValue = value.replace(/[“”]/g, '');

    try {
      await navigator.clipboard.writeText(cleanValue);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = cleanValue;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }

    setFooterCopyTooltipVisible(true);
    if (footerCopyTooltipTimerRef.current) {
      window.clearTimeout(footerCopyTooltipTimerRef.current);
    }
    footerCopyTooltipTimerRef.current = window.setTimeout(() => setFooterCopyTooltipVisible(false), 1200);
  };

  const handleFooterVideoTimeUpdate = (event) => {
    const video = event.currentTarget;
    if (!Number.isFinite(video.duration) || video.duration < 1) return;

    if (video.currentTime >= video.duration - 0.35) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

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
            <LazyVideo
              ref={footerVideoRef}
              aria-label="Ice Zhou contact video"
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/goodbye-strip.png"
              preload="metadata"
              src="/assets/footer-contact-video.mov?v=20260708"
              onTimeUpdate={handleFooterVideoTimeUpdate}
              onPointerEnter={() => footerVideoRef.current?.play().catch(() => {})}
            />
          </figure>
          <a className="goodbye-arrow" href="#" aria-label="Back to top">
            <span aria-hidden="true" />
          </a>
          <button
            className={`goodbye-block goodbye-block-me${footerInfoHoverable ? ' is-contact-hover' : ''}${
              footerCopyTooltipVisible ? ' is-tooltip-visible' : ''
            }`}
            type="button"
            aria-label="复制当前联系方式"
            onPointerEnter={handleFooterInfoPointerEnter}
            onPointerLeave={handleFooterInfoPointerLeave}
            onFocus={handleFooterInfoPointerEnter}
            onBlur={handleFooterInfoPointerLeave}
            onClick={handleFooterInfoCopy}
          >
            <span className="goodbye-flip-viewport">
              <span className="goodbye-flip-track" aria-hidden="true" ref={footerFlipTrackRef}>
                <span>“Me”</span>
                <span className="goodbye-contact-value">
                  <span className="goodbye-contact-text">13942083539</span>
                </span>
                <span className="goodbye-contact-value">
                  <span className="goodbye-contact-text">zhousaihanwork@gmail</span>
                </span>
                <span>“Me”</span>
              </span>
            </span>
            <span className="goodbye-copy-tooltip" role="status" aria-live="polite">
              复制成功
            </span>
          </button>
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
        <LifeLinkSection />
      </main>
      <Footer />
    </>
  );
}

function MarkdownPanel({ src, title }) {
  const [content, setContent] = useState('加载中...');

  useEffect(() => {
    let isActive = true;

    fetch(src)
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error('无法读取文档'))))
      .then((text) => {
        if (isActive) setContent(text);
      })
      .catch(() => {
        if (isActive) setContent('文档加载失败，请检查资源路径。');
      });

    return () => {
      isActive = false;
    };
  }, [src]);

  return (
    <div className="detail-copy-panel detail-copy-markdown-panel">
      <div className="detail-copy-markdown-panel-head">{title}</div>
      <pre>{content}</pre>
    </div>
  );
}

function renderDetailCopyBlock(block, index, mediaPreview = {}) {
  const key = `${block.type}-${index}`;
  const headingId = getDetailHeadingId(block, index);
  const openMediaPreview = mediaPreview.openMediaPreview || (() => {});
  const setDetailCursor = mediaPreview.setDetailCursor;
  const mediaHoverProps = setDetailCursor
    ? {
        onPointerMove: (event) => setDetailCursor({ x: event.clientX, y: event.clientY, active: true }),
        onPointerEnter: (event) => setDetailCursor({ x: event.clientX, y: event.clientY, active: true }),
        onPointerLeave: () => setDetailCursor((cursor) => ({ ...cursor, active: false })),
      }
    : {};

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
        <span aria-hidden="true">{block.icon || '💡'}</span>
        <span>{block.text}</span>
      </p>
    );
  }

  if (block.type === 'panel') {
    return (
      <div className={`detail-copy-panel ${block.className || ''}`} key={key}>
        {block.text}
      </div>
    );
  }

  if (block.type === 'markdownPanel') {
    return <MarkdownPanel key={key} src={block.src} title={block.title} />;
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
                {...mediaHoverProps}
                aria-label={`放大预览：${image.alt || '图片'}`}
              >
                <PlaceholderImage src={image.src} alt={image.alt || ''} loading="lazy" />
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
          {...mediaHoverProps}
          aria-label={`放大预览：${block.alt || '图片'}`}
        >
          <PlaceholderImage src={block.src} alt={block.alt || ''} loading="lazy" />
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
              {...mediaHoverProps}
              aria-label={`放大预览：${image.alt || '图片'}`}
            >
              <PlaceholderImage
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

  if (block.type === 'imagePanelPair') {
    return (
      <div
        className={`detail-copy-image-panel-pair ${block.className || ''}`}
        key={key}
        style={block.columns ? { gridTemplateColumns: block.columns } : undefined}
      >
        <figure
          className="detail-copy-figure"
          style={block.image.aspectRatio ? { aspectRatio: block.image.aspectRatio } : undefined}
        >
          <button
            className="detail-copy-media-button"
            type="button"
            onClick={() => openMediaPreview(block.image.src)}
            {...mediaHoverProps}
            aria-label={`放大预览：${block.image.alt || '图片'}`}
          >
            <PlaceholderImage src={block.image.src} alt={block.image.alt || ''} loading="lazy" />
          </button>
        </figure>
        {block.panelMarkdown ? (
          <MarkdownPanel src={block.panelMarkdown.src} title={block.panelMarkdown.title} />
        ) : (
          <div className="detail-copy-panel">{block.panelText}</div>
        )}
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
              {...mediaHoverProps}
              aria-label={`放大预览：${video.label || '视频'}`}
            >
              <LazyVideo
                src={video.src}
                aria-label={video.label}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </button>
          </figure>
        ))}
      </div>
    );
  }

  if (block.type === 'processTable') {
    return (
      <div className="detail-copy-process-table-wrap" key={key}>
        <table className="detail-copy-process-table">
          <thead>
            <tr>
              {block.headers.map((header, headerIndex) => (
                <th key={`${key}-head-${headerIndex}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr className={rowIndex === block.highlightRow ? 'is-highlighted' : undefined} key={`${key}-row-${row[0]}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
      <div className={`detail-copy-paragraphs ${block.className || ''}`} key={key}>
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
        text: block.tocLabel || block.text,
        fullText: block.text,
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

    if (block.type === 'imagePanelPair') {
      return block.image
        ? [{ type: 'image', src: block.image.src, previewSrc: block.image.previewSrc, alt: block.image.alt || '图片预览' }]
        : [];
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

  const galleryMedia = (detail.images || [])
    .filter((image) => image.src && image.type !== 'figmaEmbed')
    .map((image) => ({
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
    label: work.detailHeroLabel || 'Works',
    kicker: work.detailHeroKicker || work.type,
    title: work.title,
    image: work.detailHeroImage || work.image,
    video: work.detailHeroImage ? null : work.video,
    alt: work.alt || work.title,
    className: `is-work-card${work.detailHeroImageMode === 'contain' ? ' is-contain-media' : ''}${
      work.detailHeroVariant ? ` is-${work.detailHeroVariant}` : ''
    }`,
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
          <span>{card.title}</span>
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
        <PlaceholderImage src={card.image} alt={card.alt} loading="eager" />
      )}
    </div>
  );
}

function WorkDetail({ work, detail }) {
  const facts = detail.facts;
  const otherContentCards = getOtherContentCards(work.slug);
  const homeReturnHref = efficiencyShowcase.practices.some((item) => item.slug === work.slug)
    ? `/#ai-card-${work.slug}`
    : `/#work-card-${work.slug}`;
  const tocItems = useMemo(() => getDetailTocItems(detail.copyBlocks), [detail.copyBlocks]);
  const mediaItems = useMemo(() => getDetailMediaItems(detail), [detail]);
  const galleryPreviewItems = useMemo(
    () => (detail.images || []).filter((image) => image.src && image.type !== 'figmaEmbed'),
    [detail.images],
  );
  const [previewIndex, setPreviewIndex] = useState(null);
  const [previewCursor, setPreviewCursor] = useState({ x: 0, y: 0, active: false });
  const [detailCursor, setDetailCursor] = useState({ x: 0, y: 0, active: false });
  const [showDetailToc, setShowDetailToc] = useState(false);
  const [activeTocId, setActiveTocId] = useState(tocItems[0]?.id || null);
  const previewMedia = previewIndex === null ? null : mediaItems[previewIndex];
  const mediaCount = mediaItems.length;
  const galleryMediaOffset = mediaItems.length - galleryPreviewItems.length;

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
      <main className={`detail-page detail-page-${work.slug}`} id="top">
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
                  title={item.fullText}
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
              {detail.copyBlocks.map((block, index) =>
                renderDetailCopyBlock(block, index, { openMediaPreview, setDetailCursor }),
              )}
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
              {detail.images.map((image, index) => {
                if (image.type === 'figmaEmbed') {
                  return (
                    <Reveal className="detail-figma-embed" key={`${image.src}-${index}`}>
                      <iframe
                        src={image.src}
                        title={image.title || 'Figma 预览'}
                        loading="lazy"
                        allowFullScreen
                      />
                    </Reveal>
                  );
                }

                const galleryPreviewIndex = detail.images
                  .slice(0, index)
                  .filter((item) => item.src && item.type !== 'figmaEmbed').length;

                return (
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
                        setPreviewIndex(galleryMediaOffset + galleryPreviewIndex);
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
                      <PlaceholderImage
                        src={image.src}
                        alt={image.alt}
                        loading={image.loading || (index > 1 ? 'lazy' : 'eager')}
                      />
                    </button>
                  </Reveal>
                );
              })}
            </div>
          ) : null}
          <Reveal className="related-title">
            <div className="related-title-row">
              <h2>其他内容</h2>
              <a className="approach-link detail-home-link" href={homeReturnHref}>
                <span>返回首页</span>
                <ArrowUpRight size={30} strokeWidth={2.2} />
              </a>
            </div>
          </Reveal>
          <div className="detail-related-grid">
            {otherContentCards.map((related, index) => (
              <Reveal className="detail-related-card" key={related.slug} delay={index * 0.08}>
                <a
                  className="image-link"
                  href={`/works/${related.slug}`}
                  aria-label={related.title}
                >
                  <span className="detail-related-cover">
                    {related.video ? (
                      <LazyVideo
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
                      <PlaceholderImage src={related.image} alt={related.alt} loading="lazy" />
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
              <PlaceholderImage src={previewMedia.previewSrc || previewMedia.src} alt={previewMedia.alt} />
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
  const didRestoreInitialScrollRef = useRef(false);
  const skipNextHashScrollRef = useRef(false);
  const workMatch = route.pathname.match(/^\/works\/([^/]+)\/?$/);
  const approachWorkItems = workApproach.map((item) => ({
    ...item,
    type: 'Project approach',
    alt: item.alt || item.title,
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
  const currentWorkSlug = currentWork?.slug;
  const brandHomeHref =
    currentWorkSlug && workApproach.some((item) => item.slug === currentWorkSlug)
      ? `/#work-card-${currentWorkSlug}`
      : currentWorkSlug && efficiencyShowcase.practices.some((item) => item.slug === currentWorkSlug)
        ? `/#ai-card-${currentWorkSlug}`
        : '/';
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

  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    let saveAnimationFrame = 0;

    const saveCurrentScroll = () => {
      saveAnimationFrame = 0;
      saveRouteScroll(routeRef.current);
    };

    const handleScroll = () => {
      if (saveAnimationFrame) return;
      saveAnimationFrame = window.requestAnimationFrame(saveCurrentScroll);
    };

    const handleBeforeUnload = () => {
      saveRouteScroll(routeRef.current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      if (saveAnimationFrame) window.cancelAnimationFrame(saveAnimationFrame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  useLayoutEffect(() => {
    routeRef.current = route;

    if (!didRestoreInitialScrollRef.current) {
      didRestoreInitialScrollRef.current = true;
      const savedScroll = getSavedRouteScroll(route);

      if (savedScroll !== null) {
        skipNextHashScrollRef.current = true;
        const restoreScroll = () => window.scrollTo({ top: savedScroll, left: 0, behavior: 'auto' });
        restoreScroll();
        window.setTimeout(restoreScroll, 80);
        window.setTimeout(restoreScroll, 260);
        return;
      }
    }

    scrollToRouteTarget(route);
  }, [route.pathname, route.search, route.hash]);

  useEffect(() => {
    if (!route.hash) return undefined;

    if (skipNextHashScrollRef.current) {
      skipNextHashScrollRef.current = false;
      return undefined;
    }

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
  const hideHeaderOverAi = false;

  return (
    <>
      <Header
        routePath={route.pathname}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        hideForAi={hideHeaderOverAi}
        homeHref={brandHomeHref}
      />
      <RouteTransitionOverlay transition={routeTransition} />
      {page}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

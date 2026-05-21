import React, { Suspense, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import './styles.css';

const Spline = React.lazy(() => import('@splinetool/react-spline'));
const Rive = React.lazy(() => import('@rive-app/react-canvas'));

const remote = {
  profile: 'https://framerusercontent.com/images/nKZxL3ov6hieQXZbst1I06HCxPI.jpg?width=627&height=627',
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
  ['Cannes Lights', '[Best Campaign Direction]', '2025'],
  ['Lurssen Archive', '[Campaign Feature]', '2025'],
  ['D&AC', '[Art Direction & Campaign]', '2024'],
  ['Motion Craft', '[Excellence in 3D Narrative]', '2023'],
  ['The Visualist', '[Creative Direction]', '2022'],
];

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

const detailFacts = [
  ['Project', '米线游戏制作管理'],
  ['Role', '设计主owner，0-1搭建+跟进迭代'],
  ['Company', '米哈游'],
  ['Industry', '上线，交付5个游戏项目组'],
  ['Timeline', '2023.12-至今'],
  ['Contributors', 'Finn Wilder, Ava Chen, Leo Hart'],
  ['Year', '2025'],
];

const detailImages = [
  {
    src: remote.profile,
    alt: 'Minimal gray 3D production objects',
  },
  {
    src: '/assets/work-astranova.png',
    alt: 'Space Mission - Focused Astronaut',
  },
  {
    src: remote.hero,
    alt: '3D motion and design icon composition',
  },
  {
    src: remote.game,
    alt: 'Blue 3D user interface composition',
  },
  {
    src: '/assets/work-vortex.png',
    alt: 'Focused racer portrait',
  },
];

const navItems = ['Works [ 8 ]', 'About', 'Journal [ 5 ]', 'Contact', 'All Pages [ 11 ]', 'Remix Template'];
const heroTitle = 'UX & Motion Designer';
const heroTitleCharacters = Array.from(heroTitle);

function Reveal({ children, className = '', delay = 0, float = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: float ? 96 : 0, scale: float ? 0.985 : 1, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.22, margin: '-8% 0px -8% 0px' }}
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
      viewport={{ once: false, amount: 0.16, margin: '-6% 0px -6% 0px' }}
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
      viewport={{ once: false, amount: 0.12, margin: '-5% 0px -5% 0px' }}
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
  strength = 72,
  as: Tag = 'figure',
  hover = true,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <Tag ref={ref} className={`parallax-frame ${className}`}>
      <motion.img
        className={imageClassName}
        src={src}
        alt={alt}
        loading={loading}
        style={{ y }}
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
      <span key={replayKey} className="hero-title-line" aria-hidden="true">
        {heroTitleCharacters.map((character, index) => (
          <span className={`hero-title-mask${character === ' ' ? ' is-space' : ''}`} key={`${character}-${index}`}>
            <motion.span
              className="hero-title-part"
              initial={{ y: 18, opacity: 0, filter: 'blur(16px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                duration: 0.62,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.06 + index * 0.035,
              }}
            >
              {character === ' ' ? '\u00A0' : character}
            </motion.span>
          </span>
        ))}
      </span>
    </h1>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Finn Wilder home">
        <img src={remote.profile} alt="" />
        <span>周塞寒</span>
        <small>Art Director</small>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item} href={item.startsWith('Works') ? '/#works' : '/#contact'}>
            {item}
          </a>
        ))}
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={25} strokeWidth={2} /> : <Menu size={25} strokeWidth={2} />}
      </button>
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
        {navItems.map((item) => (
          <a key={item} href={item.startsWith('Works') ? '/#works' : '/#contact'} onClick={() => setOpen(false)}>
            {item}
          </a>
        ))}
      </motion.nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-top">
        <Reveal className="intro-note">
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
          <img src={remote.avatar} alt="Illustrated designer avatar" />
        </Reveal>
      </div>
      <HeroCover />
    </section>
  );
}

function WorkGrid() {
  return (
    <MotionSection className="section work-section" id="works">
      <div className="section-head">
        <h2>主要项目</h2>
        <a href="#works">View All</a>
      </div>
      <div className="works-grid">
        {works.map((work, index) => (
          <Reveal key={work.title} className="work-card" delay={(index % 2) * 0.1}>
            <a className="image-link" href={`/works/${work.slug}`} aria-label={work.title}>
              <ParallaxImage
                as="span"
                src={work.image}
                alt={work.alt}
                loading={index > 1 ? 'lazy' : 'eager'}
                strength={58}
              />
            </a>
            <p>{work.type}</p>
            <h3>{work.title}</h3>
          </Reveal>
        ))}
      </div>
    </MotionSection>
  );
}

function Expertise() {
  return (
    <MotionSection className="section split-section sticky-module" id="about" sticky>
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
  return (
    <MotionSection className="section rows-section sticky-module" sticky>
      <aside className="sticky-title">
        <Reveal className="rows-title sticky-title-inner">
          <h2>
            履历 <span>[5]</span>
          </h2>
        </Reveal>
      </aside>
      <div className="rows">
        {awards.map(([title, label, year]) => (
          <Reveal className="award-row" key={title}>
            <h3>{title}</h3>
            <span>·</span>
            <p>{label}</p>
            <time>{year}</time>
          </Reveal>
        ))}
      </div>
    </MotionSection>
  );
}

function Skills() {
  return (
    <MotionSection className="section split-section skills-section sticky-module" sticky>
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
      {kind === 'spline' ? <Spline scene={src} /> : <Rive src={src} />}
    </Suspense>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <Reveal>
        <p>Available for selected art direction, campaign systems, and motion-led identities.</p>
        <a href="mailto:hello@finnwilder.studio">hello@finnwilder.studio</a>
      </Reveal>
      <InteractiveEmbed kind="spline" />
      <InteractiveEmbed kind="rive" />
    </footer>
  );
}

function WorkDetail() {
  return (
    <>
      <Header />
      <main className="detail-page" id="top">
        <aside className="detail-sidebar" aria-label="Project details">
          {detailFacts.map(([label, value]) => (
            <div className="detail-fact" key={label}>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
          ))}
        </aside>
        <article className="detail-content">
          <Reveal>
            <h1>
              "Designing for space is not about escaping reality, but about expanding it. The mission is not just to
              reach orbit, but to make people feel something when they look up. It’s about translating the unknown into
              form, turning science into emotion, and building symbols that remind us how small we are and how far we
              can go."
            </h1>
          </Reveal>
          <Reveal className="detail-embed" delay={0.05}>
            <iframe
              title="Project prototype preview"
              src="about:blank"
              loading="lazy"
              aria-label="Project prototype preview"
            />
          </Reveal>
          <Reveal className="detail-copy">
            <p>
              AstraNova Mission Identity is a conceptual branding and visual design project for a fictional private
              space mission. The goal was to reimagine how aerospace branding could feel in the modern era less
              institutional, more emotional, and rooted in the awe of human ambition.
            </p>
            <p>
              The visual direction centered on the contrast between fragility and strength. We used light, reflection,
              and slow-motion 3D sequences to communicate the tension between isolation and discovery. The identity
              system extends across mission badges, capsule markings, digital dashboards, and motion pieces.
            </p>
          </Reveal>
          <div className="detail-gallery">
            {detailImages.map((image, index) => (
              <Reveal className="detail-image" key={`${image.src}-${index}`}>
                <ParallaxImage
                  src={image.src}
                  alt={image.alt}
                  loading={index > 1 ? 'lazy' : 'eager'}
                  strength={index === 0 ? 60 : 86}
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="related-title">
            <h2>Related works</h2>
          </Reveal>
        </article>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const isWorkDetail = window.location.pathname === '/works/astranova-mission-identity';

  if (isWorkDetail) {
    return <WorkDetail />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <WorkGrid />
        <Expertise />
        <Awards />
        <Skills />
        <Testimonials />
        <Journal />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

import BrandMark from './BrandMark';
import { useEffect, useRef, useState } from 'react';
import type { Profile, Project } from './types';
import { PROFILE_QUERY, queryAPI } from './types';

const navigation = [
  { label: 'Проекты', id: 'work' },
  { label: 'Опыт', id: 'experience' },
  { label: 'Стек', id: 'stack' },
  { label: 'API', id: 'api' },
];

function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('a')?.focus();
    const close = () => {
      setOpen(false);
      button.current?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;
      const items = [
        button.current,
        ...Array.from(panel.current?.querySelectorAll('a') ?? []),
      ].filter(Boolean) as HTMLElement[];
      const index = items.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
    };
    const media = matchMedia('(min-width: 800px)');
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    media.addEventListener('change', resize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      media.removeEventListener('change', resize);
    };
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        Перейти к содержимому
      </a>
      <header className="header">
        <a
          className="wordmark"
          aria-label="miyron, на главную"
          href="#home"
          tabIndex={open ? -1 : undefined}
        >
          <BrandMark />
          <span aria-hidden="true">iyron</span>
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map(link => (
            <a key={link.id} href={`#${link.id}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          ref={button}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </header>
      <nav
        id="mobile-menu"
        ref={panel}
        className={`mobile-menu ${open ? 'is-open' : ''}`}
        inert={!open}
        aria-hidden={!open}
        aria-label="Мобильная навигация"
      >
        {navigation.map((link, i) => (
          <a key={link.id} href={`#${link.id}`} onClick={() => setOpen(false)}>
            <small>0{i + 1}</small>
            {link.label}
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)}>
          <small>05</small>Связаться
        </a>
      </nav>
    </>
  );
}

function RobotBackground() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current!;
    let previousX: number | null = null;
    let target = 0;
    let frame = 0;
    let busy = false;
    let lastSeek = -Infinity;
    let visible = true;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const schedule = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(seek);
    };
    const seek = (now: number) => {
      frame = 0;
      if (busy || video.readyState < 2 || !Number.isFinite(video.duration)) return;
      const time = Math.max(0, Math.min(Math.round(target * 24) / 24, video.duration - 1 / 24));
      if (Math.abs(time - video.currentTime) < 1 / 48) return;
      if (now - lastSeek < 1000 / 24) {
        schedule();
        return;
      }
      busy = true;
      lastSeek = now;
      video.currentTime = time;
    };
    const move = (event: MouseEvent) => {
      const delta = previousX === null ? 0 : event.clientX - previousX;
      previousX = event.clientX;
      if (!visible || reducedMotion.matches || !Number.isFinite(video.duration)) return;
      target = Math.max(
        0,
        Math.min(video.duration, target + (delta / innerWidth) * 0.8 * video.duration),
      );
      schedule();
    };
    const reset = () => {
      previousX = null;
    };
    const seeked = () => {
      busy = false;
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      previousX = null;
      if (!visible) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(video);
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('blur', reset);
    video.addEventListener('seeked', seeked);
    video.addEventListener('loadeddata', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('blur', reset);
      video.removeEventListener('seeked', seeked);
      video.removeEventListener('loadeddata', schedule);
    };
  }, []);
  return (
    <div className="robot-background" aria-hidden="true">
      <video
        ref={ref}
        src="/media/mainframe-scrub.mp4"
        poster="/media/robot-poster.jpg"
        muted
        playsInline
        preload="auto"
      />
      <div className="robot-shade" />
    </div>
  );
}

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <div className={`project-art ${project.visual}`} aria-hidden="true">
      <span className="art-coordinate">{project.category.toUpperCase()}</span>
      {project.visual === 'chain' && (
        <div className="chain-shape">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      )}
      {project.visual === 'payment' && (
        <div className="payment-shape">
          <span>paycot</span>
          <div className="payment-lines">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <small>PAYMENT INFRASTRUCTURE</small>
        </div>
      )}
      {project.visual === 'forge' && (
        <div className="forge-shape">
          <i />
          <i />
          <i />
        </div>
      )}
      {project.visual === 'wallet' && (
        <div className="wallet-shape">
          <span>oris.</span>
          <div className="wallet-orbit" />
          <small>YOUR ON-CHAIN WORLD</small>
        </div>
      )}
      <span className="art-footer">{project.stack}</span>
    </div>
  );
}

const exampleQuery = `query AboutMe {
  profile {
    name
    description
    skills { name }
    experience {
      company
      position
    }
    projects { name url }
  }
}`;

function ApiDemo() {
  const [query, setQuery] = useState(exampleQuery);
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const execute = async () => {
    setBusy(true);
    setError(false);
    const start = performance.now();
    try {
      const payload = await queryAPI(query);
      setResult(JSON.stringify(payload, null, 2));
      setElapsed(Math.round(performance.now() - start));
    } catch (e) {
      setError(true);
      setResult(e instanceof Error ? e.message : 'Не удалось выполнить запрос');
      setElapsed(null);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section id="api" className="api-section section-pad">
      <div className="section-top">
        <span className="eyebrow">04 / OPEN INTERFACE</span>
        <span className="eyebrow">НЕ ТОЛЬКО СЛОВА. ДАННЫЕ.</span>
      </div>
      <div className="api-heading">
        <h2>
          Можно спросить
          <br />у моего API.
        </h2>
        <p>
          Эта страница получает данные из GraphQL.
          <br />
          Выполните запрос: профиль, навыки,
          <br className="desktop-break" /> опыт и проекты доступны без регистрации.
        </p>
      </div>
      <div className="api-console">
        <div className="console-toolbar">
          <div className="console-dots">
            <i />
            <i />
            <i />
          </div>
          <span>POST /graphql</span>
          <span className="console-tech">NestJS + Prisma</span>
        </div>
        <div className="console-panes">
          <div className="query-pane">
            <label htmlFor="query-editor" className="pane-label">
              QUERY
            </label>
            <textarea
              id="query-editor"
              aria-label="GraphQL запрос"
              value={query}
              onChange={e => setQuery(e.target.value)}
              spellCheck={false}
            />
            <button className="run-button" onClick={execute} disabled={busy}>
              {busy ? 'Выполняется…' : 'Выполнить запрос'}
              <span aria-hidden="true">{busy ? '···' : '▶'}</span>
            </button>
          </div>
          <div className="response-pane" aria-busy={busy}>
            <div className="pane-label">
              RESPONSE{' '}
              <span role="status">
                {busy
                  ? 'Загрузка…'
                  : result
                    ? error
                      ? 'Ошибка запроса'
                      : `200 OK · ${elapsed} ms`
                    : 'Ожидание запроса'}
              </span>
            </div>
            {result ? (
              <pre className={error ? 'api-error' : ''}>{result}</pre>
            ) : (
              <div className="response-empty">
                <span>{'{ }'}</span>
                <p>Здесь будет выполнен запрос</p>
                <small>Нажмите «Выполнить запрос»</small>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="api-bottom">
        <span>TypeScript / Node.js / NestJS / Prisma / GraphQL / Docker / Git</span>
        <a href="/graphql" target="_blank" rel="noreferrer">
          Открыть Apollo Sandbox
        </a>
      </div>
    </section>
  );
}

function Skills({ skills }: { skills: Profile['skills'] }) {
  const [category, setCategory] = useState('Все');
  const categories = ['Все', ...new Set(skills.map(skill => skill.category))];
  const selected =
    category === 'Все' ? skills : skills.filter(skill => skill.category === category);
  return (
    <section id="stack" className="stack-section section-pad">
      <div className="section-top">
        <span className="eyebrow">03 / TOOLKIT</span>
        <span className="eyebrow">ИНСТРУМЕНТЫ ПОД ЗАДАЧУ</span>
      </div>
      <div className="stack-heading">
        <h2>
          Архитектура прежде.
          <br />
          <span className="muted">Технологии следом.</span>
        </h2>
        <p>
          От контракта API до мониторинга в проде.
          <br />
          Выбираю стек, который решает задачу
          <br />и остаётся понятным команде.
        </p>
      </div>
      <div className="skill-filters" aria-label="Категории навыков">
        {categories.map(item => (
          <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="skills-cloud" aria-live="polite">
        {selected.map(skill => (
          <span key={skill.name}>{skill.name}</span>
        ))}
      </div>
    </section>
  );
}

function Portfolio({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState('');
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(''), 3500);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied('Email скопирован');
    } catch {
      setCopied('Не удалось скопировать. Используйте ссылку email.');
    }
  };
  return (
    <>
      <section className="hero section-pad" id="home">
        <RobotBackground />
        <div className="hero-topline">
          <span className="eyebrow">VLAD ZAKALYUZHNYY</span>
          <span className="eyebrow hero-location">АСТАНА, KZ / РАБОТАЮ УДАЛЁННО</span>
        </div>
        <div className="hero-composition">
          <div className="hero-copy">
            <div className="role-label">
              <span className="status-dot" /> SENIOR BACKEND DEVELOPER
            </div>
            <h1>
              За каждым
              <br />
              сильным продуктом.
              <br />
              <span className="hero-outline">Сильный backend.</span>
            </h1>
            <div className="hero-actions">
              <a className="button button-dark" href="#work">
                Посмотреть проекты
              </a>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>
            NODE.JS & TYPEScript
            <br />
            <span className="muted">Архитектура. Производительность. Надёжность.</span>
          </span>
          <span className="hero-index">
            BACKEND ENGINEERING
            <br />С 2020 ГОДА
          </span>
          <a href="#work" className="scroll-cue">
            <span className="scroll-track">
              <i />
            </span>
            Листайте, здесь больше
          </a>
        </div>
      </section>
      <section className="metrics section-pad reveal" aria-label="Результаты работы">
        <div>
          <span className="metric-number">
            47<span>%</span>
          </span>
          <p>Ускорение PostgreSQL</p>
          <small>Automated Communication Solutions</small>
        </div>
        <div>
          <span className="metric-number">
            27<span>%</span>
          </span>
          <p>Меньше времени на ответ API</p>
          <small>Orgonscan / KAZ.ONE.LABS</small>
        </div>
        <div>
          <span className="metric-number">
            50<span>%</span>
          </span>
          <p>
            Снижение расходов на API
            <br />и инфраструктуру
          </p>
          <small>LIVIN</small>
        </div>
      </section>
      <section id="work" className="work-section section-pad">
        <div className="section-top">
          <span className="eyebrow">01 / SELECTED WORK</span>
          <span className="eyebrow">РЕАЛЬНЫЕ ПРОДУКТЫ. РЕАЛЬНЫЙ ОПЫТ.</span>
        </div>
        <div className="section-heading reveal">
          <h2>
            Код, который
            <br />
            <span className="muted">уже работает.</span>
          </h2>
          <p>
            Финтех, Web3 и продуктовая разработка.
            <br />
            Проекты, в создании которых я участвовал.
          </p>
        </div>
        <div className="project-grid">
          {profile.projects.map((project, i) => (
            <article className="project-card reveal" key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="project-art-link"
                aria-label={`Открыть ${project.name}`}
              >
                <ProjectArtwork project={project} />
                <span className="project-visit">Открыть проект</span>
              </a>
              <div className="project-title">
                <h3>
                  <a href={project.url} target="_blank" rel="noreferrer">
                    {project.name}
                  </a>
                </h3>
                <span>0{i + 1}</span>
              </div>
              <p>{project.description}</p>
              <span className="project-result">{project.result}</span>
            </article>
          ))}
        </div>
      </section>
      <section id="experience" className="experience-section section-pad">
        <div className="section-top">
          <span className="eyebrow">02 / EXPERIENCE</span>
          <span className="eyebrow">С 2020 ГОДА ПО НАСТОЯЩЕЕ ВРЕМЯ</span>
        </div>
        <div className="section-heading reveal">
          <h2>
            Опыт, за которым
            <br />
            стоят результаты.
          </h2>
          <p>
            От первых микросервисов
            <br />
            до платёжной и блокчейн-инфраструктуры.
          </p>
        </div>
        <div className="experience-list">
          {profile.experience.map((job, i) => (
            <details className="experience-row" key={job.company} open={i === 0}>
              <summary>
                <span className="experience-year">
                  {job.startDate.slice(0, 4)}
                  {!job.endDate && <span className="current-badge">Сейчас</span>}
                </span>
                <span className="experience-name">
                  {job.company}
                  <small>{job.position}</small>
                </span>
                <span className="experience-period">{job.period}</span>
                <span className="expand-icon" aria-hidden="true" />
              </summary>
              <div className="experience-content">
                <span className="mobile-period">{job.period}</span>
                <ul>
                  {job.achievements.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="job-stack">{job.stack}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
      <Skills skills={profile.skills} />
      <ApiDemo />
      <section id="contact" className="contact-section section-pad">
        <div className="section-top">
          <span className="eyebrow">05 / LET’S BUILD</span>
          <span className="eyebrow">АСТАНА · REMOTE</span>
        </div>
        <div className="contact-heading">
          <h2>
            Есть задача?
            <br />
            <span className="muted">Давайте решим.</span>
          </h2>
          <BrandMark className="contact-mark" />
        </div>
        <div className="contact-bottom">
          <p>
            Сложный backend, новый продукт
            <br />
            или просто хорошее знакомство.
          </p>
          <div className="contact-links">
            {profile.links.map(link => (
              <a
                key={link.label}
                className="button button-dark"
                href={link.url}
                target={link.url.startsWith('https:') ? '_blank' : undefined}
                rel="noreferrer"
              >
                {link.label === 'Email' ? 'Написать на почту' : 'Написать в Telegram'}
              </a>
            ))}
            <button className="copy-email" onClick={copy}>
              Скопировать email
              <span className="copy-symbol" aria-hidden="true">
                ⧉
              </span>
            </button>
            <span role="status" className="copy-status">
              {copied}
            </span>
          </div>
        </div>
      </section>
      <footer className="footer section-pad">
        <a href="#home" className="wordmark" aria-label="miyron, на главную">
          <BrandMark />
          <span aria-hidden="true">iyron</span>
        </a>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a href="/graphql" target="_blank" rel="noreferrer">
          У этого портфолио есть API.
        </a>
        <a href="#home">Наверх</a>
      </footer>
    </>
  );
}

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let active = true;
    setError(false);
    queryAPI(PROFILE_QUERY, controller.signal)
      .then(result => {
        if (active) setProfile(result.data.profile);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [attempt]);
  return (
    <>
      <Header />
      <main id="main">
        {profile ? (
          <Portfolio profile={profile} />
        ) : (
          <div className="loading-screen">
            <BrandMark className="loading-brand" />
            <h1>{error ? 'Не удалось загрузить профиль' : 'Знакомство начинается…'}</h1>
            <p>{error ? 'Сервер временно недоступен. Попробуйте ещё раз.' : 'Подключаюсь к API'}</p>
            {error && (
              <button className="button button-dark" onClick={() => setAttempt(attempt + 1)}>
                Повторить
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}

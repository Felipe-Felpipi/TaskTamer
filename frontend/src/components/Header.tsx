interface HeaderProps {
  online: boolean;
  loading: boolean;
}

export default function Header({ online, loading }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="20" cy="20" r="19" stroke="#c9803f" strokeWidth="2" />
          <path
            d="M11 20c0-3 2-5 5-5s5 2 5 5-2 5-5 5c-1.7 0-3-.7-3.8-1.8M25 22c2 0 4-1.6 4-4.5S27.5 13 25 13c-1.5 0-2.7.7-3.5 1.8"
            stroke="#4f46e5"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        <div className="brand-text">
          <h1>TaskTamer</h1>
          <p>Suas tarefas, domadas — agora com API própria</p>
        </div>
      </div>
      <span className={`status-pill ${loading ? '' : online ? 'online' : 'offline'}`}>
        <span className="status-dot" />
        {loading ? 'conectando…' : online ? 'API conectada' : 'API offline'}
      </span>
    </header>
  );
}

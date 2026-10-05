const paths = {
  sun: 'M12 1v2 M12 21v2 M1 12h2 M21 12h2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20.8 13A9 9 0 1 1 11 3a7 7 0 0 0 9.8 10z',
  layers: 'm3 7 9-5 9 5-9 5z M3 12l9 5 9-5 M3 17l9 5 9-5',
  book: 'M4 3h6a3 3 0 0 1 3 3v15a4 4 0 0 0-4-3H4z M13 6a3 3 0 0 1 3-3h5v15h-5a3 3 0 0 0-3 3',
  clipboard: 'M9 4H5v17h14V4h-4 M9 2h6v4H9z M8 11h8 M8 15h5',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  external: 'M14 3h7v7 M21 3l-11 11 M10 3H3v18h18v-7',
  code: 'm8 6-6 6 6 6 M16 6l6 6-6 6 M14 3l-4 18',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
  sliders: 'M4 3v8 M4 15v6 M12 3v3 M12 10v11 M20 3v12 M20 19v2 M1 11h6 M9 6h6 M17 15h6',
  activity: 'M2 12h4l3-8 6 16 3-8h4',
  zap: 'm13 2-9 12h7l-1 8 10-12h-7z',
  shield: 'm12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6z M8 12l3 3 5-6',
  catalog: 'M4 3h16v18H4z M8 7h8 M8 11h8 M8 15h4',
  terminal: 'M3 4h18v16H3z m4 5 3 3-3 3 M13 15h4',
  history: 'M3 12a9 9 0 1 1 3 7 M3 4v8h8 M12 7v5l3 2',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  check: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12 M6 18 18 6',
  flag: 'M5 22V3 M5 3c6-4 8 4 15 0v10c-7 4-9-4-15 0',
  target: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0 M12 10v4 M10 12h4',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0 m-2 5 7 7',
  info: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 11v6 M12 7h.01',
};

export default function Icon({ name, size = 20, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.layers} /></svg>;
}

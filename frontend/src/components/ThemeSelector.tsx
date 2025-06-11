import React, { useEffect } from 'react';

const themes = Array.from({ length: 10 }, (_, i) => `theme-dark-${i + 1}`);

const ThemeSelector: React.FC = () => {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || themes[0]);

  useEffect(() => {
    document.body.classList.remove(...themes);
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <select
      className="border px-2 py-1"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
};

export default ThemeSelector;

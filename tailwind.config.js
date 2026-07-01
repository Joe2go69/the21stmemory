/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './assets/js/**/*.js',
    './scripts/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        mem: {
          muted: 'var(--text-muted)',
          soft: 'var(--text-soft)',
          prose: 'var(--text-prose)',
          body: 'var(--text-body-tint)',
          bright: 'var(--text-bright)',
          secondary: 'var(--text-secondary)',
          accent: 'var(--accent-purple-bright)',
          indigo: 'var(--accent-indigo)',
          dim: 'var(--text-dim)',
          deep: 'var(--deep-bg)',
          scrim: 'var(--surface-scrim)',
          surface: 'var(--surface-hover)',
          inset: 'var(--surface-inset)',
          violet: 'var(--accent-violet-bright)',
          subtle: 'var(--border-subtle)',
          highlight: 'var(--link-hover)',
          card: 'var(--card-bg)',
        },
      },
      borderRadius: {
        card: 'var(--radius-card)',
        button: 'var(--radius-button)',
      },
    },
  },
  plugins: [],
};
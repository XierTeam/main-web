import { defineConfig, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      brand: {
        DEFAULT: '#6366f1',
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
      },
      accent: {
        DEFAULT: '#8b5cf6',
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
      },
    },
    fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"PingFang SC"',
        '"Hiragino Sans GB"',
        '"Microsoft YaHei"',
        'sans-serif',
      ],
    },
  },
  shortcuts: {
    'btn': 'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60',
    'btn-primary': 'btn text-white bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 shadow-md shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-px active:translate-y-0',
    'btn-ghost': 'btn bg-white text-slate-700 border border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/60',
    'card': 'bg-white rounded-2xl border border-slate-200/80 shadow-sm',
    'chip': 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
    'container-page': 'mx-auto w-full max-w-6xl px-4 sm:px-6',
  },
})

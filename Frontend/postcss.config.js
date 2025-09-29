// Tailwind CSS v4: use the separate PostCSS plugin package
// https://tailwindcss.com/docs/installation
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer()
  ]
}
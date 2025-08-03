import * as colors from 'picocolors';
import type { TailwindFramework } from '../types';

const {
  blue,
  green,
  yellow,
} = colors;


export const TAILWINDFRAMEWORKS: TailwindFramework[] = [
  {
    name: 'tailwindcss',
    display: 'Tailwind CSS',
    color: yellow,
    variants: [
      {
        name: 'tailwind-v4',
        display: 'Tailwind V4',
        color: green,
        customCommand: 'PKG_MANAGER install tailwindcss @tailwindcss/cli',
        templateSuffix: 'v4',
        desc: 'Tailwind CSS v4 with new CSS-first configuration and Lightning CSS engine'
      },
      {
        name: 'tailwind-v3',
        display: 'Tailwind V3',
        color: blue,
        customCommand: 'PKG_MANAGER install -D tailwindcss@3',
        templateSuffix: 'v3',
        desc: 'Tailwind CSS v3 with traditional configuration and build process'
      },
    ],
  },
];

/**
 * Generate Tailwind template directory path
 * Converts template-react-ts to tw-template-react-ts-v3 or tw-template-react-ts-v4
 * @param baseTemplateDir - Base template directory (e.g., 'template-react-ts')
 * @param tailwindVariant - Tailwind variant name (e.g., 'tailwind-v3')
 * @returns Tailwind template path
 */
export function getTailwindTemplateDir(baseTemplateDir: string, tailwindVariant: string): string {
  if (!tailwindVariant) return baseTemplateDir;
  
  const tailwindConfig = TAILWINDFRAMEWORKS[0].variants.find(v => v.name === tailwindVariant);
  if (!tailwindConfig) return baseTemplateDir;
  
  // Convert template-react-ts to tw-template-react-ts-v3 or tw-template-react-ts-v4
  return `tw-${baseTemplateDir}-${tailwindConfig.templateSuffix}`;
}
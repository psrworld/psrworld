import * as colors from 'picocolors';
import type { Framework, FrameworkVariant } from '../types';

const {
  blue,
  blueBright,
  cyan,
  green,
  greenBright,
  magenta,
  red,
  redBright,
  reset,
  yellow,
  gray,
} = colors;

/**
 * Framework configurations for project scaffolding
 * Each framework contains variants with different setups and features
 */
export const FRAMEWORKS: Framework[] = [
  {
    name: 'vanilla',
    display: 'Vanilla',
    color: yellow,
    desc: `Vanilla JavaScript with TypeScript, Vite, and modern tooling setup`,
    variants: [
      {
        name: 'vanilla-ts',
        display: 'TypeScript',
        color: blue,
        templateDir: 'template-vanilla-ts',
        desc: 'Vanilla JavaScript with TypeScript, Vite, and modern tooling setup'
      },
      {
        name: 'vanilla',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-vanilla',
        desc: 'Pure vanilla JavaScript with Vite for fast development and building'
      },
    ],
  },
  {
    name: 'vue',
    display: 'Vue',
    color: green,
    variants: [
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: blue,
        templateDir: 'template-vue-ts',
        desc: 'Vue 3 with TypeScript, Composition API, and single file components'
      },
      {
        name: 'vue',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-vue',
        desc: 'Vue 3 with JavaScript, Composition API, and reactive components'
      },
      {
        name: 'custom-create-vue',
        display: 'Official Vue Starter ↗',
        color: green,
        customCommand: 'npm create vue@latest TARGET_DIR',
        desc: 'Official Vue project generator with customizable features and tooling'
      },
      {
        name: 'custom-nuxt',
        display: 'Nuxt ↗',
        color: greenBright,
        customCommand: 'npm exec nuxi init TARGET_DIR',
        desc: 'Full-stack Vue framework with SSR, file-based routing, and auto-imports'
      },
    ],
  },
  {
    name: 'react',
    display: 'React',
    color: cyan,
    variants: [
      {
        name: 'react-ts',
        display: 'TypeScript',
        color: blue,
        templateDir: 'template-react-ts',
        desc: 'React 18 with TypeScript, JSX, hooks, and modern development setup'
      },
      {
        name: 'react-swc-ts',
        display: 'TypeScript + SWC',
        color: blue,
        templateDir: 'template-react-swc-ts',
        desc: 'React with TypeScript and SWC compiler for faster builds and HMR'
      },
      {
        name: 'react',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-react',
        desc: 'React 18 with JavaScript, JSX, and component-based architecture'
      },
      {
        name: 'react-swc',
        display: 'JavaScript + SWC',
        color: yellow,
        templateDir: 'template-react-swc',
        desc: 'React with JavaScript and SWC compiler for enhanced performance'
      },
      {
        name: 'custom-react-router',
        display: 'React Router v7 ↗',
        color: cyan,
        customCommand: 'npm create react-router@latest TARGET_DIR',
        desc: 'React with declarative routing, nested routes, and navigation management'
      },
      {
        name: 'custom-tanstack-router',
        display: 'TanStack Router ↗',
        color: cyan,
        customCommand:
          'npm create -- tsrouter-app@latest TARGET_DIR --framework React --interactive',
        desc: 'Type-safe router with search params, loaders, and advanced routing features'
      },
      {
        name: 'redwoodsdk-standard',
        display: 'RedwoodSDK ↗',
        color: red,
        customCommand:
          'npm exec degit redwoodjs/sdk/starters/standard TARGET_DIR',
        desc: 'Full-stack React framework with GraphQL, Prisma, and JAMstack architecture'
      },
      {
        name: 'rsc',
        display: 'RSC ↗',
        color: magenta,
        customCommand:
          'npm exec degit vitejs/vite-plugin-react/packages/plugin-rsc/examples/starter TARGET_DIR',
        desc: 'React Server Components with server-side rendering and streaming'
      },
    ],
  },
  {
    name: 'preact',
    display: 'Preact',
    color: magenta,
    variants: [
      {
        name: 'preact-ts',
        display: 'TypeScript',
        color: blue,
        templateDir: 'template-preact-ts',
        desc: 'Lightweight React alternative with TypeScript and 3KB runtime'
      },
      {
        name: 'preact',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-preact',
        desc: 'Fast 3KB React alternative with same modern API and ecosystem'
      },
      {
        name: 'custom-create-preact',
        display: 'Official Preact Starter ↗',
        color: magenta,
        customCommand: 'npm create preact@latest TARGET_DIR',
        desc: 'Official Preact generator with PWA features and optimized builds'
      },
    ],
  },
  {
    name: 'lit',
    display: 'Lit',
    color: redBright,
    variants: [
      {
        name: 'lit-ts',
        display: 'TypeScript',
        color: blue,
        templateDir: 'template-lit-ts',
        desc: 'Web Components with Lit library, TypeScript, and reactive properties'
      },
      {
        name: 'lit',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-lit',
        desc: 'Simple and fast web components using Lit library and templates'
      },
    ],
  },
  {
    name: 'svelte',
    display: 'Svelte',
    color: red,
    variants: [
      {
        name: 'svelte-ts',
        display: 'TypeScript',
        color: blue,
        templateDir: 'template-svelte-ts',
        desc: 'Compile-time optimized framework with TypeScript and reactive state'
      },
      {
        name: 'svelte',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-svelte',
        desc: 'No virtual DOM framework with compiled components and reactive updates'
      },
      {
        name: 'custom-svelte-kit',
        display: 'SvelteKit ↗',
        color: red,
        customCommand: 'npm exec sv create TARGET_DIR',
        desc: 'Full-stack Svelte framework with SSR, routing, and adapter system'
      },
    ],
  },
  {
    name: 'solid',
    display: 'Solid',
    color: blue,
    variants: [
      {
        name: 'solid-ts',
        display: 'TypeScript',
        color: blue,
        templateDir: 'template-solid-ts',
        desc: 'Fine-grained reactive framework with TypeScript and JSX syntax'
      },
      {
        name: 'solid',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-solid',
        desc: 'Performant reactive framework with signals and compiled templates'
      },
      {
        name: 'custom-tanstack-router',
        display: 'TanStack Router ↗',
        color: cyan,
        customCommand:
          'npm create -- tsrouter-app@latest TARGET_DIR --framework Solid --interactive',
        desc: 'Solid with type-safe routing, search params, and data loading'
      },
    ],
  },
  {
    name: 'qwik',
    display: 'Qwik',
    color: blueBright,
    variants: [
      {
        name: 'qwik-ts',
        display: 'TypeScript',
        color: blueBright,
        templateDir: 'template-qwik-ts',
        desc: 'Resumable framework with TypeScript and instant-on applications'
      },
      {
        name: 'qwik',
        display: 'JavaScript',
        color: yellow,
        templateDir: 'template-qwik',
        desc: 'Zero hydration framework with resumable execution and lazy loading'
      },
      {
        name: 'custom-qwik-city',
        display: 'QwikCity ↗',
        color: blueBright,
        customCommand: 'npm create qwik@latest basic TARGET_DIR',
        desc: 'Meta-framework for Qwik with routing, layouts, and SSR capabilities'
      },
    ],
  },
  {
    name: 'angular',
    display: 'Angular',
    color: red,
    variants: [
      {
        name: 'custom-angular',
        display: 'Angular ↗',
        color: red,
        customCommand: 'npm exec @angular/cli@latest new TARGET_DIR',
        desc: 'Full-featured framework with TypeScript, dependency injection, and CLI tools'
      },
      {
        name: 'custom-analog',
        display: 'Analog ↗',
        color: yellow,
        customCommand: 'npm create analog@latest TARGET_DIR',
        desc: 'Angular meta-framework with file-based routing and server-side rendering'
      },
    ],
  },
  {
    name: 'marko',
    display: 'Marko',
    color: magenta,
    variants: [
      {
        name: 'marko-run',
        display: 'Marko Run ↗',
        color: magenta,
        customCommand: 'npm create -- marko@latest --name TARGET_DIR',
        desc: 'eBay\'s UI framework with streaming SSR and component compilation'
      },
    ],
  },
  {
    name: 'nextjs',
    display: 'Next.js',
    color: cyan,
    variants: [
      {
        name: 'custom-nextjs',
        display: 'Next.js ↗',
        color: cyan,
        customCommand: 'npm create next-app@latest TARGET_DIR',
        desc: 'React framework with SSR, API routes, file-based routing, and deployment optimization'
      }
    ]
  },
  {
    name: 'astro',
    display: 'Astro',
    color: magenta,
    variants: [
      {
        name: 'custom-astro',
        display: 'Astro ↗',
        color: magenta,
        customCommand: 'npm create astro@latest TARGET_DIR',
        desc: 'Multi-framework static site generator with partial hydration and islands architecture'
      }
    ]
  },
  {
    name: 'remix',
    display: 'Remix',
    color: blue,
    variants: [
      {
        name: 'custom-remix',
        display: 'Remix ↗',
        color: blue,
        customCommand: 'npx create-remix@latest TARGET_DIR',
        desc: 'Full-stack React framework focusing on web standards and progressive enhancement'
      }
    ]
  },
  {
    name: 'meteor',
    display: 'Meteor.js',
    color: gray,
    variants: [
      {
        name: 'custom-meteor',
        display: 'Meteor.js ↗',
        color: gray,
        desc: 'Full-stack JavaScript platform with real-time data, MongoDB integration, and deployment tools'
      }
    ]
  },
  {
    name: 'gatsby',
    display: 'Gatsby',
    color: magenta,
    variants: [
      {
        name: 'custom-gatsby',
        display: 'Gatsby ↗',
        color: magenta,
        customCommand: 'npm init gatsby@latest TARGET_DIR',
        desc: 'React-based static site generator with GraphQL data layer and plugin ecosystem'
      }
    ]
  },
  {
    name: 'symfony',
    display: 'Symfony',
    color: blue,
    variants: [
      {
        name: 'custom-symfony',
        display: 'Symfony ↗',
        color: blue,
        customCommand: 'symfony new TARGET_DIR',
        desc: 'PHP framework with reusable components, dependency injection, and rapid development tools'
      }
    ]
  },
  {
    name: 'rails',
    display: 'Rails',
    color: redBright,
    variants: [
      {
        name: 'custom-rails',
        display: 'Rails ↗',
        color: redBright,
        customCommand: 'rails new TARGET_DIR',
        desc: 'Ruby web framework with convention over configuration and MVC architecture'
      }
    ]
  },
  {
    name: 'phoenix',
    display: 'Phoenix',
    color: cyan,
    variants: [
      {
        name: 'custom-phoenix',
        display: 'Phoenix ↗',
        color: cyan,
        customCommand: 'mix phx.new TARGET_DIR',
        desc: 'Elixir web framework with real-time features, fault tolerance, and high concurrency'
      }
    ]
  },
  {
    name: 'django',
    display: 'Django',
    color: green,
    variants: [
      {
        name: 'custom-django',
        display: 'Django ↗',
        color: green,
        customCommand: 'django-admin startproject TARGET_DIR',
        desc: 'Python web framework with batteries included, admin interface, and ORM'
      }
    ]
  },
  {
    name: 'flask',
    display: 'Flask',
    color: yellow,
    variants: [
      {
        name: 'custom-flask',
        display: 'Flask ↗',
        color: yellow,
        customCommand: 'flask new TARGET_DIR',
        desc: 'Lightweight Python web framework with flexible architecture and extensibility'
      }
    ]
  },
  {
    name: 'blazor',
    display: 'Blazor',
    color: blueBright,
    variants: [
      {
        name: 'custom-blazor',
        display: 'Blazor ↗',
        color: blueBright,
        customCommand: 'dotnet new blazorwasm -o TARGET_DIR',
        desc: 'C# web framework running in browser via WebAssembly with .NET ecosystem'
      }
    ]
  },
  {
    name: 'hugo',
    display: 'Hugo',
    color: gray,
    variants: [
      {
        name: 'custom-hugo',
        display: 'Hugo ↗',
        color: gray,
        customCommand: 'hugo new site TARGET_DIR',
        desc: 'Fast static site generator written in Go with themes and content management'
      }
    ]
  },
  {
    name: 'others',
    display: 'Others',
    color: reset,
    variants: [
      {
        name: 'create-vite-extra',
        display: 'Extra Vite Starters ↗',
        color: reset,
        customCommand: 'npm create vite-extra@latest TARGET_DIR',
        desc: 'Additional Vite templates and starters for various frameworks and setups'
      },
      {
        name: 'create-electron-vite',
        display: 'Electron ↗',
        color: reset,
        customCommand: 'npm create electron-vite@latest TARGET_DIR',
        desc: 'Desktop applications with Electron, Vite, and modern web technologies'
      },
    ],
  },
];

/**
 * Find variant by name across all frameworks
 * @param frameworks - Array of framework configurations
 * @param variantName - Name of the variant to find
 * @returns Object with variant and framework, or null if not found
 */
export function getVariantByName(frameworks: Framework[], variantName: string): { variant: FrameworkVariant; framework: Framework } | null {
  for (const framework of frameworks) {
    if (framework.variants) {
      const variant = framework.variants.find(v => v.name === variantName);
      if (variant) {
        return { variant, framework };
      }
    }
  }
  return null;
}
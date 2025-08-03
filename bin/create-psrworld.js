#!/usr/bin/env node
'use strict';

var fs = require('node:fs');
var path = require('node:path');
var node_url = require('node:url');
var mri = require('mri');
var prompts = require('@clack/prompts');
var colors = require('picocolors');
var crossSpawn = require('cross-spawn');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var prompts__namespace = /*#__PURE__*/_interopNamespaceDefault(prompts);
var colors__namespace = /*#__PURE__*/_interopNamespaceDefault(colors);

const { blue: blue$2, blueBright: blueBright$1, cyan: cyan$3, green: green$3, greenBright: greenBright$1, magenta: magenta$1, red: red$2, redBright: redBright$1, reset, yellow: yellow$3, gray: gray$1, } = colors__namespace;
/**
 * Framework configurations for project scaffolding
 * Each framework contains variants with different setups and features
 */
const FRAMEWORKS = [
    {
        name: 'vanilla',
        display: 'Vanilla',
        color: yellow$3,
        desc: `Vanilla JavaScript with TypeScript, Vite, and modern tooling setup`,
        variants: [
            {
                name: 'vanilla-ts',
                display: 'TypeScript',
                color: blue$2,
                templateDir: 'template-vanilla-ts',
                desc: 'Vanilla JavaScript with TypeScript, Vite, and modern tooling setup'
            },
            {
                name: 'vanilla',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-vanilla',
                desc: 'Pure vanilla JavaScript with Vite for fast development and building'
            },
        ],
    },
    {
        name: 'vue',
        display: 'Vue',
        color: green$3,
        variants: [
            {
                name: 'vue-ts',
                display: 'TypeScript',
                color: blue$2,
                templateDir: 'template-vue-ts',
                desc: 'Vue 3 with TypeScript, Composition API, and single file components'
            },
            {
                name: 'vue',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-vue',
                desc: 'Vue 3 with JavaScript, Composition API, and reactive components'
            },
            {
                name: 'custom-create-vue',
                display: 'Official Vue Starter ↗',
                color: green$3,
                customCommand: 'npm create vue@latest TARGET_DIR',
                desc: 'Official Vue project generator with customizable features and tooling'
            },
            {
                name: 'custom-nuxt',
                display: 'Nuxt ↗',
                color: greenBright$1,
                customCommand: 'npm exec nuxi init TARGET_DIR',
                desc: 'Full-stack Vue framework with SSR, file-based routing, and auto-imports'
            },
        ],
    },
    {
        name: 'react',
        display: 'React',
        color: cyan$3,
        variants: [
            {
                name: 'react-ts',
                display: 'TypeScript',
                color: blue$2,
                templateDir: 'template-react-ts',
                desc: 'React 18 with TypeScript, JSX, hooks, and modern development setup'
            },
            {
                name: 'react-swc-ts',
                display: 'TypeScript + SWC',
                color: blue$2,
                templateDir: 'template-react-swc-ts',
                desc: 'React with TypeScript and SWC compiler for faster builds and HMR'
            },
            {
                name: 'react',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-react',
                desc: 'React 18 with JavaScript, JSX, and component-based architecture'
            },
            {
                name: 'react-swc',
                display: 'JavaScript + SWC',
                color: yellow$3,
                templateDir: 'template-react-swc',
                desc: 'React with JavaScript and SWC compiler for enhanced performance'
            },
            {
                name: 'custom-react-router',
                display: 'React Router v7 ↗',
                color: cyan$3,
                customCommand: 'npm create react-router@latest TARGET_DIR',
                desc: 'React with declarative routing, nested routes, and navigation management'
            },
            {
                name: 'custom-tanstack-router',
                display: 'TanStack Router ↗',
                color: cyan$3,
                customCommand: 'npm create -- tsrouter-app@latest TARGET_DIR --framework React --interactive',
                desc: 'Type-safe router with search params, loaders, and advanced routing features'
            },
            {
                name: 'redwoodsdk-standard',
                display: 'RedwoodSDK ↗',
                color: red$2,
                customCommand: 'npm exec degit redwoodjs/sdk/starters/standard TARGET_DIR',
                desc: 'Full-stack React framework with GraphQL, Prisma, and JAMstack architecture'
            },
            {
                name: 'rsc',
                display: 'RSC ↗',
                color: magenta$1,
                customCommand: 'npm exec degit vitejs/vite-plugin-react/packages/plugin-rsc/examples/starter TARGET_DIR',
                desc: 'React Server Components with server-side rendering and streaming'
            },
        ],
    },
    {
        name: 'preact',
        display: 'Preact',
        color: magenta$1,
        variants: [
            {
                name: 'preact-ts',
                display: 'TypeScript',
                color: blue$2,
                templateDir: 'template-preact-ts',
                desc: 'Lightweight React alternative with TypeScript and 3KB runtime'
            },
            {
                name: 'preact',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-preact',
                desc: 'Fast 3KB React alternative with same modern API and ecosystem'
            },
            {
                name: 'custom-create-preact',
                display: 'Official Preact Starter ↗',
                color: magenta$1,
                customCommand: 'npm create preact@latest TARGET_DIR',
                desc: 'Official Preact generator with PWA features and optimized builds'
            },
        ],
    },
    {
        name: 'lit',
        display: 'Lit',
        color: redBright$1,
        variants: [
            {
                name: 'lit-ts',
                display: 'TypeScript',
                color: blue$2,
                templateDir: 'template-lit-ts',
                desc: 'Web Components with Lit library, TypeScript, and reactive properties'
            },
            {
                name: 'lit',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-lit',
                desc: 'Simple and fast web components using Lit library and templates'
            },
        ],
    },
    {
        name: 'svelte',
        display: 'Svelte',
        color: red$2,
        variants: [
            {
                name: 'svelte-ts',
                display: 'TypeScript',
                color: blue$2,
                templateDir: 'template-svelte-ts',
                desc: 'Compile-time optimized framework with TypeScript and reactive state'
            },
            {
                name: 'svelte',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-svelte',
                desc: 'No virtual DOM framework with compiled components and reactive updates'
            },
            {
                name: 'custom-svelte-kit',
                display: 'SvelteKit ↗',
                color: red$2,
                customCommand: 'npm exec sv create TARGET_DIR',
                desc: 'Full-stack Svelte framework with SSR, routing, and adapter system'
            },
        ],
    },
    {
        name: 'solid',
        display: 'Solid',
        color: blue$2,
        variants: [
            {
                name: 'solid-ts',
                display: 'TypeScript',
                color: blue$2,
                templateDir: 'template-solid-ts',
                desc: 'Fine-grained reactive framework with TypeScript and JSX syntax'
            },
            {
                name: 'solid',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-solid',
                desc: 'Performant reactive framework with signals and compiled templates'
            },
            {
                name: 'custom-tanstack-router',
                display: 'TanStack Router ↗',
                color: cyan$3,
                customCommand: 'npm create -- tsrouter-app@latest TARGET_DIR --framework Solid --interactive',
                desc: 'Solid with type-safe routing, search params, and data loading'
            },
        ],
    },
    {
        name: 'qwik',
        display: 'Qwik',
        color: blueBright$1,
        variants: [
            {
                name: 'qwik-ts',
                display: 'TypeScript',
                color: blueBright$1,
                templateDir: 'template-qwik-ts',
                desc: 'Resumable framework with TypeScript and instant-on applications'
            },
            {
                name: 'qwik',
                display: 'JavaScript',
                color: yellow$3,
                templateDir: 'template-qwik',
                desc: 'Zero hydration framework with resumable execution and lazy loading'
            },
            {
                name: 'custom-qwik-city',
                display: 'QwikCity ↗',
                color: blueBright$1,
                customCommand: 'npm create qwik@latest basic TARGET_DIR',
                desc: 'Meta-framework for Qwik with routing, layouts, and SSR capabilities'
            },
        ],
    },
    {
        name: 'angular',
        display: 'Angular',
        color: red$2,
        variants: [
            {
                name: 'custom-angular',
                display: 'Angular ↗',
                color: red$2,
                customCommand: 'npm exec @angular/cli@latest new TARGET_DIR',
                desc: 'Full-featured framework with TypeScript, dependency injection, and CLI tools'
            },
            {
                name: 'custom-analog',
                display: 'Analog ↗',
                color: yellow$3,
                customCommand: 'npm create analog@latest TARGET_DIR',
                desc: 'Angular meta-framework with file-based routing and server-side rendering'
            },
        ],
    },
    {
        name: 'marko',
        display: 'Marko',
        color: magenta$1,
        variants: [
            {
                name: 'marko-run',
                display: 'Marko Run ↗',
                color: magenta$1,
                customCommand: 'npm create -- marko@latest --name TARGET_DIR',
                desc: 'eBay\'s UI framework with streaming SSR and component compilation'
            },
        ],
    },
    {
        name: 'nextjs',
        display: 'Next.js',
        color: cyan$3,
        variants: [
            {
                name: 'custom-nextjs',
                display: 'Next.js ↗',
                color: cyan$3,
                customCommand: 'npm create next-app@latest TARGET_DIR',
                desc: 'React framework with SSR, API routes, file-based routing, and deployment optimization'
            }
        ]
    },
    {
        name: 'astro',
        display: 'Astro',
        color: magenta$1,
        variants: [
            {
                name: 'custom-astro',
                display: 'Astro ↗',
                color: magenta$1,
                customCommand: 'npm create astro@latest TARGET_DIR',
                desc: 'Multi-framework static site generator with partial hydration and islands architecture'
            }
        ]
    },
    {
        name: 'remix',
        display: 'Remix',
        color: blue$2,
        variants: [
            {
                name: 'custom-remix',
                display: 'Remix ↗',
                color: blue$2,
                customCommand: 'npx create-remix@latest TARGET_DIR',
                desc: 'Full-stack React framework focusing on web standards and progressive enhancement'
            }
        ]
    },
    {
        name: 'meteor',
        display: 'Meteor.js',
        color: gray$1,
        variants: [
            {
                name: 'custom-meteor',
                display: 'Meteor.js ↗',
                color: gray$1,
                desc: 'Full-stack JavaScript platform with real-time data, MongoDB integration, and deployment tools'
            }
        ]
    },
    {
        name: 'gatsby',
        display: 'Gatsby',
        color: magenta$1,
        variants: [
            {
                name: 'custom-gatsby',
                display: 'Gatsby ↗',
                color: magenta$1,
                customCommand: 'npm init gatsby@latest TARGET_DIR',
                desc: 'React-based static site generator with GraphQL data layer and plugin ecosystem'
            }
        ]
    },
    {
        name: 'symfony',
        display: 'Symfony',
        color: blue$2,
        variants: [
            {
                name: 'custom-symfony',
                display: 'Symfony ↗',
                color: blue$2,
                customCommand: 'symfony new TARGET_DIR',
                desc: 'PHP framework with reusable components, dependency injection, and rapid development tools'
            }
        ]
    },
    {
        name: 'rails',
        display: 'Rails',
        color: redBright$1,
        variants: [
            {
                name: 'custom-rails',
                display: 'Rails ↗',
                color: redBright$1,
                customCommand: 'rails new TARGET_DIR',
                desc: 'Ruby web framework with convention over configuration and MVC architecture'
            }
        ]
    },
    {
        name: 'phoenix',
        display: 'Phoenix',
        color: cyan$3,
        variants: [
            {
                name: 'custom-phoenix',
                display: 'Phoenix ↗',
                color: cyan$3,
                customCommand: 'mix phx.new TARGET_DIR',
                desc: 'Elixir web framework with real-time features, fault tolerance, and high concurrency'
            }
        ]
    },
    {
        name: 'django',
        display: 'Django',
        color: green$3,
        variants: [
            {
                name: 'custom-django',
                display: 'Django ↗',
                color: green$3,
                customCommand: 'django-admin startproject TARGET_DIR',
                desc: 'Python web framework with batteries included, admin interface, and ORM'
            }
        ]
    },
    {
        name: 'flask',
        display: 'Flask',
        color: yellow$3,
        variants: [
            {
                name: 'custom-flask',
                display: 'Flask ↗',
                color: yellow$3,
                customCommand: 'flask new TARGET_DIR',
                desc: 'Lightweight Python web framework with flexible architecture and extensibility'
            }
        ]
    },
    {
        name: 'blazor',
        display: 'Blazor',
        color: blueBright$1,
        variants: [
            {
                name: 'custom-blazor',
                display: 'Blazor ↗',
                color: blueBright$1,
                customCommand: 'dotnet new blazorwasm -o TARGET_DIR',
                desc: 'C# web framework running in browser via WebAssembly with .NET ecosystem'
            }
        ]
    },
    {
        name: 'hugo',
        display: 'Hugo',
        color: gray$1,
        variants: [
            {
                name: 'custom-hugo',
                display: 'Hugo ↗',
                color: gray$1,
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
function getVariantByName(frameworks, variantName) {
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

const { blue: blue$1, green: green$2, yellow: yellow$2, } = colors__namespace;
const TAILWINDFRAMEWORKS = [
    {
        name: 'tailwindcss',
        display: 'Tailwind CSS',
        color: yellow$2,
        variants: [
            {
                name: 'tailwind-v4',
                display: 'Tailwind V4',
                color: green$2,
                customCommand: 'PKG_MANAGER install tailwindcss @tailwindcss/cli',
                templateSuffix: 'v4',
                desc: 'Tailwind CSS v4 with new CSS-first configuration and Lightning CSS engine'
            },
            {
                name: 'tailwind-v3',
                display: 'Tailwind V3',
                color: blue$1,
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
function getTailwindTemplateDir(baseTemplateDir, tailwindVariant) {
    if (!tailwindVariant)
        return baseTemplateDir;
    const tailwindConfig = TAILWINDFRAMEWORKS[0].variants.find(v => v.name === tailwindVariant);
    if (!tailwindConfig)
        return baseTemplateDir;
    // Convert template-react-ts to tw-template-react-ts-v3 or tw-template-react-ts-v4
    return `tw-${baseTemplateDir}-${tailwindConfig.templateSuffix}`;
}

function formatTargetDir(targetDir) {
    return targetDir?.trim().replace(/\/+$/g, '') || '';
}
function writeTemplate(src, dest, projectName) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const file of fs.readdirSync(src)) {
            const srcFile = path.resolve(src, file);
            const destFile = path.resolve(dest, file);
            writeTemplate(srcFile, destFile, projectName);
        }
    }
    else {
        let content = fs.readFileSync(src, 'utf-8');
        // Replace template variables
        content = content.replace(/{{projectName}}/g, projectName);
        fs.writeFileSync(dest, content);
    }
}
function isEmpty(path) {
    const files = fs.readdirSync(path);
    return files.length === 0 || (files.length === 1 && files[0] === '.git');
}
function emptyDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    for (const file of fs.readdirSync(dir)) {
        if (file === '.git') {
            continue;
        }
        fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
    }
}

const { blue, blueBright, cyan: cyan$2, green: green$1, greenBright, magenta, red: red$1, redBright, yellow: yellow$1, gray, } = colors__namespace;
const helpMessage = `\
Usage: create-mycustomlib [OPTION]... [DIRECTORY]

Create a new project from a template.
With no arguments, start the CLI in interactive mode.

Options:
  -h, --help                 show this help message
  -t, --template NAME        use a specific template
  -y, --yes                  use default options (vanilla-ts with Tailwind v4)

Available templates:
${yellow$1('vanilla-ts     vanilla')}
${green$1('vue-ts         vue')}
${cyan$2('react-ts       react')}
${cyan$2('react-swc-ts   react-swc')}
${magenta('preact-ts      preact')}
${redBright('lit-ts         lit')}
${red$1('svelte-ts      svelte')}
${blue('solid-ts       solid')}
${blueBright('qwik-ts        qwik')}
${cyan$2('custom-nextjs')}
${greenBright('nuxt          nuxt')}
${magenta('astro          astro')}
${blue('remix          remix')}
${gray('meteor         meteor')}
${magenta('gatsby         gatsby')}
${blue('symfony        symfony')}
${redBright('rails          rails')}
${cyan$2('phoenix        phoenix')}
${green$1('django         django')}
${yellow$1('flask          flask')}
${blueBright('blazor         blazor')}
${gray('hugo           hugo')}`;
function printHelp() {
    console.log(helpMessage);
}
function pkgFromUserAgent(userAgent) {
    if (!userAgent)
        return undefined;
    const pkgSpec = userAgent.split(' ')[0];
    const pkgSpecArr = pkgSpec.split('/');
    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1],
    };
}

const { cyan: cyan$1 } = colors__namespace;
function executeCustomCommand(command, targetDir, selectedOptions = null) {
    return new Promise((resolve, reject) => {
        // Replace TARGET_DIR placeholder with actual target directory
        const finalCommand = command.replace('TARGET_DIR', targetDir);
        // Parse command and arguments
        const [cmd, ...args] = finalCommand.split(' ');
        console.log(`\nExecuting: ${cyan$1(finalCommand)}\n`);
        const child = crossSpawn.spawn(cmd, args, {
            stdio: 'inherit',
            shell: process.platform === 'win32'
        });
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command failed with exit code ${code}`));
            }
            else {
                resolve();
            }
        });
        child.on('error', (error) => {
            reject(error);
        });
    });
}

const { cyan, green, red, yellow } = colors;
const __dirname$1 = path.dirname(node_url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('create-psrworld.js', document.baseURI).href))));
// Get template directory path - adjust for the new structure
const templateDir = path.resolve(__dirname$1, '../../templates');
function cancel() {
    prompts__namespace.cancel('Operation cancelled');
    return process.exit(0);
}
async function handleTemplateCreation(selectedVariant, framework, projectName, templateName, installDeps = true, addTailwind = false, tailwindVariant = null) {
    if (selectedVariant?.customCommand) {
        // Handle custom command execution
        path.join(process.cwd(), projectName);
        try {
            await executeCustomCommand(selectedVariant.customCommand, projectName, null);
            prompts__namespace.outro(green('✅ Project created successfully using custom command!'));
        }
        catch (error) {
            console.error(red('✖ Custom command failed:'), error.message);
            process.exit(1);
        }
        return;
    }
    // Handle regular template-based scaffolding
    const root = path.join(process.cwd(), projectName);
    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    }
    console.log(`\nScaffolding project in ${root}...`);
    // Determine the template path - use Tailwind template if specified
    let templatePath;
    if (addTailwind && tailwindVariant && selectedVariant?.templateDir) {
        // Use Tailwind-integrated template
        const tailwindTemplateDir = getTailwindTemplateDir(selectedVariant.templateDir, tailwindVariant);
        templatePath = path.resolve(templateDir, tailwindTemplateDir);
        // Fallback to regular template if Tailwind template doesn't exist
        if (!fs.existsSync(templatePath)) {
            console.log(yellow(`Tailwind template not found at ${tailwindTemplateDir}, using regular template...`));
            templatePath = path.resolve(templateDir, selectedVariant.templateDir || templateName);
        }
    }
    else if (selectedVariant?.templateDir) {
        // Use specified template directory
        templatePath = path.resolve(templateDir, selectedVariant.templateDir);
    }
    else {
        // Use default template name
        templatePath = path.resolve(templateDir, templateName);
    }
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template not found at ${templatePath}!`);
    }
    // Copy template files and replace variables
    writeTemplate(templatePath, root, projectName);
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : 'npm';
    // Install dependencies if requested
    if (installDeps) {
        console.log(cyan(`\nInstalling dependencies via ${pkgManager}...`));
        try {
            // Change to project directory
            process.chdir(root);
            const installCommand = pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`;
            await executeCustomCommand(installCommand, '.');
            console.log(green('✅ Dependencies installed successfully!'));
        }
        catch (error) {
            console.error(yellow('⚠️  Dependency installation failed, but you can run it manually:'));
            console.error(`  cd ${path.relative(process.cwd(), root)}`);
            console.error(`  ${pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`}`);
        }
    }
    // Install Tailwind CSS if requested (only for non-integrated templates)
    if (addTailwind && tailwindVariant && selectedVariant?.templateDir) {
        const tailwindTemplateDir = getTailwindTemplateDir(selectedVariant.templateDir, tailwindVariant);
        const tailwindTemplatePath = path.resolve(templateDir, tailwindTemplateDir);
        // Only run Tailwind installation if we're not using an integrated template
        if (!fs.existsSync(tailwindTemplatePath)) {
            console.log(cyan('\nSetting up Tailwind CSS...'));
            try {
                // Ensure we're in the project directory
                process.chdir(root);
                const tailwindConfig = TAILWINDFRAMEWORKS[0].variants.find(v => v.name === tailwindVariant);
                if (tailwindConfig) {
                    // Replace PKG_MANAGER placeholder with actual package manager
                    const tailwindCommand = tailwindConfig.customCommand.replace(/PKG_MANAGER/g, pkgManager);
                    await executeCustomCommand(tailwindCommand, '.');
                    console.log(green('✅ Tailwind CSS setup completed!'));
                }
            }
            catch (error) {
                console.error(yellow('⚠️  Tailwind CSS setup failed, but you can run it manually:'));
                console.error(`  cd ${projectName}`);
                const tailwindConfig = TAILWINDFRAMEWORKS[0].variants.find(v => v.name === tailwindVariant);
                if (tailwindConfig) {
                    const tailwindCommand = tailwindConfig.customCommand.replace(/PKG_MANAGER/g, pkgManager);
                    console.error(`  ${tailwindCommand}`);
                }
            }
        }
        else {
            console.log(green('✅ Using Tailwind-integrated template!'));
        }
    }
    console.log(`\nDone. Now run:\n`);
    // Always show cd command for the project directory
    console.log(`  cd ${projectName}`);
    // Show install command only if dependencies weren't installed
    if (!installDeps) {
        switch (pkgManager) {
            case 'yarn':
                console.log('  yarn');
                break;
            default:
                console.log(`  ${pkgManager} install`);
                break;
        }
    }
    // Show dev command
    switch (pkgManager) {
        case 'yarn':
            console.log('  yarn dev');
            break;
        default:
            console.log(`  ${pkgManager} run dev`);
            break;
    }
    console.log();
    prompts__namespace.outro(green('✅ Project created successfully!'));
}
// Get default selections for --yes flag
function getDefaultSelections() {
    return {
        framework: 'vanilla', // Default to Vanilla
        variant: 'vanilla-ts', // Default to TypeScript variant
        installDeps: true,
        addTailwind: true,
        tailwindVariant: 'tailwind-v4' // Default to Tailwind V4
    };
}
async function init() {
    const argv = mri(process.argv.slice(2), {
        string: ['_'],
        boolean: ['yes', 'y'],
        alias: {
            h: 'help',
            t: 'template',
            y: 'yes'
        }
    });
    const argTargetDir = formatTargetDir(argv._[0]);
    const cliTemplate = argv.template;
    const useDefaults = argv.yes || argv.y;
    // Check for help flag
    if (argv.help || argv.h) {
        printHelp();
        return;
    }
    const defaultTargetDir = 'my-project';
    let result = {};
    prompts__namespace.intro(cyan('🚀 Create Custom Project'));
    // 1. Get project name and target dir
    let targetDir = argTargetDir;
    if (!targetDir) {
        if (useDefaults) {
            targetDir = defaultTargetDir;
            console.log(`Project name: ${cyan(targetDir)} ${yellow('(default)')}`);
        }
        else {
            const projectName = await prompts__namespace.text({
                message: 'Project name:',
                defaultValue: defaultTargetDir,
                placeholder: defaultTargetDir,
                validate: (value) => {
                    return value.length === 0 || formatTargetDir(value).length > 0
                        ? undefined
                        : 'Invalid project name';
                },
            });
            if (prompts__namespace.isCancel(projectName))
                return cancel();
            targetDir = formatTargetDir(projectName);
        }
    }
    // If template is provided via CLI, use it directly
    if (cliTemplate) {
        const result = getVariantByName(FRAMEWORKS, cliTemplate);
        if (!result) {
            console.error(red(`✖ Template "${cliTemplate}" not found!`));
            console.log('\nAvailable templates:');
            FRAMEWORKS.forEach(framework => {
                if (framework.variants) {
                    framework.variants.forEach(variant => {
                        console.log(`  ${variant.name}`);
                    });
                }
            });
            process.exit(1);
        }
        const { variant: selectedVariant, framework } = result;
        const projectName = targetDir || defaultTargetDir;
        // Handle directory overwrite check for CLI template
        const root = path.join(process.cwd(), projectName);
        if (fs.existsSync(root) && !isEmpty(root)) {
            if (useDefaults) {
                console.log(`Directory ${yellow(projectName)} is not empty. Removing existing files... ${yellow('(--yes)')}`);
                emptyDir(root);
            }
            else {
                const shouldOverwrite = await prompts__namespace.confirm({
                    message: `Directory ${yellow(projectName)} is not empty. Remove existing files and continue?`,
                });
                if (prompts__namespace.isCancel(shouldOverwrite) || !shouldOverwrite) {
                    return cancel();
                }
                emptyDir(root);
            }
        }
        // Use defaults for template-based creation when --yes is used
        const defaults = useDefaults ? getDefaultSelections() : { installDeps: true, addTailwind: false, tailwindVariant: null };
        await handleTemplateCreation(selectedVariant, framework, projectName, cliTemplate, defaults.installDeps, defaults.addTailwind, defaults.tailwindVariant);
        return;
    }
    // Handle --yes flag with default selections
    if (useDefaults) {
        const defaults = getDefaultSelections();
        const projectName = targetDir || defaultTargetDir;
        // Handle directory overwrite check
        const root = path.join(process.cwd(), projectName);
        if (fs.existsSync(root) && !isEmpty(root)) {
            console.log(`Directory ${yellow(projectName)} is not empty. Removing existing files... ${yellow('(--yes)')}`);
            emptyDir(root);
        }
        // Display selected defaults
        console.log(`Selected framework: ${cyan('Vanilla')} ${yellow('(default)')}`);
        console.log(`Selected variant: ${cyan('TypeScript')} ${yellow('(default)')}`);
        console.log(`Add Tailwind CSS: ${cyan('Yes')} ${yellow('(default)')}`);
        console.log(`Tailwind version: ${cyan('Tailwind V4')} ${yellow('(default)')}`);
        console.log(`Install dependencies: ${cyan('Yes')} ${yellow('(default)')}`);
        // Get the selected variant and framework
        const selectedResult = getVariantByName(FRAMEWORKS, defaults.variant);
        const selectedVariant = selectedResult?.variant || null;
        const selectedFramework = selectedResult?.framework || null;
        await handleTemplateCreation(selectedVariant, selectedFramework, projectName, defaults.variant, defaults.installDeps, defaults.addTailwind, defaults.tailwindVariant);
        return;
    }
    try {
        result = await prompts__namespace.group({
            shouldOverwrite: () => {
                const dir = path.resolve(targetDir || defaultTargetDir);
                if (!fs.existsSync(dir) || isEmpty(dir)) {
                    return;
                }
                return prompts__namespace.confirm({
                    message: `Directory ${yellow(targetDir || defaultTargetDir)} is not empty. Remove existing files and continue?`,
                });
            },
            overwriteChecker: ({ results }) => {
                if (results.shouldOverwrite === false) {
                    throw new Error(red('✖') + ' Operation cancelled');
                }
                return;
            },
            framework: () => prompts__namespace.select({
                message: 'Select a framework:',
                initialValue: 'vanilla',
                options: FRAMEWORKS.map((framework) => ({
                    value: framework.name,
                    label: framework.color(framework.display || framework.name),
                    hint: framework.desc && framework.desc.trim() !== '' ? framework.desc : undefined,
                })),
            }),
            variant: ({ results }) => {
                const framework = FRAMEWORKS.find((f) => f.name === results.framework);
                if (!framework?.variants) {
                    return;
                }
                return prompts__namespace.select({
                    message: 'Select a variant:',
                    initialValue: framework.variants[0].name,
                    options: framework.variants.map((variant) => ({
                        value: variant.name,
                        label: variant.color(variant.display || variant.name),
                        hint: variant.desc && variant.desc.trim() !== '' ? variant.desc : undefined,
                    })),
                });
            },
            addTailwind: ({ results }) => {
                // Only show Tailwind prompt if it's not a custom command framework (those handle their own setup)
                const framework = FRAMEWORKS.find((f) => f.name === results.framework);
                const variant = framework?.variants?.find(v => v.name === results.variant);
                if (variant?.customCommand) {
                    return; // Skip Tailwind prompt for custom command frameworks
                }
                return prompts__namespace.confirm({
                    message: 'Add Tailwind CSS?',
                    initialValue: true,
                });
            },
            tailwindVariant: ({ results }) => {
                if (!results.addTailwind) {
                    return;
                }
                return prompts__namespace.select({
                    message: 'Select Tailwind CSS version:',
                    initialValue: 'tailwind-v4',
                    options: TAILWINDFRAMEWORKS[0].variants.map((variant) => ({
                        value: variant.name,
                        label: variant.color(variant.display),
                        hint: variant.desc && variant.desc.trim() !== '' ? variant.desc : undefined,
                    })),
                });
            },
            installDeps: () => {
                const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
                const pkgManager = pkgInfo ? pkgInfo.name : 'npm';
                return prompts__namespace.confirm({
                    message: `Installing dependencies via ${pkgManager}?`,
                    initialValue: true,
                });
            },
        }, {
            onCancel: () => {
                throw new Error(red('✖') + ' Operation cancelled');
            },
        });
    }
    catch (cancelled) {
        console.log(cancelled.message);
        return;
    }
    const { framework, variant, shouldOverwrite, installDeps, addTailwind, tailwindVariant } = result;
    const projectName = targetDir || defaultTargetDir;
    const templateName = variant || framework;
    // Get the selected variant and framework
    const selectedResult = getVariantByName(FRAMEWORKS, templateName);
    const selectedVariant = selectedResult?.variant || null;
    const selectedFramework = selectedResult?.framework || null;
    await handleTemplateCreation(selectedVariant, selectedFramework, projectName, templateName, installDeps, addTailwind, tailwindVariant);
}
init().catch((e) => {
    console.error(e);
});

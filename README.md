# Create psrworld

A TypeScript-powered project scaffolding tool with support for multiple frameworks and dual CommonJS/ESM build support.

## Features

- 🚀 **Multiple Frameworks** - React, Vue, Svelte, Angular, Next.js, and many more
- 📦 **Dual Package** - CommonJS and ESM builds
- 🔧 **TypeScript First** - Full TypeScript support with type definitions
- 🎨 **Tailwind CSS** - Optional Tailwind CSS integration (v3 & v4)
- ✨ **Interactive CLI** - Beautiful prompts powered by @clack/prompts
- 🛠️ **Modern Tooling** - Rollup bundling, Jest testing, ESLint + Prettier
- 📋 **Templates** - Pre-configured templates for rapid development

## Installation

### Global Installation (Recommended)

```bash
npm install -g create-psrworld
```

### Usage without Installation

```bash
npx create-psrworld
```

## Usage

### Interactive Mode

```bash
create-psrworld
```

### Quick Start with Defaults

```bash
# Creates a Vanilla TypeScript project with Tailwind v4
create-psrworld my-project --yes
```

### Specify Template

```bash
create-psrworld my-react-app --template react-ts
```

### Available Commands

```bash
create-psrworld [project-name] [options]

Options:
  -h, --help              Show help
  -t, --template <name>   Use a specific template
  -y, --yes              Use default options (vanilla-ts with Tailwind v4)
```

## Available Templates

### Frontend Frameworks

- **Vanilla** - `vanilla`, `vanilla-ts`
- **React** - `react`, `react-ts`, `react-swc`, `react-swc-ts`
- **Vue** - `vue`, `vue-ts`
- **Svelte** - `svelte`, `svelte-ts`
- **Preact** - `preact`, `preact-ts`
- **Solid** - `solid`, `solid-ts`
- **Lit** - `lit`, `lit-ts`
- **Qwik** - `qwik`, `qwik-ts`

### Meta-Frameworks

- **Next.js** - `custom-nextjs`
- **Nuxt** - `custom-nuxt`
- **SvelteKit** - `custom-svelte-kit`
- **Astro** - `custom-astro`
- **Remix** - `custom-remix`
- **Gatsby** - `custom-gatsby`

### Backend Frameworks

- **Node.js/Express** - Coming soon
- **Django** - `custom-django`
- **Flask** - `custom-flask`
- **Rails** - `custom-rails`
- **Phoenix** - `custom-phoenix`
- **Symfony** - `custom-symfony`

### Other

- **Angular** - `custom-angular`
- **Blazor** - `custom-blazor`
- **Hugo** - `custom-hugo`
- **Electron** - `create-electron-vite`

## Examples

### Create a React TypeScript project

```bash
create-psrworld my-react-app --template react-ts
```

### Create with Tailwind CSS

The CLI will prompt you to add Tailwind CSS and choose between v3 and v4:

```bash
create-psrworld my-app
# Select your framework
# Choose "Yes" for Tailwind CSS
# Select Tailwind version (v3 or v4)
```

### Use defaults for quick setup

```bash
create-psrworld my-project --yes
```

This creates a Vanilla TypeScript project with Tailwind CSS v4 and installs dependencies automatically.

## Development

### Setup

```bash
git clone <repository-url>
cd create-psrworld
npm install
npm run build
```

### Available Scripts

- `npm run build` - Build the CLI tool and library
- `npm run dev` - Watch mode for development
- `npm test` - Run tests
- `npm run lint` - Lint TypeScript files
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check without emitting

### Project Structure

```
├── src/
│   ├── cli/
│   │   └── index.ts          # CLI entry point
│   ├── config/
│   │   ├── frameworks.ts     # Framework configurations
│   │   └── tailwindframeworks.ts # Tailwind configurations
│   ├── utils/
│   │   ├── files.ts          # File utilities
│   │   ├── helpers.ts        # Helper functions
│   │   └── commands.ts       # Command execution
│   ├── types.ts              # TypeScript definitions
│   └── index.ts              # Library entry point
├── tests/                    # Test files
├── templates/                # Project templates
├── bin/                      # CLI executable (built)
├── dist/                     # Built library files
└── rollup.config.*.js        # Build configurations
```

## Adding New Templates

1. Create a new template directory in `templates/`
2. Add the framework configuration to `src/config/frameworks.ts`
3. Update tests and documentation
4. Submit a pull request

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT - see [LICENSE](LICENSE) file for details

## Changelog

### 1.0.0

- Initial release
- TypeScript CLI tool with interactive prompts
- Support for 15+ frameworks and meta-frameworks
- Dual CommonJS/ESM package support
- Tailwind CSS integration (v3 & v4)
- Comprehensive test suite
- Modern development toolchain
- Event-driven architecture
- Comprehensive test suite
- Utility functions for common operations
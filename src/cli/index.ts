import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mri from 'mri';
import * as prompts from '@clack/prompts';
import colors from 'picocolors';

// Import utilities and config
import { 
  FRAMEWORKS, 
  getVariantByName 
} from '../config/frameworks';
  
import { 
  TAILWINDFRAMEWORKS, 
  getTailwindTemplateDir 
} from '../config/tailwindframeworks';
  
import { 
  formatTargetDir, 
  isEmpty, 
  emptyDir, 
  writeTemplate 
} from '../utils/files';
  
import { pkgFromUserAgent, printHelp } from '../utils/helpers';

import { executeCustomCommand } from '../utils/commands';

import type { 
  Framework, 
  FrameworkVariant, 
  SelectedOptions 
} from '../types';

const {
  cyan,
  green,
  red,
  yellow 
} = colors;
  
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get template directory path - adjust for the new structure
const templateDir = path.resolve(__dirname, '../../templates');

function cancel(): never {
  prompts.cancel('Operation cancelled');
  return process.exit(0);
}

async function handleTemplateCreation(
  selectedVariant: FrameworkVariant | null,
  framework: Framework | null,
  projectName: string,
  templateName: string,
  installDeps: boolean = true,
  addTailwind: boolean = false,
  tailwindVariant: string | null = null
): Promise<void> {
  if (selectedVariant?.customCommand) {
    // Handle custom command execution
    const root = path.join(process.cwd(), projectName);
    
    try {
      await executeCustomCommand(
        selectedVariant.customCommand,
        projectName,
        null
      );
      
      prompts.outro(green('✅ Project created successfully using custom command!'));
    } catch (error) {
      console.error(red('✖ Custom command failed:'), (error as Error).message);
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
  let templatePath: string;
  
  if (addTailwind && tailwindVariant && selectedVariant?.templateDir) {
    // Use Tailwind-integrated template
    const tailwindTemplateDir = getTailwindTemplateDir(
      selectedVariant.templateDir,
      tailwindVariant
    );
    templatePath = path.resolve(templateDir, tailwindTemplateDir);
    
    // Fallback to regular template if Tailwind template doesn't exist
    if (!fs.existsSync(templatePath)) {
      console.log(yellow(`Tailwind template not found at ${tailwindTemplateDir}, using regular template...`));
      templatePath = path.resolve(
        templateDir, 
        selectedVariant.templateDir || templateName
      );
    }
  } else if (selectedVariant?.templateDir) {
    // Use specified template directory
    templatePath = path.resolve(templateDir, selectedVariant.templateDir);
  } else {
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
    } catch (error) {
      console.error(yellow('⚠️  Dependency installation failed, but you can run it manually:'));
      console.error(`  cd ${path.relative(process.cwd(), root)}`);
      console.error(`  ${pkgManager === 'yarn' ? 'yarn' : `${pkgManager} install`}`);
    }
  }

  // Install Tailwind CSS if requested (only for non-integrated templates)
  if (addTailwind && tailwindVariant && selectedVariant?.templateDir) {
    
    const tailwindTemplateDir = getTailwindTemplateDir(
      selectedVariant.templateDir,
      tailwindVariant
    );
    
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
      } catch (error) {
        console.error(yellow('⚠️  Tailwind CSS setup failed, but you can run it manually:'));
        console.error(`  cd ${projectName}`);
        const tailwindConfig = TAILWINDFRAMEWORKS[0].variants.find(v => v.name === tailwindVariant);
        if (tailwindConfig) {
          const tailwindCommand = tailwindConfig.customCommand.replace(/PKG_MANAGER/g, pkgManager);
          console.error(`  ${tailwindCommand}`);
        }
      }
    } else {
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

  prompts.outro(green('✅ Project created successfully!'));
}

// Get default selections for --yes flag
function getDefaultSelections(): SelectedOptions {
  return {
    framework: 'vanilla', // Default to Vanilla
    variant: 'vanilla-ts', // Default to TypeScript variant
    installDeps: true,
    addTailwind: true,
    tailwindVariant: 'tailwind-v4' // Default to Tailwind V4
  };
}

async function init(): Promise<void> {
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
  const cliTemplate = argv.template as string | undefined;
  const useDefaults = argv.yes || argv.y;

  // Check for help flag
  if (argv.help || argv.h) {
    printHelp();
    return;
  }

  const defaultTargetDir = 'my-project';

  let result: any = {};

  prompts.intro(cyan('🚀 Create Custom Project'));

  // 1. Get project name and target dir
  let targetDir = argTargetDir;
  if (!targetDir) {
    if (useDefaults) {
      targetDir = defaultTargetDir;
      console.log(`Project name: ${cyan(targetDir)} ${yellow('(default)')}`);
    } else {
      const projectName = await prompts.text({
        message: 'Project name:',
        defaultValue: defaultTargetDir,
        placeholder: defaultTargetDir,
        validate: (value: string) => {
          return value.length === 0 || formatTargetDir(value).length > 0
            ? undefined
            : 'Invalid project name';
        },
      });
      if (prompts.isCancel(projectName)) return cancel();
      targetDir = formatTargetDir(projectName as string);
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
      } else {
        const shouldOverwrite = await prompts.confirm({
          message: `Directory ${yellow(projectName)} is not empty. Remove existing files and continue?`,
        });
        if (prompts.isCancel(shouldOverwrite) || !shouldOverwrite) {
          return cancel();
        }
        emptyDir(root);
      }
    }

    // Use defaults for template-based creation when --yes is used
    const defaults = useDefaults ? getDefaultSelections() : { installDeps: true, addTailwind: false, tailwindVariant: null };
    await handleTemplateCreation(
      selectedVariant, 
      framework, 
      projectName, 
      cliTemplate, 
      defaults.installDeps, 
      defaults.addTailwind, 
      defaults.tailwindVariant
    );
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
    const selectedResult = getVariantByName(FRAMEWORKS, defaults.variant!);
    const selectedVariant = selectedResult?.variant || null;
    const selectedFramework = selectedResult?.framework || null;
    
    await handleTemplateCreation(
      selectedVariant, 
      selectedFramework, 
      projectName, 
      defaults.variant!, 
      defaults.installDeps!, 
      defaults.addTailwind!, 
      defaults.tailwindVariant!
    );
    return;
  }

  try {
    result = await prompts.group(
      {
        shouldOverwrite: () => {
          const dir = path.resolve(targetDir || defaultTargetDir);
          if (!fs.existsSync(dir) || isEmpty(dir)) {
            return;
          }
          return prompts.confirm({
            message: `Directory ${yellow(targetDir || defaultTargetDir)} is not empty. Remove existing files and continue?`,
          });
        },
        overwriteChecker: ({ results }: any) => {
          if (results.shouldOverwrite === false) {
            throw new Error(red('✖') + ' Operation cancelled');
          }
          return;
        },
        framework: () =>
          prompts.select({
            message: 'Select a framework:',
            initialValue: 'vanilla',
            options: FRAMEWORKS.map((framework) => ({
              value: framework.name,
              label: framework.color(framework.display || framework.name),
              hint: framework.desc && framework.desc.trim() !== '' ? framework.desc : undefined,
            })),
          }),
        variant: ({ results }: any) => {
          const framework = FRAMEWORKS.find((f) => f.name === results.framework);
          if (!framework?.variants) {
            return;
          }
          return prompts.select({
            message: 'Select a variant:',
            initialValue: framework.variants[0].name,
            options: framework.variants.map((variant) => ({
              value: variant.name,
              label: variant.color(variant.display || variant.name),
              hint: variant.desc && variant.desc.trim() !== '' ? variant.desc : undefined,
            })),
          });
        },
        addTailwind: ({ results }: any) => {
          // Only show Tailwind prompt if it's not a custom command framework (those handle their own setup)
          const framework = FRAMEWORKS.find((f) => f.name === results.framework);
          const variant = framework?.variants?.find(v => v.name === results.variant);
          
          if (variant?.customCommand) {
            return; // Skip Tailwind prompt for custom command frameworks
          }
          
          return prompts.confirm({
            message: 'Add Tailwind CSS?',
            initialValue: true,
          });
        },
        tailwindVariant: ({ results }: any) => {
          if (!results.addTailwind) {
            return;
          }
          return prompts.select({
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
          return prompts.confirm({
            message: `Installing dependencies via ${pkgManager}?`,
            initialValue: true,
          });
        },
      },
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled');
        },
      }
    );
  } catch (cancelled) {
    console.log((cancelled as Error).message);
    return;
  }

  const { framework, variant, shouldOverwrite, installDeps, addTailwind, tailwindVariant } = result;
  const projectName = targetDir || defaultTargetDir;
  const templateName = variant || framework;

  // Get the selected variant and framework
  const selectedResult = getVariantByName(FRAMEWORKS, templateName);
  const selectedVariant = selectedResult?.variant || null;
  const selectedFramework = selectedResult?.framework || null;
  
  await handleTemplateCreation(
    selectedVariant, 
    selectedFramework, 
    projectName, 
    templateName, 
    installDeps, 
    addTailwind, 
    tailwindVariant
  );
}

init().catch((e) => {
  console.error(e);
});
/**
 * Type definitions for the project scaffolding tool
 */

export interface FrameworkVariant {
  name: string;
  display: string;
  color: (text: string) => string;
  templateDir?: string;
  customCommand?: string;
  templateSuffix?: string;
  desc: string;
}

export interface Framework {
  name: string;
  display: string;
  color: (text: string) => string;
  desc?: string;
  variants: FrameworkVariant[];
}

export interface TailwindVariant {
  name: string;
  display: string;
  color: (text: string) => string;
  customCommand: string;
  templateSuffix: string;
  desc: string;
}

export interface TailwindFramework {
  name: string;
  display: string;
  color: (text: string) => string;
  variants: TailwindVariant[];
}

export interface PackageInfo {
  name: string;
  version: string;
}

export interface SelectedOptions {
  framework?: string;
  variant?: string;
  installDeps?: boolean;
  addTailwind?: boolean;
  tailwindVariant?: string;
}

export interface TemplateOptions {
  selectedVariant: FrameworkVariant | null;
  framework: Framework | null;
  projectName: string;
  templateName: string;
  installDeps?: boolean;
  addTailwind?: boolean;
  tailwindVariant?: string | null;
}
import fs from 'node:fs';
import path from 'node:path';

export function formatTargetDir(targetDir?: string): string {
  return targetDir?.trim().replace(/\/+$/g, '') || '';
}

export function copy(src: string, dest: string): void {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

export function isValidPackageName(projectName: string): boolean {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}

export function toValidPackageName(projectName: string): string {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple consecutive hyphens with single hyphen
}

export function copyDir(srcDir: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

export function writeTemplate(src: string, dest: string, projectName: string): void {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      const srcFile = path.resolve(src, file);
      const destFile = path.resolve(dest, file);
      writeTemplate(srcFile, destFile, projectName);
    }
  } else {
    let content = fs.readFileSync(src, 'utf-8');
    
    // Replace template variables
    content = content.replace(/{{projectName}}/g, projectName);
    
    fs.writeFileSync(dest, content);
  }
}

export function isEmpty(path: string): boolean {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

export function emptyDir(dir: string): void {
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

export function setupReactFiles(root: string, projectName: string): void {
  // Update package.json name
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;
  
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Simple Logger class
export class SimpleLogger {
  constructor(private debug: boolean = false) {}

  log(level: 'info' | 'warn' | 'error' | 'debug', message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logLevel = level.toUpperCase();
    const logMessage = `[${timestamp}] [${logLevel}]`;

    switch (level) {
      case 'info':
        console.log(logMessage, message, ...args);
        break;
      case 'warn':
        console.warn(logMessage, message, ...args);
        break;
      case 'error':
        console.error(logMessage, message, ...args);
        break;
      case 'debug':
        if (this.debug) {
          console.debug(logMessage, message, ...args);
        }
        break;
    }
  }
}
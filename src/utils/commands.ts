import { spawn } from 'cross-spawn';
import * as colors from 'picocolors';
import type { SelectedOptions } from '../types';

const { cyan } = colors;

export function executeCustomCommand(
  command: string, 
  targetDir: string, 
  selectedOptions: SelectedOptions | null = null
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Replace TARGET_DIR placeholder with actual target directory
    const finalCommand = command.replace('TARGET_DIR', targetDir);
    
    // Parse command and arguments
    const [cmd, ...args] = finalCommand.split(' ');
    
    console.log(`\nExecuting: ${cyan(finalCommand)}\n`);
    
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}
import * as colors from 'picocolors';
import type { PackageInfo } from '../types';

const {
  blue,
  blueBright,
  cyan,
  green,
  greenBright,
  magenta,
  red,
  redBright,
  yellow,
  gray,
} = colors;

export const helpMessage = `\
Usage: create-mycustomlib [OPTION]... [DIRECTORY]

Create a new project from a template.
With no arguments, start the CLI in interactive mode.

Options:
  -h, --help                 show this help message
  -t, --template NAME        use a specific template
  -y, --yes                  use default options (vanilla-ts with Tailwind v4)

Available templates:
${yellow    ('vanilla-ts     vanilla'      )}
${green     ('vue-ts         vue'          )}
${cyan      ('react-ts       react'        )}
${cyan      ('react-swc-ts   react-swc'    )}
${magenta   ('preact-ts      preact'       )}
${redBright ('lit-ts         lit'          )}
${red       ('svelte-ts      svelte'       )}
${blue      ('solid-ts       solid'        )}
${blueBright('qwik-ts        qwik'         )}
${cyan      ('custom-nextjs'               )}
${greenBright('nuxt          nuxt'         )}
${magenta   ('astro          astro'        )}
${blue      ('remix          remix'        )}
${gray      ('meteor         meteor'       )}
${magenta   ('gatsby         gatsby'       )}
${blue      ('symfony        symfony'      )}
${redBright ('rails          rails'        )}
${cyan      ('phoenix        phoenix'      )}
${green     ('django         django'       )}
${yellow    ('flask          flask'        )}
${blueBright('blazor         blazor'       )}
${gray      ('hugo           hugo'         )}`;

export function printHelp(): void {
  console.log(helpMessage);
}

export function pkgFromUserAgent(userAgent?: string): PackageInfo | undefined {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  const pkgSpecArr = pkgSpec.split('/');
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}
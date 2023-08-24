import { gray, red } from 'chalk'

export function onCrash (...errors: any[]) {
  console.error(gray('[Anti Crash] '), red(errors.join('\n')))
}

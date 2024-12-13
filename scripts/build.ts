import fs from 'fs-extra';
import logger from 'jet-logger';
import childProcess from 'child_process';

/**
 * Start
 */
(async () => {
  try {
    await remove('./dist/');
    await exec('npm run lint', './');
    await exec('tsc --build tsconfig.prod.json', './');
    await copy('./src/public', './dist/public');
    await copy('./src/views', './dist/views');
  } catch (err) {
    logger.err(err);
    process.exit(1);
  }
})();

/**
 * Remove file or directory
 */
function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    fs.remove(loc, (err) => {
      if (err) {
        logger.err(`Error removing ${loc}: ${err}`);
        return rej(err);
      }
      logger.info(`Successfully removed ${loc}`);
      res();
    });
  });
}

/**
 * Copy file or directory
 */
function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    fs.copy(src, dest, (err) => {
      if (err) {
        logger.err(`Error copying from ${src} to ${dest}: ${err}`);
        return rej(err);
      }
      logger.info(`Successfully copied from ${src} to ${dest}`);
      res();
    });
  });
}

/**
 * Execute command line command
 */
function exec(cmd: string, loc: string): Promise<void> {
  return new Promise((res, rej) => {
    childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (stdout) {
        logger.info(stdout);
      }
      if (stderr) {
        logger.warn(stderr);
      }
      if (err) {
        logger.err(`Error executing command '${cmd}' in ${loc}: ${err}`);
        return rej(err);
      }
      logger.info(`Successfully executed command: '${cmd}'`);
      res();
    });
  });
}
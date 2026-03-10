import yn from 'yn';
import winston from 'winston';
import { ConfigSources } from '@backstage/config-loader';
import { startStandaloneServer } from './service/standaloneServer';

const port = process.env.PLUGIN_PORT ? Number(process.env.PLUGIN_PORT) : 7007;
const enableCors = yn(process.env.PLUGIN_CORS, { default: false });
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console()],
});

async function main() {
  const configSource = ConfigSources.default({ argv: process.argv });
  const config = await ConfigSources.toConfig(configSource);
  await startStandaloneServer({ port, enableCors, logger, config });
}

main().catch(err => {
  logger.error('Standalone server failed:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  logger.info('CTRL+C pressed; exiting.');
  process.exit(0);
});

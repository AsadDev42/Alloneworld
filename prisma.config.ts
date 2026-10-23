import { definePrismaConfig } from 'prisma/config';

export default definePrismaConfig({
  composer: { configPath: './prisma-composer.config.ts' },
});

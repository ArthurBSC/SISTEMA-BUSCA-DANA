import { popularBanco } from './seed-helper';

// Script standalone para executar via npm run seed
popularBanco()
  .then(() => {
    console.log('🎉 Seed concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  });


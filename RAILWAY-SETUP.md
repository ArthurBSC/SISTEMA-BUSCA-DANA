# Configuração do Railway - Backend e PostgreSQL

## Passo 1: Adicionar Serviço PostgreSQL

1. No painel do Railway, clique em **"+ New"** ou **"+ Add Service"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. O Railway criará automaticamente um serviço PostgreSQL

## Passo 2: Conectar Backend ao PostgreSQL

### Opção A: Usando DATABASE_URL (Recomendado)

1. No painel do Railway, selecione o serviço **"backend"**
2. Vá na aba **"Variables"**
3. Clique em **"+ New Variable"**
4. Configure:
   - **Key**: `DATABASE_URL`
   - **Value**: Cole a URL de conexão pública do PostgreSQL
     ```
     postgresql://postgres:sRHYPJyoOSLllGnbLqVPqvBXVhXVOVrO@caboose.proxy.rlwy.net:25950/railway
     ```
5. Clique em **"Add"**

### Opção B: Usando Variáveis Individuais

Se preferir usar variáveis individuais, adicione:

- **PGHOST**: `caboose.proxy.rlwy.net`
- **PGPORT**: `25950`
- **PGDATABASE**: `railway`
- **PGUSER**: `postgres`
- **PGPASSWORD**: `sRHYPJyoOSLllGnbLqVPqvBXVhXVOVrO`

**Nota**: O código do backend suporta ambas as opções, mas `DATABASE_URL` tem prioridade.

## Passo 3: Variáveis de Ambiente Necessárias

O Railway fornece automaticamente estas variáveis quando você conecta o PostgreSQL:

### Variáveis Automáticas do Railway (já configuradas):
- `PGHOST` - Host do PostgreSQL
- `PGPORT` - Porta (geralmente 5432)
- `PGDATABASE` - Nome do banco
- `PGUSER` - Usuário
- `PGPASSWORD` - Senha
- `DATABASE_URL` - URL completa de conexão (formato: `postgresql://user:password@host:port/database`)

### Variáveis Adicionais Necessárias:

Adicione manualmente estas variáveis no serviço **backend**:

1. **NODE_ENV**
   - Valor: `production`

2. **PORT** (opcional, Railway define automaticamente)
   - Valor: Deixe o Railway definir ou use `3001`

3. **CORS_ORIGIN** (opcional, mas recomendado)
   - Valor: `https://frontend-production-3ad7.up.railway.app`
   - Ou use `*` para permitir todas as origens

## Passo 4: Verificar Configuração

Após configurar, o backend deve:
1. Conectar automaticamente ao PostgreSQL usando `DATABASE_URL` ou variáveis `PG*`
2. Criar a tabela `registros` automaticamente no primeiro startup
3. Estar pronto para receber requisições

## Passo 5: Popular o Banco de Dados (Opcional)

Se quiser popular o banco com dados de teste:

1. No Railway, vá para o serviço **backend**
2. Abra o terminal/console
3. Execute: `npm run seed`

Ou adicione um script de build que execute automaticamente.

## Troubleshooting

### Erro: ECONNREFUSED
- **Causa**: Backend não consegue conectar ao PostgreSQL
- **Solução**: 
  1. Verifique se o serviço PostgreSQL está online (deve ter um ponto verde)
  2. Verifique se as variáveis `DATABASE_URL` ou `PG*` estão configuradas
  3. Verifique os logs do backend para ver qual variável está sendo usada

### Erro: Tabela não encontrada
- **Causa**: Tabela não foi criada
- **Solução**: 
  - O backend cria automaticamente no primeiro startup
  - Ou execute manualmente: `npm run migrate` no terminal do Railway

### Como Verificar Variáveis no Railway
1. Vá em **backend** → **Variables**
2. Expanda **"> 8 variables added by Railway"**
3. Verifique se `DATABASE_URL` ou variáveis `PG*` estão presentes

## Estrutura Final

```
Railway Project
├── frontend (serviço)
│   └── Variables:
│       └── VITE_API_URL=https://backend-production-cf10.up.railway.app
│
├── backend (serviço)
│   └── Variables:
│       ├── DATABASE_URL (do PostgreSQL) ← Automático
│       ├── PGHOST (do PostgreSQL) ← Automático
│       ├── PGPORT (do PostgreSQL) ← Automático
│       ├── PGDATABASE (do PostgreSQL) ← Automático
│       ├── PGUSER (do PostgreSQL) ← Automático
│       ├── PGPASSWORD (do PostgreSQL) ← Automático
│       ├── NODE_ENV=production ← Manual
│       └── CORS_ORIGIN=* ← Manual (opcional)
│
└── PostgreSQL (serviço de banco)
    └── Variáveis automáticas fornecidas ao backend
```


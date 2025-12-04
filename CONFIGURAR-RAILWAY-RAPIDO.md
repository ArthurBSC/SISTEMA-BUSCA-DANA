# ⚡ Configuração Rápida - Railway

## Passo 1: Adicionar DATABASE_URL no Backend

1. No Railway, vá para o serviço **"backend"**
2. Clique na aba **"Variables"**
3. Clique em **"+ New Variable"**
4. Configure:
   - **Key**: `DATABASE_URL`
   - **Value**: 
     ```
     postgresql://postgres:sRHYPJyoOSLllGnbLqVPqvBXVhXVOVrO@caboose.proxy.rlwy.net:25950/railway
     ```
5. Clique em **"Add"**

## Passo 2: Adicionar NODE_ENV (Opcional mas Recomendado)

1. Ainda na aba **"Variables"** do backend
2. Clique em **"+ New Variable"**
3. Configure:
   - **Key**: `NODE_ENV`
   - **Value**: `production`
4. Clique em **"Add"**

## Passo 3: Aguardar Deploy

Após adicionar as variáveis:
1. O Railway fará um novo deploy automaticamente
2. Aguarde alguns minutos
3. Verifique os logs do backend para confirmar a conexão

## Verificação

Nos logs do backend, você deve ver:
```
🔧 Usando DATABASE_URL para conexão
✅ Connected to PostgreSQL
✅ Tabela "registros" encontrada (ou será criada automaticamente)
```

## Pronto! 🎉

O backend agora deve conseguir conectar ao PostgreSQL e criar a tabela automaticamente.


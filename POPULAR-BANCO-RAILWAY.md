# 🚀 Como Popular o Banco no Railway

## Opção 1: Automático (Recomendado) ✅

O backend agora **popula automaticamente** o banco quando detecta que a tabela está vazia!

**O que fazer:**
1. Certifique-se de que o `DATABASE_URL` está configurado no backend
2. Aguarde o próximo deploy (ou force um redeploy)
3. O backend detectará que a tabela está vazia e começará a popular automaticamente
4. Você verá nos logs do backend:
   ```
   ⚠️ Tabela vazia. Iniciando população automática...
   📝 Criando 6000 registros...
   ✅ 500 registros criados...
   ✅ 1000 registros criados...
   ...
   ✅ 6000 registros criados com sucesso!
   ```

## Opção 2: Manual via Terminal do Railway

Se preferir popular manualmente:

1. No Railway, vá para o serviço **"backend"**
2. Clique na aba **"Deployments"** ou **"Settings"**
3. Abra o **Terminal** ou **Console**
4. Execute:
   ```bash
   npm run seed
   ```
5. Aguarde a conclusão (cria 6.000 registros)

## Opção 3: Via Script de Build (Avançado)

Você pode modificar o `package.json` para executar o seed automaticamente após o build:

```json
"scripts": {
  "postbuild": "npm run seed"
}
```

**⚠️ Atenção**: Isso executará o seed a cada build, o que pode não ser desejado.

## Verificação

Após popular o banco, você pode verificar:

1. **No Railway**: Vá em **Postgres** → **Database** → **Data** → Tabela `registros`
2. **Via API**: Acesse `https://backend-production-cf10.up.railway.app/api/estatisticas`
   - Deve retornar `total: 6000` (ou o número de registros criados)

## Troubleshooting

### Tabela não está sendo populada automaticamente
- Verifique os logs do backend no Railway
- Certifique-se de que `DATABASE_URL` está configurado
- Verifique se a tabela realmente está vazia (pode ter dados antigos)

### Erro ao executar seed manualmente
- Verifique se o `DATABASE_URL` está configurado
- Verifique se a tabela `registros` existe
- Veja os logs de erro no terminal do Railway

## Tempo Estimado

- **6.000 registros**: ~30-60 segundos (dependendo da conexão)
- O processo roda em background, não bloqueia o servidor


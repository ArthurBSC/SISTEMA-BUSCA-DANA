# SearchBench - Sistema de Busca

Sistema de benchmark de algoritmos de busca desenvolvido com Node.js/TypeScript (backend) e React/TypeScript (frontend), utilizando PostgreSQL como banco de dados.

## 🚀 Tecnologias

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- node-cache

### Frontend
- React 18 + TypeScript
- Vite
- React Router
- Axios
- Lucide React (ícones)
- jsPDF + jspdf-autotable (exportação PDF)

## 📋 Funcionalidades

- **Busca Sequencial**: O(n) - Busca linear em todos os registros
- **Busca Indexada**: O(log n) - Utiliza índices do PostgreSQL (B-Tree/GIN)
- **Busca HashMap**: O(1) - Tabela hash em memória com cache
- **Comparação de Performance**: Compara os tempos de execução dos diferentes algoritmos
- **Estatísticas Visuais**: Gráficos de pizza e barras para visualização dos dados
- **Exportação PDF**: Exporta resultados completos em formato PDF
- **Dark Mode**: Suporte a tema claro e escuro
- **Interface Responsiva**: Design adaptável para diferentes tamanhos de tela

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm run setup  # Cria o banco de dados
npm run migrate  # Executa as migrações
npm run seed  # Popula o banco com dados de teste
npm run dev  # Inicia o servidor (porta 3001)
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configure a URL da API no .env
npm run dev  # Inicia o servidor de desenvolvimento (porta 3000)
```

## 📊 Banco de Dados

O sistema utiliza PostgreSQL com:
- Tabela `registros` com mais de 5.000 registros
- Índices B-Tree para campos únicos
- Índices GIN para busca full-text
- Índices compostos para otimização

## 🎨 Interface

- Sidebar responsivo com menu lateral
- Cards interativos com animação 3D flip
- Gráficos visuais para estatísticas
- Tooltips informativos
- Animações suaves e transições

## 📝 Estrutura do Projeto

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/    # Controladores da API
│   │   ├── services/       # Serviços de busca
│   │   ├── models/         # Modelos de dados
│   │   ├── database/       # Migrações e seeders
│   │   └── routes/         # Rotas da API
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── styles/         # Estilos CSS organizados
│   │   ├── services/       # Serviços de API
│   │   └── contexts/       # Contextos React
│   └── package.json
└── README.md
```

## 🔧 Scripts Disponíveis

### Backend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run setup` - Cria banco de dados
- `npm run migrate` - Executa migrações
- `npm run seed` - Popula banco com dados
- `npm run check-db` - Verifica conexão

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build

## 📄 Licença

Este projeto foi desenvolvido por Arthur Silva.

## 👤 Autor

**Arthur Silva**
- GitHub: [@ArthurBSC](https://github.com/ArthurBSC)


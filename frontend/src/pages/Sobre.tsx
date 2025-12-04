import { Target, Search, Code, CheckCircle, BookOpen, Lightbulb } from 'lucide-react';
import '../styles/pages/sobre.css';

function Sobre() {
  return (
    <div className="sobre">
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <BookOpen size={32} />
        Sobre o SearchBench
      </h1>

      <section className="sobre-section">
        <h2>
          <Target size={24} />
          Objetivo
        </h2>
        <p>
          O SearchBench foi desenvolvido para demonstrar e comparar diferentes algoritmos
          de busca em um banco de dados PostgreSQL. O projeto permite visualizar em tempo
          real a performance de cada método de busca através de benchmarks precisos.
        </p>
      </section>

      <section className="sobre-section">
        <h2>
          <Search size={24} />
          Tipos de Busca
        </h2>
        <div className="tipos-lista">
          <div className="tipo-item">
            <h3>1. Busca Sequencial</h3>
            <p>
              Percorre todos os registros sequencialmente até encontrar o resultado.
              Complexidade O(n). Ideal para pequenos volumes de dados.
            </p>
          </div>
          <div className="tipo-item">
            <h3>2. Busca Indexada</h3>
            <p>
              Utiliza índices do banco de dados (B-Tree/GIN) para acelerar as buscas.
              Complexidade O(log n) a O(1). Padrão da indústria para produção.
            </p>
          </div>
          <div className="tipo-item">
            <h3>3. Busca por HashMap</h3>
            <p>
              Usa tabela hash em memória para buscas ultra-rápidas. Complexidade O(1)
              para chaves exatas. Ideal para buscas frequentes com cache.
            </p>
          </div>
        </div>
      </section>

      <section className="sobre-section">
        <h2>
          <Code size={24} />
          Tecnologias
        </h2>
        <div className="tech-grid">
          <div className="tech-card">
            <h3>Frontend</h3>
            <ul>
              <li>React 18</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>React Router</li>
              <li>Axios</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>TypeScript</li>
              <li>Express</li>
              <li>PostgreSQL</li>
              <li>node-cache</li>
            </ul>
          </div>
          <div className="tech-card">
            <h3>Banco de Dados</h3>
            <ul>
              <li>PostgreSQL</li>
              <li>Índices B-Tree</li>
              <li>Índices GIN (Full-Text)</li>
              <li>Índices Compostos</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sobre-section">
        <h2>
          <CheckCircle size={24} />
          Funcionalidades
        </h2>
        <ul className="funcionalidades">
          <li>✅ Comparação de performance em tempo real</li>
          <li>✅ Busca por nome, CPF, cidade ou email</li>
          <li>✅ Estatísticas do sistema</li>
          <li>✅ Cache de HashMap para buscas rápidas</li>
          <li>✅ Interface moderna e responsiva</li>
        </ul>
      </section>

      <section className="sobre-section">
        <h2>
          <Lightbulb size={24} />
          Como Usar
        </h2>
        <ol className="como-usar">
          <li>Acesse a página "Pesquisar"</li>
          <li>Selecione um ou mais tipos de busca</li>
          <li>Escolha o campo a ser pesquisado</li>
          <li>Digite o termo de busca</li>
          <li>Clique em "Buscar" e compare os resultados</li>
        </ol>
      </section>
    </div>
  );
}

export default Sobre;


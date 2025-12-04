import { useEffect, useState } from 'react';
import { Search, Database, BarChart3, MapPin, CheckCircle, XCircle, Zap, Hash, TrendingUp, Lightbulb, AlertTriangle, Code } from 'lucide-react';
import { buscaApi } from '../services/api';
import '../styles/pages/home.css';

interface Estatisticas {
  total: number;
  ativos: number;
  inativos: number;
  por_estado: Array<{ estado: string; total: number }>;
}

interface InfoBusca {
  nome: string;
  descricao: string;
  vantagens: string[];
  desvantagens: string[];
  complexidade: string;
}

function Home() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [infoBuscas, setInfoBuscas] = useState<Record<string, InfoBusca> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [stats, info] = await Promise.all([
          buscaApi.getEstatisticas(),
          buscaApi.getInfoBuscas(),
        ]);
        setEstatisticas(stats);
        setInfoBuscas(info);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="home">

      {estatisticas && (
        <section className="stats-section">
          <h2>
            <BarChart3 size={24} />
            Estatísticas do Sistema
          </h2>
          
          {/* Cards de Estatísticas Principais */}
          <div className="stats-grid">
            <div className="stat-card stat-card-total">
              <div className="stat-card-header">
                <Database size={24} />
                <h3>Total de Registros</h3>
              </div>
              <p className="stat-value">{estatisticas.total.toLocaleString()}</p>
              <div className="stat-trend">
                <TrendingUp size={16} />
                <span>Base de dados completa</span>
              </div>
            </div>
            <div className="stat-card stat-card-ativos">
              <div className="stat-card-header">
                <CheckCircle size={24} />
                <h3>Ativos</h3>
              </div>
              <p className="stat-value">{estatisticas.ativos.toLocaleString()}</p>
              <div className="stat-progress">
                <div className="stat-progress-bar">
                  <div 
                    className="stat-progress-fill" 
                    style={{ width: `${(estatisticas.ativos / estatisticas.total) * 100}%` }}
                  ></div>
                </div>
                <span className="stat-percentage">
                  {((estatisticas.ativos / estatisticas.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="stat-card stat-card-inativos">
              <div className="stat-card-header">
                <XCircle size={24} />
                <h3>Inativos</h3>
              </div>
              <p className="stat-value">{estatisticas.inativos.toLocaleString()}</p>
              <div className="stat-progress">
                <div className="stat-progress-bar">
                  <div 
                    className="stat-progress-fill" 
                    style={{ width: `${(estatisticas.inativos / estatisticas.total) * 100}%` }}
                  ></div>
                </div>
                <span className="stat-percentage">
                  {((estatisticas.inativos / estatisticas.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Gráfico de Pizza - Ativos vs Inativos */}
          <div className="chart-container">
            <div className="chart-pie-wrapper">
              <h3>
                <BarChart3 size={20} />
                Distribuição: Ativos vs Inativos
              </h3>
              <div className="pie-chart">
                <svg className="pie-svg" viewBox="0 0 200 200">
                  <circle
                    className="pie-background"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="40"
                  />
                  <circle
                    className="pie-segment pie-ativos"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="40"
                    strokeDasharray={`${(estatisticas.ativos / estatisticas.total) * 502.65} 502.65`}
                    strokeDashoffset="125.66"
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    className="pie-segment pie-inativos"
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="var(--error)"
                    strokeWidth="40"
                    strokeDasharray={`${(estatisticas.inativos / estatisticas.total) * 502.65} 502.65`}
                    strokeDashoffset={`${125.66 - ((estatisticas.ativos / estatisticas.total) * 502.65)}`}
                    transform="rotate(-90 100 100)"
                  />
                </svg>
                <div className="pie-center">
                  <span className="pie-total">{estatisticas.total.toLocaleString()}</span>
                  <span className="pie-label">Total</span>
                </div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: 'var(--success)' }}></span>
                  <span className="legend-label">Ativos: {estatisticas.ativos.toLocaleString()}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: 'var(--error)' }}></span>
                  <span className="legend-label">Inativos: {estatisticas.inativos.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Gráfico de Barras - Estados */}
            {estatisticas.por_estado.length > 0 && (
              <div className="chart-bars-wrapper">
                <h3>
                  <MapPin size={20} />
                  Top Estados
                </h3>
                <div className="bar-chart">
                  {estatisticas.por_estado.slice(0, 8).map((item, index) => {
                    const maxValue = Math.max(...estatisticas.por_estado.slice(0, 8).map(e => e.total));
                    const percentage = (item.total / maxValue) * 100;
                    return (
                      <div key={item.estado} className="bar-item">
                        <div className="bar-label">{item.estado}</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ 
                              width: `${percentage}%`,
                              animationDelay: `${index * 0.1}s`
                            }}
                          >
                            <span className="bar-value">{item.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {infoBuscas && (
        <section className="tipos-busca">
          <h2>
            <Search size={24} />
            Tipos de Busca Disponíveis
          </h2>
          <div className={`cards-stack-container ${selectedCard ? 'expanded' : ''}`}>
            {selectedCard && (
              <button 
                className="close-cards-btn"
                onClick={() => {
                  setSelectedCard(null);
                  setFlippedCards(new Set());
                }}
              >
                ✕ Fechar
              </button>
            )}
            <div className="cards-stack" onClick={(e) => e.stopPropagation()}>
              {/* Ordem fixa: sequencial, indexada, hashmap */}
              {['sequencial', 'indexada', 'hashmap'].map((key, index) => {
                if (!infoBuscas[key]) return null;
                const info = infoBuscas[key];
                const isSelected = selectedCard === key;
                const getIcon = () => {
                  if (key === 'sequencial') return <Zap size={32} />;
                  if (key === 'indexada') return <TrendingUp size={32} />;
                  return <Hash size={32} />;
                };

                const isFlipped = flippedCards.has(key);

                return (
                  <div
                    key={key}
                    className={`card-item ${isSelected ? 'selected' : ''} ${selectedCard ? 'expanded' : ''} ${isFlipped ? 'flipped' : ''}`}
                    style={{ '--card-index': index } as React.CSSProperties}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedCard) {
                        // Se já está expandido, flip o card individual
                        setFlippedCards(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(key)) {
                            newSet.delete(key);
                          } else {
                            newSet.add(key);
                          }
                          return newSet;
                        });
                      } else {
                        // Se não está expandido, expande todos os cards
                        setSelectedCard(key);
                      }
                    }}
                  >
                    <div className="card-inner">
                      {/* Frente do Card */}
                      <div className="card-front">
                        <div className="card-content">
                          <div className="card-icon">{getIcon()}</div>
                          <h3>{info.nome}</h3>
                          <p className="card-complexity">{info.complexidade}</p>
                          <p className="card-description">{info.descricao}</p>
                          <div className="card-hint">
                            <span>{selectedCard ? 'Clique para virar e ver detalhes' : 'Clique para expandir'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Verso do Card */}
                      <div className="card-back">
                        <div className="card-content">
                          <div className="card-icon">{getIcon()}</div>
                          <h3>{info.nome}</h3>
                          <p className="card-complexity">
                            <Code size={16} />
                            {info.complexidade}
                          </p>
                          
                          <div className="card-details">
                            <div className="card-section vantagens-section">
                              <h4>
                                <Lightbulb size={18} />
                                Vantagens
                              </h4>
                              <ul>
                                {info.vantagens.map((v, i) => (
                                  <li key={i}>{v}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="card-section desvantagens-section">
                              <h4>
                                <AlertTriangle size={18} />
                                Desvantagens
                              </h4>
                              <ul>
                                {info.desvantagens.map((d, i) => (
                                  <li key={i}>{d}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="card-hint back-hint">
                            <span>Clique para voltar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>
      )}
    </div>
  );
}

export default Home;


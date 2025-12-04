import { useState, FormEvent, useEffect } from 'react';
import { Search, Zap, Database, Hash, Clock, TrendingUp, Trash2, AlertCircle, BarChart3, FileX, CheckCircle2, Sparkles, Activity, FileDown } from 'lucide-react';
import { buscaApi, BuscaResult } from '../services/api';
import '../styles/pages/pesquisar.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Pesquisar() {
  const [tipoBusca, setTipoBusca] = useState<('sequencial' | 'indexada' | 'hashmap')[]>([]);
  const [campoBusca, setCampoBusca] = useState<'nome' | 'cpf' | 'cidade' | 'email'>('nome');
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState<BuscaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [exporting, setExporting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (tipoBusca.length === 0) {
      setError('Selecione pelo menos um tipo de busca');
      return;
    }

    if (termoBusca.length < 2) {
      setError('O termo deve ter no mínimo 2 caracteres');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(false);
    setSearchStartTime(Date.now());
    setElapsedTime(0);

    try {
      const data = await buscaApi.buscar({
        tipo_busca: tipoBusca,
        campo_busca: campoBusca,
        termo_busca: termoBusca,
      });
      setResultados(data);
      setSearchPerformed(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao realizar busca');
      setSearchPerformed(true);
    } finally {
      setLoading(false);
      setSearchStartTime(null);
    }
  };

  const toggleTipoBusca = (tipo: 'sequencial' | 'indexada' | 'hashmap') => {
    setTipoBusca((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
    // Limpar resultados anteriores ao mudar seleção
    if (resultados) {
      setResultados(null);
      setSearchPerformed(false);
    }
  };

  const limparCache = async () => {
    try {
      await buscaApi.limparCache();
      setResultados(null);
      setSearchPerformed(false);
      // Mostrar feedback visual
      const btn = document.querySelector('.btn-secondary');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Cache limpo!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    } catch (err) {
      setError('Erro ao limpar cache');
    }
  };

  // Timer para mostrar tempo decorrido durante busca
  useEffect(() => {
    let interval: number | null = null;
    if (loading && searchStartTime) {
      interval = window.setInterval(() => {
        setElapsedTime(Date.now() - searchStartTime);
      }, 10); // Atualiza a cada 10ms para precisão
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [loading, searchStartTime]);

  const exportarPDF = () => {
    if (!resultados) return;
    
    setExporting(true);
    
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Título
    doc.setFontSize(18);
    doc.text('Resultados da Busca - SearchBench', 14, yPosition);
    yPosition += 10;
    
    // Informações da busca
    doc.setFontSize(12);
    doc.text(`Campo: ${campoBusca.toUpperCase()}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Termo: "${termoBusca}"`, 14, yPosition);
    yPosition += 10;
    
    // Tabela de Comparação de Performance
    if (resultados.comparacao && Object.keys(resultados.comparacao.tempos).length > 0) {
      doc.setFontSize(14);
      doc.text('Comparação de Performance', 14, yPosition);
      yPosition += 8;
      
      const comparacaoData = Object.entries(resultados.comparacao.tempos).map(([tipo, tempo]) => [
        tipo.toUpperCase(),
        `${(tempo as number).toFixed(4)} ms`,
        tipo === resultados.comparacao.mais_rapido ? 'Mais rápido' : ''
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Tipo de Busca', 'Tempo (ms)', 'Observação']],
        body: comparacaoData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 10;
      
      if (resultados.comparacao.tempo_economizado > 0) {
        doc.setFontSize(11);
        doc.text(`Tempo economizado: ${resultados.comparacao.tempo_economizado.toFixed(4)} ms`, 14, yPosition);
        yPosition += 10;
      }
    }
    
    // Estatísticas Gerais
    const totalEncontrado = Object.values(resultados.resultados).reduce((acc: number, r: any) => 
      acc + (r.total_encontrado || 0), 0
    );
    
    if (totalEncontrado > 0) {
      doc.setFontSize(11);
      doc.text(`Total de registros encontrados: ${totalEncontrado}`, 14, yPosition);
      yPosition += 10;
    }
    
    // Detalhes de cada tipo de busca
    Object.entries(resultados.resultados).forEach(([tipo, resultado]: [string, any]) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`Busca ${tipo.toUpperCase()}`, 14, yPosition);
      yPosition += 8;
      
      // Informações do resultado
      const infoData = [
        ['Total encontrado', resultado.total_encontrado?.toString() || '0'],
        ['Tempo de execução', `${resultado.tempo_execucao || 'N/A'} ms`],
        ['Complexidade', resultado.complexidade || 'N/A'],
        ['Descrição', resultado.descricao || 'N/A']
      ];
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Informação', 'Valor']],
        body: infoData,
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 'auto' }
        }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 10;
      
      // Tabela de registros encontrados
      if (resultado.resultados && resultado.resultados.length > 0) {
        doc.setFontSize(12);
        doc.text(`Registros Encontrados (${resultado.resultados.length})`, 14, yPosition);
        yPosition += 8;
        
        const registrosData = resultado.resultados.map((reg: any) => [
          reg.nome || 'N/A',
          reg.email || 'N/A',
          reg.cpf || 'N/A',
          reg.cidade || 'N/A',
          reg.estado || 'N/A',
          reg.status || 'N/A'
        ]);
        
        autoTable(doc, {
          startY: yPosition,
          head: [['Nome', 'Email', 'CPF', 'Cidade', 'Estado', 'Status']],
          body: registrosData,
          theme: 'striped',
          headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
          styles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 40 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 }
          }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 15;
      } else if (resultado.error) {
        doc.setFontSize(11);
        doc.setTextColor(200, 0, 0);
        doc.text(`Erro: ${resultado.error}`, 14, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 10;
      }
    });
    
    // Rodapé
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount} - SearchBench - ${new Date().toLocaleDateString('pt-BR')}`,
        14,
        (doc as any).internal.pageSize.height - 10
      );
    }
    
    // Salvar PDF
    const fileName = `busca_${campoBusca}_${termoBusca}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
    
    setExporting(false);
  };

  return (
    <div className="pesquisar">
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Search size={32} />
          Realizar Busca
        </h1>
        <p className="page-subtitle">
          Compare a performance de diferentes algoritmos de busca em tempo real
        </p>
      </div>

      <form onSubmit={handleSubmit} className="busca-form">
        <div className="form-group">
          <label>
            <Database size={20} />
            Tipo de Busca (selecione um ou mais):
          </label>
          <div className="checkbox-group">
            <label className={`checkbox-label ${tipoBusca.includes('sequencial') ? 'checked' : ''}`}>
              <div>
                <input
                  type="checkbox"
                  checked={tipoBusca.includes('sequencial')}
                  onChange={() => toggleTipoBusca('sequencial')}
                />
                <Zap size={18} />
                Sequencial
              </div>
              <span className="checkbox-hint">O(n) - Linear</span>
            </label>
            <label className={`checkbox-label ${tipoBusca.includes('indexada') ? 'checked' : ''}`}>
              <div>
                <input
                  type="checkbox"
                  checked={tipoBusca.includes('indexada')}
                  onChange={() => toggleTipoBusca('indexada')}
                />
                <TrendingUp size={18} />
                Indexada
              </div>
              <span className="checkbox-hint">O(log n) - Rápida</span>
            </label>
            <label className={`checkbox-label ${tipoBusca.includes('hashmap') ? 'checked' : ''}`}>
              <div>
                <input
                  type="checkbox"
                  checked={tipoBusca.includes('hashmap')}
                  onChange={() => toggleTipoBusca('hashmap')}
                />
                <Hash size={18} />
                HashMap
              </div>
              <span className="checkbox-hint">O(1) - Ultra rápida</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>
            <Search size={20} />
            Campo de Busca:
          </label>
          <select
            value={campoBusca}
            onChange={(e) => {
              setCampoBusca(e.target.value as any);
              // Limpar resultados ao mudar campo
              if (resultados) {
                setResultados(null);
                setSearchPerformed(false);
              }
            }}
            className="select"
          >
            <option value="nome">Nome</option>
            <option value="cpf">CPF</option>
            <option value="cidade">Cidade</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            <Search size={20} />
            Termo de Busca:
          </label>
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder={`Ex: ${campoBusca === 'nome' ? 'MARIA, JOSE, SILVA' : campoBusca === 'cidade' ? 'SAO PAULO, RIO DE JANEIRO' : campoBusca === 'cpf' ? '12345678901' : 'email@exemplo.com'}`}
            className="input"
            required
            minLength={2}
            autoFocus
          />
          <small className="input-hint">
            Mínimo de 2 caracteres. A busca é case-insensitive (não diferencia maiúsculas/minúsculas).
          </small>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <div>
              <strong>Erro:</strong> {error}
            </div>
          </div>
        )}

        {searchPerformed && !loading && resultados && 
         Object.values(resultados.resultados).every((r: any) => r.total_encontrado === 0) && (
          <div className="info-message">
            <AlertCircle size={20} />
            <div>
              <strong>Nenhum resultado encontrado.</strong> Tente usar termos diferentes ou verifique a ortografia.
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search size={20} />
                Buscar
              </>
            )}
          </button>
          <button 
            type="button" 
            onClick={limparCache} 
            className="btn btn-secondary"
            disabled={loading}
          >
            <Trash2 size={20} />
            Limpar Cache
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              <p className="loading-title">Buscando registros...</p>
              <p className="loading-subtitle">
                <Activity size={16} />
                Processando {tipoBusca.length} tipo{tipoBusca.length > 1 ? 's' : ''} de busca
              </p>
              {elapsedTime > 0 && (
                <p className="loading-time">
                  <Clock size={14} />
                  {(elapsedTime / 1000).toFixed(2)}s
                </p>
              )}
            </div>
            <div className="loading-steps">
              {tipoBusca.map((tipo) => (
                <div key={tipo} className="loading-step">
                  <Sparkles size={14} />
                  <span>{tipo.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && searchPerformed && resultados && (
        <div className="resultados">
          <div className="resultados-header">
            <div>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <BarChart3 size={24} />
                Resultados da Busca
              </h2>
              <p className="busca-info">
                Buscando por <strong>{campoBusca}</strong>: "{termoBusca}"
              </p>
            </div>
            <button 
              className="btn btn-export"
              onClick={exportarPDF}
              title="Exportar resultados para PDF"
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <div className="btn-spinner"></div>
                  Exportando...
                </>
              ) : (
                <>
                  <FileDown size={18} />
                  Exportar PDF
                </>
              )}
            </button>
          </div>

          {/* Estatísticas Rápidas */}
          {Object.values(resultados.resultados).some((r: any) => r.total_encontrado > 0) && (
            <div className="stats-quick">
              <div className="stat-quick-item">
                <Database size={20} />
                <div>
                  <span className="stat-value">
                    {Object.values(resultados.resultados).reduce((acc: number, r: any) => 
                      acc + (r.total_encontrado || 0), 0
                    )}
                  </span>
                  <span className="stat-label">Total encontrado</span>
                </div>
              </div>
              {resultados.comparacao && (
                <div className="stat-quick-item">
                  <Zap size={20} />
                  <div>
                    <span className="stat-value">
                      {resultados.comparacao.mais_rapido.toUpperCase()}
                    </span>
                    <span className="stat-label">Mais rápido</span>
                  </div>
                </div>
              )}
              {resultados.comparacao && resultados.comparacao.tempo_economizado > 0 && (
                <div className="stat-quick-item">
                  <Clock size={20} />
                  <div>
                    <span className="stat-value">
                      {resultados.comparacao.tempo_economizado.toFixed(2)}ms
                    </span>
                    <span className="stat-label">Tempo economizado</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verificar se há resultados encontrados */}
          {Object.values(resultados.resultados).every((r: any) => 
            !r.error && r.total_encontrado === 0
          ) && Object.values(resultados.resultados).length > 0 && (
            <div className="no-results">
              <FileX size={48} />
              <h3>Nenhum resultado encontrado</h3>
              <p>Não encontramos registros correspondentes à sua busca por <strong>"{termoBusca}"</strong> no campo <strong>{campoBusca}</strong>.</p>
              <div className="suggestions">
                <p><strong>💡 Sugestões:</strong></p>
                <ul>
                  <li>Verifique a ortografia do termo pesquisado</li>
                  <li>Tente usar termos mais genéricos ou parciais</li>
                  <li>Experimente buscar por outro campo (cidade, estado, etc.)</li>
                  <li>Use apenas parte do nome (ex: "MARIA" ao invés de "MARIA SILVA")</li>
                </ul>
              </div>
            </div>
          )}

          {resultados.comparacao && 
           Object.keys(resultados.comparacao.tempos).length > 0 && 
           Object.values(resultados.resultados).some((r: any) => r.total_encontrado > 0) && (
            <div className="comparacao">
              <h3>
                <Zap size={20} />
                Comparação de Performance
              </h3>
              <div className="comparacao-grid">
                {Object.entries(resultados.comparacao.tempos).map(([tipo, tempo]) => (
                  <div
                    key={tipo}
                    className={`tempo-card ${
                      tipo === resultados.comparacao.mais_rapido ? 'mais-rapido' : ''
                    }`}
                  >
                    <h4>{tipo.toUpperCase()}</h4>
                    <p className="tempo">
                      <Clock size={16} />
                      {tempo.toFixed(4)} ms
                    </p>
                    {resultados.comparacao.diferencas[tipo] > 0 && (
                      <p className="diferenca">
                        +{resultados.comparacao.diferencas[tipo].toFixed(2)}%
                      </p>
                    )}
                    {tipo === resultados.comparacao.mais_rapido && (
                      <span className="badge badge-success">Mais rápido</span>
                    )}
                  </div>
                ))}
              </div>
              {resultados.comparacao.tempo_economizado > 0 && (
                <p className="economia">
                  <Clock size={20} />
                  Tempo economizado: {resultados.comparacao.tempo_economizado.toFixed(4)} ms
                </p>
              )}
            </div>
          )}

          <div className="resultados-detalhes">
            {Object.entries(resultados.resultados).map(([tipo, resultado]: [string, any]) => (
              <div key={tipo} className="resultado-tipo">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {tipo.toUpperCase()}
                  {resultado.error ? (
                    <AlertCircle size={18} className="error-icon" />
                  ) : resultado.total_encontrado > 0 ? (
                    <CheckCircle2 size={18} className="success-icon" />
                  ) : (
                    <FileX size={18} className="no-results-icon" />
                  )}
                </h3>
                
                {resultado.error ? (
                  <div className="resultado-error">
                    <AlertCircle size={24} />
                    <p><strong>Erro na busca:</strong> {resultado.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="resultado-info">
                      <p>
                        <strong>Total encontrado:</strong> 
                        <span className={resultado.total_encontrado > 0 ? 'success-text' : 'no-results-text'}>
                          {resultado.total_encontrado}
                        </span>
                      </p>
                      <p>
                        <strong>Tempo de execução:</strong> {resultado.tempo_execucao} ms
                      </p>
                      <p>
                        <strong>Complexidade:</strong> {resultado.complexidade}
                      </p>
                      <p>
                        <strong>Descrição:</strong> {resultado.descricao}
                      </p>
                    </div>

                    {resultado.resultados && resultado.resultados.length > 0 ? (
                      <div className="resultados-lista">
                        <h4>
                          <CheckCircle2 size={18} />
                          Registros encontrados: <span className="count-badge">{resultado.total_encontrado}</span>
                        </h4>
                        <div className="registros-grid">
                          {resultado.resultados.slice(0, 10).map((registro: any, index: number) => (
                            <div key={index} className="registro-card">
                              <div className="registro-header">
                                <strong>{registro.nome}</strong>
                                <span className={`status-badge ${registro.status === 'ativo' ? 'ativo' : 'inativo'}`}>
                                  {registro.status}
                                </span>
                              </div>
                              <div className="registro-body">
                                <p>
                                  <strong>Email:</strong> {registro.email}
                                </p>
                                <p>
                                  <strong>CPF:</strong> {registro.cpf}
                                </p>
                                <p>
                                  <strong>Cidade:</strong> {registro.cidade} - {registro.estado}
                                </p>
                                {registro.telefone && (
                                  <p>
                                    <strong>Telefone:</strong> {registro.telefone}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {resultado.resultados.length > 10 && (
                          <p className="mais-registros">
                            ... e mais {resultado.resultados.length - 10} registros
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="no-results-tipo">
                        <FileX size={32} />
                        <p>Nenhum registro encontrado com este termo na busca {tipo}.</p>
                        <p className="hint">Tente usar termos diferentes ou verifique a ortografia.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pesquisar;


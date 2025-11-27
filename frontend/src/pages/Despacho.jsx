import { useState, useEffect } from 'react';
import api from '../services/api';
import ocorrenciaService from '../services/ocorrencia';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCorGravidade } from '../utils/helpers';
import './Despacho.css';

const Despacho = () => {
  const [ocorrenciasAbertas, setOcorrenciasAbertas] = useState([]);
  const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState(null);
  const [ambulanciasAptas, setAmbulanciasAptas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [despachando, setDespachando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    carregarOcorrencias();
  }, []);

  const carregarOcorrencias = async () => {
    try {
      setCarregando(true);
      const dados = await ocorrenciaService.listarAbertas();
      setOcorrenciasAbertas(dados);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
    } finally {
      setCarregando(false);
    }
  };

  const buscarAmbulanciasAptas = async (ocorrenciaId) => {
    try {
      setCarregando(true);
      const response = await api.get(`/despacho/ambulancias-aptas/${ocorrenciaId}`);
      setAmbulanciasAptas(response.data);
      
      if (response.data.length === 0) {
        setMensagem({
          tipo: 'warning',
          texto: 'Nenhuma ambulância apta encontrada para esta ocorrência'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar ambulâncias aptas:', error);
      setMensagem({
        tipo: 'error',
        texto: 'Erro ao buscar ambulâncias disponíveis'
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleSelecionarOcorrencia = async (ocorrencia) => {
    setOcorrenciaSelecionada(ocorrencia);
    setAmbulanciasAptas([]);
    setMensagem({ tipo: '', texto: '' });
    await buscarAmbulanciasAptas(ocorrencia.id);
  };

  const handleDespachar = async (ambulanciaId) => {
    if (!window.confirm('Confirmar despacho desta ambulância?')) {
      return;
    }

    setDespachando(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      await api.post('/despacho', {
        ocorrenciaId: ocorrenciaSelecionada.id,
        ambulanciaId
      });

      setMensagem({
        tipo: 'success',
        texto: 'Ambulância despachada com sucesso!'
      });

      // Atualizar lista de ocorrências
      await carregarOcorrencias();
      
      // Limpar seleção
      setTimeout(() => {
        setOcorrenciaSelecionada(null);
        setAmbulanciasAptas([]);
      }, 2000);

    } catch (error) {
      console.error('Erro ao despachar ambulância:', error);
      setMensagem({
        tipo: 'error',
        texto: error.response?.data?.message || 'Erro ao despachar ambulância'
      });
    } finally {
      setDespachando(false);
    }
  };

  const getSLAInfo = (gravidade) => {
    const slas = {
      ALTA: { tempo: 8, tipo: 'UTI', cor: '#f44336' },
      MEDIA: { tempo: 15, tipo: 'Básica', cor: '#ff9800' },
      BAIXA: { tempo: 30, tipo: 'Básica', cor: '#4caf50' }
    };
    return slas[gravidade] || slas.MEDIA;
  };

  if (carregando && !ocorrenciaSelecionada) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando ocorrências..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Despacho de Ambulâncias</h1>
        <p>Seleção inteligente de ambulâncias por SLA e disponibilidade</p>
      </div>

      <div className="despacho-container">
        {/* Lista de Ocorrências Abertas */}
        <div className="ocorrencias-painel">
          <div className="painel-header">
            <h2>Ocorrências Abertas ({ocorrenciasAbertas.length})</h2>
          </div>
          
          <div className="ocorrencias-lista">
            {ocorrenciasAbertas.length === 0 ? (
              <div className="empty-message">
                <p>✅ Nenhuma ocorrência em aberto</p>
              </div>
            ) : (
              ocorrenciasAbertas.map((ocorrencia) => {
                const sla = getSLAInfo(ocorrencia.gravidade);
                return (
                  <div
                    key={ocorrencia.id}
                    className={`ocorrencia-item ${ocorrenciaSelecionada?.id === ocorrencia.id ? 'selecionada' : ''}`}
                    onClick={() => handleSelecionarOcorrencia(ocorrencia)}
                  >
                    <div className="ocorrencia-header">
                      <span className="ocorrencia-id">#{ocorrencia.id}</span>
                      <span
                        className="badge"
                        style={{ backgroundColor: sla.cor }}
                      >
                        {ocorrencia.gravidade}
                      </span>
                    </div>
                    
                    <div className="ocorrencia-info">
                      <p className="ocorrencia-local">📍 {ocorrencia.local}</p>
                      <p className="ocorrencia-tipo">{ocorrencia.tipo}</p>
                      <p className="ocorrencia-sla">
                        ⏱️ SLA: {sla.tempo} min | 🚑 {sla.tipo}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Painel de Ambulâncias Aptas */}
        <div className="ambulancias-painel">
          {!ocorrenciaSelecionada ? (
            <div className="painel-vazio">
              <p>← Selecione uma ocorrência para ver as ambulâncias disponíveis</p>
            </div>
          ) : (
            <>
              <div className="painel-header">
                <h2>Ambulâncias Aptas</h2>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => buscarAmbulanciasAptas(ocorrenciaSelecionada.id)}
                  disabled={carregando}
                >
                  🔄 Atualizar
                </button>
              </div>

              {mensagem.texto && (
                <div className={`alert alert-${mensagem.tipo}`}>
                  {mensagem.texto}
                </div>
              )}

              {carregando ? (
                <LoadingSpinner message="Buscando ambulâncias..." />
              ) : ambulanciasAptas.length === 0 ? (
                <div className="empty-message">
                  <p>⚠️ Nenhuma ambulância disponível atende os critérios</p>
                  <small>Verifique: disponibilidade, tipo necessário e distância dentro do SLA</small>
                </div>
              ) : (
                <div className="ambulancias-lista">
                  {ambulanciasAptas.map((ambulancia) => (
                    <div key={ambulancia.id} className="ambulancia-item">
                      <div className="ambulancia-header">
                        <h3>🚑 {ambulancia.placa}</h3>
                        <span className={`badge badge-${ambulancia.tipo.toLowerCase()}`}>
                          {ambulancia.tipo}
                        </span>
                      </div>

                      <div className="ambulancia-detalhes">
                        <div className="detalhe">
                          <span className="label">Base:</span>
                          <span className="value">{ambulancia.base}</span>
                        </div>
                        
                        <div className="detalhe">
                          <span className="label">Distância:</span>
                          <span className="value destacado">
                            {ambulancia.distancia?.toFixed(1)} km
                          </span>
                        </div>
                        
                        <div className="detalhe">
                          <span className="label">Tempo Estimado:</span>
                          <span className="value destacado">
                            {ambulancia.tempoEstimado || ambulancia.distancia?.toFixed(0)} min
                          </span>
                        </div>

                        {ambulancia.equipe && (
                          <div className="detalhe">
                            <span className="label">Equipe:</span>
                            <span className="value">{ambulancia.equipe}</span>
                          </div>
                        )}
                      </div>

                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => handleDespachar(ambulancia.id)}
                        disabled={despachando}
                      >
                        {despachando ? 'Despachando...' : '🚀 Despachar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Despacho;
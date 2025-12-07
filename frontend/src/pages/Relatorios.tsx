import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Banner from '../components/common/Banner';
import { Activity, MapPin, Clock, BarChart3 } from 'lucide-react';
import './Relatorios.css';
import relatorioService, { AtendimentoPorBairro, TempoMedioPorTipo } from '../services/relatorio';
import ocorrenciaService, { Ocorrencia } from '../services/ocorrencia';

interface Dados {
  totalAtendimentos: number;
  tempoMedioGeral: number;
  ocorrenciasPorBairro: AtendimentoPorBairro[];
  tempoMedioPorTipo: TempoMedioPorTipo[];
  historico: Ocorrencia[];
}

/**
 * Tela de relatórios e análises operacionais.
 * Apresenta estatísticas consolidadas e gráficos de desempenho.
 * [RF07] Relatórios Gerenciais.
 */
const Relatorios: React.FC = () => {
  const [carregando, setCarregando] = useState<boolean>(true);

  const [dados, setDados] = useState<Dados>({
    totalAtendimentos: 0,
    tempoMedioGeral: 0,
    ocorrenciasPorBairro: [],
    tempoMedioPorTipo: [],
    historico: [],
  });

  useEffect(() => {
    carregarDados();
  }, []);

  // Carrega e agrega dados de múltiplas fontes
  const carregarDados = async (): Promise<void> => {
    try {
      setCarregando(true);

      const [bairrosData, tempoData, ocorrenciasData] = await Promise.all([
        relatorioService.getAtendimentosPorBairro(),
        relatorioService.getTempoMedioPorTipo(),
        ocorrenciaService.listarTodas()
      ]);

      // Calcular média geral ponderada ou simples
      const totalTempo = tempoData.reduce((acc, curr) => acc + curr.tempoMedioMinutos, 0);
      const mediaGeral = tempoData.length > 0 ? totalTempo / tempoData.length : 0;

      const historicoOrdenado = [...ocorrenciasData].sort((a, b) => (b.id || 0) - (a.id || 0));

      setDados({
        totalAtendimentos: ocorrenciasData.length,
        tempoMedioGeral: parseFloat(mediaGeral.toFixed(1)),
        ocorrenciasPorBairro: bairrosData,
        tempoMedioPorTipo: tempoData,
        historico: historicoOrdenado,
      });

    } catch (erro) {
      console.error('Erro ao carregar relatórios:', erro);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando relatórios..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Banner
        title="Relatórios"
        subtitle="Análises e estatísticas operacionais"
      />

      {/* CARDS DE ESTATÍSTICA */}
      <div className="stats-grid">
        <div className="stat-card stat-secondary">
          <BarChart3 size={48} className="stat-icon stat-icon-secondary" />
          <div>
            <h3>{dados.totalAtendimentos}</h3>
            <p>Total de Ocorrências</p>
          </div>
        </div>

        <div className="stat-card stat-primary">
          <Clock size={48} className="stat-icon stat-icon-primary" />
          <div>
            <h3>{dados.tempoMedioGeral} min</h3>
            <p>Tempo Médio</p>
          </div>
        </div>

        <div className="stat-card stat-secondary">
          <Activity size={48} className="stat-icon stat-icon-secondary" />
          <div>
            <h3>{dados.historico.filter(o => o.status === 'CONCLUIDA').length}</h3>
            <p>Atendimentos Concluídos</p>
          </div>
        </div>

        <div className="stat-card stat-primary">
          <Activity size={48} className="stat-icon stat-icon-primary" />
          <div>
            <h3>{dados.historico.filter(o => o.status === 'CANCELADA').length}</h3>
            <p>Atendimentos Cancelados</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">

        {/* OCORRÊNCIAS POR BAIRRO */}
        {/* [Banco de Dados II - Exibicao de Resultados] Grafico gerado a partir da consulta SQL de ocorrencias por bairro */}
        <div className="card">
          <div className="card-header">
            <h2>Ocorrências por Bairro</h2>
          </div>

          <div className="card-body">
            {dados.ocorrenciasPorBairro.length === 0 ? (
              <p className="text-center">Nenhum dado disponível.</p>
            ) : (
              <div className="bairros-chart">
                {dados.ocorrenciasPorBairro.map((item, index) => (
                  <div key={index} className="bairro-row">
                    <span className="bairro-nome">
                      <MapPin size={16} /> {item.bairro}
                    </span>

                    <div className="barra">
                      <div
                        className="barra-preenchida"
                        style={{ width: `${Math.min(item.quantidade * 10, 100)}%` }}
                      ></div>
                    </div>

                    <span className="bairro-qtd">{item.quantidade}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TEMPO MÉDIO POR TIPO (NOVO CARD) */}
        <div className="card">
          <div className="card-header">
            <h2>Média de Tempo por Tipo de Ambulância</h2>
          </div>
          <div className="card-body">
            {dados.tempoMedioPorTipo.length === 0 ? (
              <p className="text-center">Nenhum dado disponível.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Tempo Médio (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.tempoMedioPorTipo.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.tipoAmbulancia}</td>
                      <td>{item.tempoMedioMinutos.toFixed(2)} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;

import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Calendar, Activity, MapPin, Clock, BarChart3 } from 'lucide-react';
import './Relatorios.css';

const Relatorios = () => {
  const [carregando, setCarregando] = useState(true);
  const [filtroData, setFiltroData] = useState({
    inicio: '',
    fim: '',
  });

  const [dados, setDados] = useState({
    totalAtendimentos: 0,
    tempoMedio: 0,
    ocorrenciasPorBairro: [],
    historico: [],
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);

      // Aqui futuramente conectará com API
      await new Promise((res) => setTimeout(res, 800));

      setDados({
        totalAtendimentos: 128,
        tempoMedio: 12,
        ocorrenciasPorBairro: [
          { bairro: 'Centro', qtd: 40 },
          { bairro: 'Industrial', qtd: 21 },
          { bairro: 'Santa Luzia', qtd: 15 },
          { bairro: 'Planalto', qtd: 10 },
        ],
        historico: [
          { id: 301, bairro: 'Centro', gravidade: 'Alta', tempoResposta: 8 },
          { id: 287, bairro: 'Santa Luzia', gravidade: 'Média', tempoResposta: 14 },
          { id: 279, bairro: 'Industrial', gravidade: 'Baixa', tempoResposta: 16 },
        ],
      });
    } catch (erro) {
      console.error('Erro ao carregar relatórios:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const atualizarFiltro = (campo, valor) => {
    setFiltroData({ ...filtroData, [campo]: valor });
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
      <div className="page-header">
        <h1>Relatórios</h1>
        <p>Análises e estatísticas operacionais</p>
      </div>

      {/* FILTROS */}
      <div className="card mb-2">
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label>Data inicial</label>
              <input
                type="date"
                value={filtroData.inicio}
                onChange={(e) => atualizarFiltro('inicio', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Data final</label>
              <input
                type="date"
                value={filtroData.fim}
                onChange={(e) => atualizarFiltro('fim', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICA */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <BarChart3 size={48} className="stat-icon" />
          <div>
            <h3>{dados.totalAtendimentos}</h3>
            <p>Total de Atendimentos</p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <Clock size={48} className="stat-icon" />
          <div>
            <h3>{dados.tempoMedio} min</h3>
            <p>Tempo Médio de Resposta</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <Activity size={48} className="stat-icon" />
          <div>
            <h3>{dados.historico.length}</h3>
            <p>Atendimentos Registrados</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">

        {/* OCORRÊNCIAS POR BAIRRO */}
        <div className="card">
          <div className="card-header">
            <h2>Ocorrências por Bairro</h2>
          </div>

          <div className="card-body">
            <div className="bairros-chart">
              {dados.ocorrenciasPorBairro.map((item, index) => (
                <div key={index} className="bairro-row">
                  <span className="bairro-nome">
                    <MapPin size={16} /> {item.bairro}
                  </span>

                  <div className="barra">
                    <div
                      className="barra-preenchida"
                      style={{ width: `${item.qtd * 2}%` }}
                    ></div>
                  </div>

                  <span className="bairro-qtd">{item.qtd}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="card">
          <div className="card-header">
            <h2>Histórico de Atendimentos</h2>
          </div>

          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Bairro</th>
                    <th>Gravidade</th>
                    <th>Tempo Resposta</th>
                  </tr>
                </thead>

                <tbody>
                  {dados.historico.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.bairro}</td>
                      <td>{item.gravidade}</td>
                      <td>{item.tempoResposta} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Relatorios;

package sosrota.backend.dto;

/**
 * Objeto de Transferência de Dados (DTO) para o Dashboard.
 * Agrega indicadores de desempenho e status do sistema.
 * [RF07] Visualização de Dashboard.
 * [Interface de Comunicação] Dados para o Frontend.
 */
public class DashboardDTO {
    private int ocorrenciasAbertas;
    private int atendimentosHoje;
    private int ambulanciasDisponiveis;
    private int ambulanciasTotal;
    private double tempoMedioResposta;
    private int equipesAtivas;
    private int profissionaisCadastrados;

    // Getters and Setters
    public int getProfissionaisCadastrados() {
        return profissionaisCadastrados;
    }

    public void setProfissionaisCadastrados(int profissionaisCadastrados) {
        this.profissionaisCadastrados = profissionaisCadastrados;
    }
    public int getOcorrenciasAbertas() {
        return ocorrenciasAbertas;
    }

    public void setOcorrenciasAbertas(int ocorrenciasAbertas) {
        this.ocorrenciasAbertas = ocorrenciasAbertas;
    }

    public int getAtendimentosHoje() {
        return atendimentosHoje;
    }

    public void setAtendimentosHoje(int atendimentosHoje) {
        this.atendimentosHoje = atendimentosHoje;
    }

    public int getAmbulanciasDisponiveis() {
        return ambulanciasDisponiveis;
    }

    public void setAmbulanciasDisponiveis(int ambulanciasDisponiveis) {
        this.ambulanciasDisponiveis = ambulanciasDisponiveis;
    }

    public int getAmbulanciasTotal() {
        return ambulanciasTotal;
    }

    public void setAmbulanciasTotal(int ambulanciasTotal) {
        this.ambulanciasTotal = ambulanciasTotal;
    }

    public int getEquipesAtivas() {
        return equipesAtivas;
    }

    public void setEquipesAtivas(int equipesAtivas) {
        this.equipesAtivas = equipesAtivas;
    }
}

package sosrota.backend.service;

import org.springframework.stereotype.Service;

@Service
public class GrafoService {

    // Stub temporário para desenvolvimento.
    // Substitua mais tarde por Dijkstra.
    public double calcularDistanciaKm(Long origemBaseId, Long destinoBaseId) {
        if (origemBaseId == null || destinoBaseId == null) return 5.0;

        if (origemBaseId.equals(destinoBaseId)) return 0.5;

        return Math.abs(origemBaseId - destinoBaseId) + 2.0;
    }
}

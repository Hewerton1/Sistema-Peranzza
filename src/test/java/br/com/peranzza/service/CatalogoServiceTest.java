package br.com.peranzza.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class CatalogoServiceTest {
    @Test
    void listaProdutosImportadosDoCardapio() {
        var servico = new CatalogoService(new ObjectMapper());
        assertEquals(125, servico.listar().itens().size());
        var tradicional = servico.listar().itens().stream()
                .filter(p -> p.name().equals("ALHO E ÓLEO")).findFirst().orElseThrow();
        assertEquals(0, new BigDecimal("30").compareTo(tradicional.prices().get("P")));
        assertFalse(servico.listar().bordas().isEmpty());
    }
}

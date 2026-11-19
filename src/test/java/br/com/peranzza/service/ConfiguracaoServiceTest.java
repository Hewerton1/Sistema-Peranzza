package br.com.peranzza.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ConfiguracaoServiceTest {
    @Test
    void temNumeroWhatsAppValido() {
        var config = new ConfiguracaoService(new ObjectMapper()).obter();
        assertEquals("5581998828250", config.whatsapp());
        assertTrue(config.foto().endsWith("foto-pizzaria.jpg"));
    }
}

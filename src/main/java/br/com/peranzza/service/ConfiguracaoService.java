package br.com.peranzza.service;

import br.com.peranzza.model.Configuracao;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class ConfiguracaoService {
    private final Configuracao configuracao;

    public ConfiguracaoService(ObjectMapper mapper) {
        try (InputStream arquivo = new ClassPathResource("dados/configuracao.json").getInputStream()) {
            this.configuracao = mapper.readValue(arquivo, Configuracao.class);
        } catch (IOException erro) {
            throw new IllegalStateException("Não foi possível carregar a configuração", erro);
        }
        if (configuracao.whatsapp() == null || !configuracao.whatsapp().matches("\\d{13}")) {
            throw new IllegalStateException("WhatsApp deve ter 13 dígitos: 55 + DDD + telefone");
        }
    }

    public Configuracao obter() { return configuracao; }
}

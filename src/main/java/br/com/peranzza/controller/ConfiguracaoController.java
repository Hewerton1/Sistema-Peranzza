package br.com.peranzza.controller;

import br.com.peranzza.model.Configuracao;
import br.com.peranzza.service.ConfiguracaoService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ConfiguracaoController {
    private final ConfiguracaoService configuracoes;
    private final ObjectMapper mapper;

    public ConfiguracaoController(ConfiguracaoService configuracoes, ObjectMapper mapper) {
        this.configuracoes = configuracoes;
        this.mapper = mapper;
    }

    @GetMapping("/configuracao")
    public Configuracao ler() { return configuracoes.obter(); }

    // O navegador carrega a configuração antes do carrinho e do WhatsApp.
    @GetMapping(value="/configuracao.js", produces="application/javascript;charset=UTF-8")
    public ResponseEntity<String> script() throws JsonProcessingException {
        String codigo = "window.PERANZZA_CONFIG = " + mapper.writeValueAsString(configuracoes.obter()) + ";";
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .contentType(MediaType.parseMediaType("application/javascript;charset=UTF-8"))
                .body(codigo);
    }
}

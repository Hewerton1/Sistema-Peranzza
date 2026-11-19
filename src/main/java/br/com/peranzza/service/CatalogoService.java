package br.com.peranzza.service;

import br.com.peranzza.model.Catalogo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;

@Service
public class CatalogoService {
    private final Catalogo catalogo;

    public CatalogoService(ObjectMapper mapper) {
        try (InputStream arquivo = new ClassPathResource("dados/cardapio.json").getInputStream()) {
            this.catalogo = mapper.readValue(arquivo, Catalogo.class);
        } catch (IOException erro) {
            throw new IllegalStateException("Não foi possível carregar o cardápio", erro);
        }
        validar(catalogo);
    }

    public Catalogo listar() { return catalogo; }

    private void validar(Catalogo dados) {
        if (dados == null || dados.itens() == null || dados.itens().isEmpty())
            throw new IllegalStateException("O catálogo está vazio");
        var identificadores = new HashSet<Integer>();
        for (var produto : dados.itens()) {
            if (!identificadores.add(produto.id()))
                throw new IllegalStateException("ID de produto repetido: " + produto.id());
            if (produto.name() == null || produto.name().isBlank() ||
                    produto.prices() == null || produto.prices().isEmpty())
                throw new IllegalStateException("Produto sem nome ou preço: " + produto.id());
            for (var valor : produto.prices().values())
                if (valor == null || valor.signum() < 0)
                    throw new IllegalStateException("Preço inválido: " + produto.id());
        }
    }
}

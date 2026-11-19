package br.com.peranzza.model;

import java.util.List;

public record Catalogo(List<Produto> itens, List<Borda> bordas) { }

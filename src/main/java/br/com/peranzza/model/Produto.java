package br.com.peranzza.model;

import java.math.BigDecimal;
import java.util.Map;

// Um produto e os preços de cada tamanho (P, M, G, GG, Unidade etc.).
public record Produto(int id, String cat, String name, String desc,
                      Map<String, BigDecimal> prices, String kind) { }

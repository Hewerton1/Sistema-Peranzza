package br.com.peranzza.controller;

import br.com.peranzza.model.Catalogo;
import br.com.peranzza.service.CatalogoService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CatalogoController {
    private final CatalogoService catalogo;

    public CatalogoController(CatalogoService catalogo) { this.catalogo = catalogo; }

    @GetMapping("/catalogo")
    public ResponseEntity<Catalogo> listar() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(catalogo.listar());
    }
}

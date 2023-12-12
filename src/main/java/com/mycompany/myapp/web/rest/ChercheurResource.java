package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Chercheur;
import com.mycompany.myapp.repository.ChercheurRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Chercheur}.
 */
@RestController
@RequestMapping("/api/chercheurs")
@Transactional
public class ChercheurResource {

    private final Logger log = LoggerFactory.getLogger(ChercheurResource.class);

    private static final String ENTITY_NAME = "chercheur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChercheurRepository chercheurRepository;

    public ChercheurResource(ChercheurRepository chercheurRepository) {
        this.chercheurRepository = chercheurRepository;
    }

    /**
     * {@code POST  /chercheurs} : Create a new chercheur.
     *
     * @param chercheur the chercheur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chercheur, or with status {@code 400 (Bad Request)} if the chercheur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Chercheur> createChercheur(@Valid @RequestBody Chercheur chercheur) throws URISyntaxException {
        log.debug("REST request to save Chercheur : {}", chercheur);
        if (chercheur.getChno() != null) {
            throw new BadRequestAlertException("A new chercheur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chercheur result = chercheurRepository.save(chercheur);
        return ResponseEntity
            .created(new URI("/api/chercheurs/" + result.getChno()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getChno().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chercheurs/:chno} : Updates an existing chercheur.
     *
     * @param chno the id of the chercheur to save.
     * @param chercheur the chercheur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chercheur,
     * or with status {@code 400 (Bad Request)} if the chercheur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chercheur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{chno}")
    public ResponseEntity<Chercheur> updateChercheur(
        @PathVariable(value = "chno", required = false) final Long chno,
        @Valid @RequestBody Chercheur chercheur
    ) throws URISyntaxException {
        log.debug("REST request to update Chercheur : {}, {}", chno, chercheur);
        if (chercheur.getChno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(chno, chercheur.getChno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chercheurRepository.existsById(chno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Chercheur result = chercheurRepository.save(chercheur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chercheur.getChno().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chercheurs/:chno} : Partial updates given fields of an existing chercheur, field will ignore if it is null
     *
     * @param chno the id of the chercheur to save.
     * @param chercheur the chercheur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chercheur,
     * or with status {@code 400 (Bad Request)} if the chercheur is not valid,
     * or with status {@code 404 (Not Found)} if the chercheur is not found,
     * or with status {@code 500 (Internal Server Error)} if the chercheur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{chno}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Chercheur> partialUpdateChercheur(
        @PathVariable(value = "chno", required = false) final Long chno,
        @NotNull @RequestBody Chercheur chercheur
    ) throws URISyntaxException {
        log.debug("REST request to partial update Chercheur partially : {}, {}", chno, chercheur);
        if (chercheur.getChno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(chno, chercheur.getChno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chercheurRepository.existsById(chno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Chercheur> result = chercheurRepository
            .findById(chercheur.getChno())
            .map(existingChercheur -> {
                if (chercheur.getChnom() != null) {
                    existingChercheur.setChnom(chercheur.getChnom());
                }
                if (chercheur.getGrade() != null) {
                    existingChercheur.setGrade(chercheur.getGrade());
                }
                if (chercheur.getStatut() != null) {
                    existingChercheur.setStatut(chercheur.getStatut());
                }
                if (chercheur.getDaterecrut() != null) {
                    existingChercheur.setDaterecrut(chercheur.getDaterecrut());
                }
                if (chercheur.getSalaire() != null) {
                    existingChercheur.setSalaire(chercheur.getSalaire());
                }
                if (chercheur.getPrime() != null) {
                    existingChercheur.setPrime(chercheur.getPrime());
                }
                if (chercheur.getEmail() != null) {
                    existingChercheur.setEmail(chercheur.getEmail());
                }

                return existingChercheur;
            })
            .map(chercheurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, chercheur.getChno().toString())
        );
    }

    /**
     * {@code GET  /chercheurs} : get all the chercheurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chercheurs in body.
     */
    @GetMapping("")
    public List<Chercheur> getAllChercheurs() {
        log.debug("REST request to get all Chercheurs");
        return chercheurRepository.findAll();
    }

    /**
     * {@code GET  /chercheurs/:id} : get the "id" chercheur.
     *
     * @param id the id of the chercheur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chercheur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Chercheur> getChercheur(@PathVariable("id") Long id) {
        log.debug("REST request to get Chercheur : {}", id);
        Optional<Chercheur> chercheur = chercheurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chercheur);
    }

    /**
     * {@code DELETE  /chercheurs/:id} : delete the "id" chercheur.
     *
     * @param id the id of the chercheur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChercheur(@PathVariable("id") Long id) {
        log.debug("REST request to delete Chercheur : {}", id);
        chercheurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

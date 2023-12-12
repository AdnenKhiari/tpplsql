package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Faculte;
import com.mycompany.myapp.repository.FaculteRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Faculte}.
 */
@RestController
@RequestMapping("/api/facultes")
@Transactional
public class FaculteResource {

    private final Logger log = LoggerFactory.getLogger(FaculteResource.class);

    private static final String ENTITY_NAME = "faculte";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FaculteRepository faculteRepository;

    public FaculteResource(FaculteRepository faculteRepository) {
        this.faculteRepository = faculteRepository;
    }

    /**
     * {@code POST  /facultes} : Create a new faculte.
     *
     * @param faculte the faculte to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new faculte, or with status {@code 400 (Bad Request)} if the faculte has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Faculte> createFaculte(@Valid @RequestBody Faculte faculte) throws URISyntaxException {
        log.debug("REST request to save Faculte : {}", faculte);
        if (faculte.getFacno() != null) {
            throw new BadRequestAlertException("A new faculte cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Faculte result = faculteRepository.save(faculte);
        return ResponseEntity
            .created(new URI("/api/facultes/" + result.getFacno()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getFacno().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /facultes/:facno} : Updates an existing faculte.
     *
     * @param facno the id of the faculte to save.
     * @param faculte the faculte to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated faculte,
     * or with status {@code 400 (Bad Request)} if the faculte is not valid,
     * or with status {@code 500 (Internal Server Error)} if the faculte couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{facno}")
    public ResponseEntity<Faculte> updateFaculte(
        @PathVariable(value = "facno", required = false) final Long facno,
        @Valid @RequestBody Faculte faculte
    ) throws URISyntaxException {
        log.debug("REST request to update Faculte : {}, {}", facno, faculte);
        if (faculte.getFacno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(facno, faculte.getFacno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!faculteRepository.existsById(facno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Faculte result = faculteRepository.save(faculte);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, faculte.getFacno().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /facultes/:facno} : Partial updates given fields of an existing faculte, field will ignore if it is null
     *
     * @param facno the id of the faculte to save.
     * @param faculte the faculte to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated faculte,
     * or with status {@code 400 (Bad Request)} if the faculte is not valid,
     * or with status {@code 404 (Not Found)} if the faculte is not found,
     * or with status {@code 500 (Internal Server Error)} if the faculte couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{facno}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Faculte> partialUpdateFaculte(
        @PathVariable(value = "facno", required = false) final Long facno,
        @NotNull @RequestBody Faculte faculte
    ) throws URISyntaxException {
        log.debug("REST request to partial update Faculte partially : {}, {}", facno, faculte);
        if (faculte.getFacno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(facno, faculte.getFacno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!faculteRepository.existsById(facno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Faculte> result = faculteRepository
            .findById(faculte.getFacno())
            .map(existingFaculte -> {
                if (faculte.getFacnom() != null) {
                    existingFaculte.setFacnom(faculte.getFacnom());
                }
                if (faculte.getAdresse() != null) {
                    existingFaculte.setAdresse(faculte.getAdresse());
                }
                if (faculte.getLibelle() != null) {
                    existingFaculte.setLibelle(faculte.getLibelle());
                }

                return existingFaculte;
            })
            .map(faculteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, faculte.getFacno().toString())
        );
    }

    /**
     * {@code GET  /facultes} : get all the facultes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of facultes in body.
     */
    @GetMapping("")
    public List<Faculte> getAllFacultes() {
        log.debug("REST request to get all Facultes");
        return faculteRepository.findAll();
    }

    /**
     * {@code GET  /facultes/:id} : get the "id" faculte.
     *
     * @param id the id of the faculte to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the faculte, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Faculte> getFaculte(@PathVariable("id") Long id) {
        log.debug("REST request to get Faculte : {}", id);
        Optional<Faculte> faculte = faculteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(faculte);
    }

    /**
     * {@code DELETE  /facultes/:id} : delete the "id" faculte.
     *
     * @param id the id of the faculte to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculte(@PathVariable("id") Long id) {
        log.debug("REST request to delete Faculte : {}", id);
        faculteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

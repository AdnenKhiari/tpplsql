package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Laboratoire;
import com.mycompany.myapp.repository.LaboratoireRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Laboratoire}.
 */
@RestController
@RequestMapping("/api/laboratoires")
@Transactional
public class LaboratoireResource {

    private final Logger log = LoggerFactory.getLogger(LaboratoireResource.class);

    private static final String ENTITY_NAME = "laboratoire";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LaboratoireRepository laboratoireRepository;

    public LaboratoireResource(LaboratoireRepository laboratoireRepository) {
        this.laboratoireRepository = laboratoireRepository;
    }

    /**
     * {@code POST  /laboratoires} : Create a new laboratoire.
     *
     * @param laboratoire the laboratoire to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new laboratoire, or with status {@code 400 (Bad Request)} if the laboratoire has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Laboratoire> createLaboratoire(@Valid @RequestBody Laboratoire laboratoire) throws URISyntaxException {
        log.debug("REST request to save Laboratoire : {}", laboratoire);
        if (laboratoire.getLabno() != null) {
            throw new BadRequestAlertException("A new laboratoire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Laboratoire result = laboratoireRepository.save(laboratoire);
        return ResponseEntity
            .created(new URI("/api/laboratoires/" + result.getLabno()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getLabno().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /laboratoires/:labno} : Updates an existing laboratoire.
     *
     * @param labno the id of the laboratoire to save.
     * @param laboratoire the laboratoire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laboratoire,
     * or with status {@code 400 (Bad Request)} if the laboratoire is not valid,
     * or with status {@code 500 (Internal Server Error)} if the laboratoire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{labno}")
    public ResponseEntity<Laboratoire> updateLaboratoire(
        @PathVariable(value = "labno", required = false) final Long labno,
        @Valid @RequestBody Laboratoire laboratoire
    ) throws URISyntaxException {
        log.debug("REST request to update Laboratoire : {}, {}", labno, laboratoire);
        if (laboratoire.getLabno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(labno, laboratoire.getLabno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laboratoireRepository.existsById(labno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Laboratoire result = laboratoireRepository.save(laboratoire);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, laboratoire.getLabno().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /laboratoires/:labno} : Partial updates given fields of an existing laboratoire, field will ignore if it is null
     *
     * @param labno the id of the laboratoire to save.
     * @param laboratoire the laboratoire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laboratoire,
     * or with status {@code 400 (Bad Request)} if the laboratoire is not valid,
     * or with status {@code 404 (Not Found)} if the laboratoire is not found,
     * or with status {@code 500 (Internal Server Error)} if the laboratoire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{labno}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Laboratoire> partialUpdateLaboratoire(
        @PathVariable(value = "labno", required = false) final Long labno,
        @NotNull @RequestBody Laboratoire laboratoire
    ) throws URISyntaxException {
        log.debug("REST request to partial update Laboratoire partially : {}, {}", labno, laboratoire);
        if (laboratoire.getLabno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(labno, laboratoire.getLabno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laboratoireRepository.existsById(labno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Laboratoire> result = laboratoireRepository
            .findById(laboratoire.getLabno())
            .map(existingLaboratoire -> {
                if (laboratoire.getLabnom() != null) {
                    existingLaboratoire.setLabnom(laboratoire.getLabnom());
                }

                return existingLaboratoire;
            })
            .map(laboratoireRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, laboratoire.getLabno().toString())
        );
    }

    /**
     * {@code GET  /laboratoires} : get all the laboratoires.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of laboratoires in body.
     */
    @GetMapping("")
    public List<Laboratoire> getAllLaboratoires() {
        log.debug("REST request to get all Laboratoires");
        return laboratoireRepository.findAll();
    }

    /**
     * {@code GET  /laboratoires/:id} : get the "id" laboratoire.
     *
     * @param id the id of the laboratoire to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the laboratoire, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Laboratoire> getLaboratoire(@PathVariable("id") Long id) {
        log.debug("REST request to get Laboratoire : {}", id);
        Optional<Laboratoire> laboratoire = laboratoireRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(laboratoire);
    }

    /**
     * {@code DELETE  /laboratoires/:id} : delete the "id" laboratoire.
     *
     * @param id the id of the laboratoire to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLaboratoire(@PathVariable("id") Long id) {
        log.debug("REST request to delete Laboratoire : {}", id);
        laboratoireRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

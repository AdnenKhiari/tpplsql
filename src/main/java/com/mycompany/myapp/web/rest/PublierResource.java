package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Publier;
import com.mycompany.myapp.repository.PublierRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Publier}.
 */
@RestController
@RequestMapping("/api/publiers")
@Transactional
public class PublierResource {

    private final Logger log = LoggerFactory.getLogger(PublierResource.class);

    private static final String ENTITY_NAME = "publier";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PublierRepository publierRepository;

    public PublierResource(PublierRepository publierRepository) {
        this.publierRepository = publierRepository;
    }

    /**
     * {@code POST  /publiers} : Create a new publier.
     *
     * @param publier the publier to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new publier, or with status {@code 400 (Bad Request)} if the publier has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Publier> createPublier(@Valid @RequestBody Publier publier) throws URISyntaxException {
        log.debug("REST request to save Publier : {}", publier);
        if (publier.getPubId() != null) {
            throw new BadRequestAlertException("A new publier cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Publier result = publierRepository.save(publier);
        return ResponseEntity
            .created(new URI("/api/publiers/" + result.getPubId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getPubId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /publiers/:pubId} : Updates an existing publier.
     *
     * @param pubId the id of the publier to save.
     * @param publier the publier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated publier,
     * or with status {@code 400 (Bad Request)} if the publier is not valid,
     * or with status {@code 500 (Internal Server Error)} if the publier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{pubId}")
    public ResponseEntity<Publier> updatePublier(
        @PathVariable(value = "pubId", required = false) final Long pubId,
        @Valid @RequestBody Publier publier
    ) throws URISyntaxException {
        log.debug("REST request to update Publier : {}, {}", pubId, publier);
        if (publier.getPubId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(pubId, publier.getPubId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!publierRepository.existsById(pubId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Publier result = publierRepository.save(publier);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, publier.getPubId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /publiers/:pubId} : Partial updates given fields of an existing publier, field will ignore if it is null
     *
     * @param pubId the id of the publier to save.
     * @param publier the publier to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated publier,
     * or with status {@code 400 (Bad Request)} if the publier is not valid,
     * or with status {@code 404 (Not Found)} if the publier is not found,
     * or with status {@code 500 (Internal Server Error)} if the publier couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{pubId}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Publier> partialUpdatePublier(
        @PathVariable(value = "pubId", required = false) final Long pubId,
        @NotNull @RequestBody Publier publier
    ) throws URISyntaxException {
        log.debug("REST request to partial update Publier partially : {}, {}", pubId, publier);
        if (publier.getPubId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(pubId, publier.getPubId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!publierRepository.existsById(pubId)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Publier> result = publierRepository
            .findById(publier.getPubId())
            .map(existingPublier -> {
                if (publier.getRang() != null) {
                    existingPublier.setRang(publier.getRang());
                }

                return existingPublier;
            })
            .map(publierRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, publier.getPubId().toString())
        );
    }

    /**
     * {@code GET  /publiers} : get all the publiers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of publiers in body.
     */
    @GetMapping("")
    public List<Publier> getAllPubliers() {
        log.debug("REST request to get all Publiers");
        return publierRepository.findAll();
    }

    /**
     * {@code GET  /publiers/:id} : get the "id" publier.
     *
     * @param id the id of the publier to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the publier, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Publier> getPublier(@PathVariable("id") Long id) {
        log.debug("REST request to get Publier : {}", id);
        Optional<Publier> publier = publierRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(publier);
    }

    /**
     * {@code DELETE  /publiers/:id} : delete the "id" publier.
     *
     * @param id the id of the publier to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublier(@PathVariable("id") Long id) {
        log.debug("REST request to delete Publier : {}", id);
        publierRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

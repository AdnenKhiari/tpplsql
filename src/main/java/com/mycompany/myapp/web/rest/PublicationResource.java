package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Publication;
import com.mycompany.myapp.repository.PublicationRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Publication}.
 */
@RestController
@RequestMapping("/api/publications")
@Transactional
public class PublicationResource {

    private final Logger log = LoggerFactory.getLogger(PublicationResource.class);

    private static final String ENTITY_NAME = "publication";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PublicationRepository publicationRepository;

    public PublicationResource(PublicationRepository publicationRepository) {
        this.publicationRepository = publicationRepository;
    }

    /**
     * {@code POST  /publications} : Create a new publication.
     *
     * @param publication the publication to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new publication, or with status {@code 400 (Bad Request)} if the publication has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Publication> createPublication(@Valid @RequestBody Publication publication) throws URISyntaxException {
        log.debug("REST request to save Publication : {}", publication);
        if (publication.getPubno() != null) {
            throw new BadRequestAlertException("A new publication cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Publication result = publicationRepository.save(publication);
        return ResponseEntity
            .created(new URI("/api/publications/" + result.getPubno()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getPubno().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /publications/:pubno} : Updates an existing publication.
     *
     * @param pubno the id of the publication to save.
     * @param publication the publication to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated publication,
     * or with status {@code 400 (Bad Request)} if the publication is not valid,
     * or with status {@code 500 (Internal Server Error)} if the publication couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{pubno}")
    public ResponseEntity<Publication> updatePublication(
        @PathVariable(value = "pubno", required = false) final Long pubno,
        @Valid @RequestBody Publication publication
    ) throws URISyntaxException {
        log.debug("REST request to update Publication : {}, {}", pubno, publication);
        if (publication.getPubno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(pubno, publication.getPubno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!publicationRepository.existsById(pubno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Publication result = publicationRepository.save(publication);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, publication.getPubno().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /publications/:pubno} : Partial updates given fields of an existing publication, field will ignore if it is null
     *
     * @param pubno the id of the publication to save.
     * @param publication the publication to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated publication,
     * or with status {@code 400 (Bad Request)} if the publication is not valid,
     * or with status {@code 404 (Not Found)} if the publication is not found,
     * or with status {@code 500 (Internal Server Error)} if the publication couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{pubno}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Publication> partialUpdatePublication(
        @PathVariable(value = "pubno", required = false) final Long pubno,
        @NotNull @RequestBody Publication publication
    ) throws URISyntaxException {
        log.debug("REST request to partial update Publication partially : {}, {}", pubno, publication);
        if (publication.getPubno() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(pubno, publication.getPubno())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!publicationRepository.existsById(pubno)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Publication> result = publicationRepository
            .findById(publication.getPubno())
            .map(existingPublication -> {
                if (publication.getTitre() != null) {
                    existingPublication.setTitre(publication.getTitre());
                }
                if (publication.getTheme() != null) {
                    existingPublication.setTheme(publication.getTheme());
                }
                if (publication.getType() != null) {
                    existingPublication.setType(publication.getType());
                }
                if (publication.getVolume() != null) {
                    existingPublication.setVolume(publication.getVolume());
                }
                if (publication.getDate() != null) {
                    existingPublication.setDate(publication.getDate());
                }
                if (publication.getApparition() != null) {
                    existingPublication.setApparition(publication.getApparition());
                }
                if (publication.getEditeur() != null) {
                    existingPublication.setEditeur(publication.getEditeur());
                }

                return existingPublication;
            })
            .map(publicationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, publication.getPubno().toString())
        );
    }

    /**
     * {@code GET  /publications} : get all the publications.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of publications in body.
     */
    @GetMapping("")
    public List<Publication> getAllPublications() {
        log.debug("REST request to get all Publications");
        return publicationRepository.findAll();
    }

    /**
     * {@code GET  /publications/:id} : get the "id" publication.
     *
     * @param id the id of the publication to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the publication, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Publication> getPublication(@PathVariable("id") Long id) {
        log.debug("REST request to get Publication : {}", id);
        Optional<Publication> publication = publicationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(publication);
    }

    /**
     * {@code DELETE  /publications/:id} : delete the "id" publication.
     *
     * @param id the id of the publication to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublication(@PathVariable("id") Long id) {
        log.debug("REST request to delete Publication : {}", id);
        publicationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}

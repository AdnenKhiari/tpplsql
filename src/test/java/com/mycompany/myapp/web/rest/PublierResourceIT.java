package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Chercheur;
import com.mycompany.myapp.domain.Publication;
import com.mycompany.myapp.domain.Publier;
import com.mycompany.myapp.repository.PublierRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PublierResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PublierResourceIT {

    private static final Integer DEFAULT_RANG = 1;
    private static final Integer UPDATED_RANG = 2;

    private static final String ENTITY_API_URL = "/api/publiers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{pubId}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PublierRepository publierRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPublierMockMvc;

    private Publier publier;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Publier createEntity(EntityManager em) {
        Publier publier = new Publier().rang(DEFAULT_RANG);
        // Add required entity
        Publication publication;
        if (TestUtil.findAll(em, Publication.class).isEmpty()) {
            publication = PublicationResourceIT.createEntity(em);
            em.persist(publication);
            em.flush();
        } else {
            publication = TestUtil.findAll(em, Publication.class).get(0);
        }
        publier.setPubno(publication);
        // Add required entity
        Chercheur chercheur;
        if (TestUtil.findAll(em, Chercheur.class).isEmpty()) {
            chercheur = ChercheurResourceIT.createEntity(em);
            em.persist(chercheur);
            em.flush();
        } else {
            chercheur = TestUtil.findAll(em, Chercheur.class).get(0);
        }
        publier.setChno(chercheur);
        return publier;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Publier createUpdatedEntity(EntityManager em) {
        Publier publier = new Publier().rang(UPDATED_RANG);
        // Add required entity
        Publication publication;
        if (TestUtil.findAll(em, Publication.class).isEmpty()) {
            publication = PublicationResourceIT.createUpdatedEntity(em);
            em.persist(publication);
            em.flush();
        } else {
            publication = TestUtil.findAll(em, Publication.class).get(0);
        }
        publier.setPubno(publication);
        // Add required entity
        Chercheur chercheur;
        if (TestUtil.findAll(em, Chercheur.class).isEmpty()) {
            chercheur = ChercheurResourceIT.createUpdatedEntity(em);
            em.persist(chercheur);
            em.flush();
        } else {
            chercheur = TestUtil.findAll(em, Chercheur.class).get(0);
        }
        publier.setChno(chercheur);
        return publier;
    }

    @BeforeEach
    public void initTest() {
        publier = createEntity(em);
    }

    @Test
    @Transactional
    void createPublier() throws Exception {
        int databaseSizeBeforeCreate = publierRepository.findAll().size();
        // Create the Publier
        restPublierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publier)))
            .andExpect(status().isCreated());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeCreate + 1);
        Publier testPublier = publierList.get(publierList.size() - 1);
        assertThat(testPublier.getRang()).isEqualTo(DEFAULT_RANG);
    }

    @Test
    @Transactional
    void createPublierWithExistingId() throws Exception {
        // Create the Publier with an existing ID
        publier.setPubId(1L);

        int databaseSizeBeforeCreate = publierRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPublierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publier)))
            .andExpect(status().isBadRequest());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRangIsRequired() throws Exception {
        int databaseSizeBeforeTest = publierRepository.findAll().size();
        // set the field null
        publier.setRang(null);

        // Create the Publier, which fails.

        restPublierMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publier)))
            .andExpect(status().isBadRequest());

        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPubliers() throws Exception {
        // Initialize the database
        publierRepository.saveAndFlush(publier);

        // Get all the publierList
        restPublierMockMvc
            .perform(get(ENTITY_API_URL + "?sort=pubId,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].pubId").value(hasItem(publier.getPubId().intValue())))
            .andExpect(jsonPath("$.[*].rang").value(hasItem(DEFAULT_RANG)));
    }

    @Test
    @Transactional
    void getPublier() throws Exception {
        // Initialize the database
        publierRepository.saveAndFlush(publier);

        // Get the publier
        restPublierMockMvc
            .perform(get(ENTITY_API_URL_ID, publier.getPubId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.pubId").value(publier.getPubId().intValue()))
            .andExpect(jsonPath("$.rang").value(DEFAULT_RANG));
    }

    @Test
    @Transactional
    void getNonExistingPublier() throws Exception {
        // Get the publier
        restPublierMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPublier() throws Exception {
        // Initialize the database
        publierRepository.saveAndFlush(publier);

        int databaseSizeBeforeUpdate = publierRepository.findAll().size();

        // Update the publier
        Publier updatedPublier = publierRepository.findById(publier.getPubId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPublier are not directly saved in db
        em.detach(updatedPublier);
        updatedPublier.rang(UPDATED_RANG);

        restPublierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPublier.getPubId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPublier))
            )
            .andExpect(status().isOk());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
        Publier testPublier = publierList.get(publierList.size() - 1);
        assertThat(testPublier.getRang()).isEqualTo(UPDATED_RANG);
    }

    @Test
    @Transactional
    void putNonExistingPublier() throws Exception {
        int databaseSizeBeforeUpdate = publierRepository.findAll().size();
        publier.setPubId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPublierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, publier.getPubId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(publier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPublier() throws Exception {
        int databaseSizeBeforeUpdate = publierRepository.findAll().size();
        publier.setPubId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublierMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(publier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPublier() throws Exception {
        int databaseSizeBeforeUpdate = publierRepository.findAll().size();
        publier.setPubId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublierMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePublierWithPatch() throws Exception {
        // Initialize the database
        publierRepository.saveAndFlush(publier);

        int databaseSizeBeforeUpdate = publierRepository.findAll().size();

        // Update the publier using partial update
        Publier partialUpdatedPublier = new Publier();
        partialUpdatedPublier.setPubId(publier.getPubId());

        restPublierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPublier.getPubId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPublier))
            )
            .andExpect(status().isOk());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
        Publier testPublier = publierList.get(publierList.size() - 1);
        assertThat(testPublier.getRang()).isEqualTo(DEFAULT_RANG);
    }

    @Test
    @Transactional
    void fullUpdatePublierWithPatch() throws Exception {
        // Initialize the database
        publierRepository.saveAndFlush(publier);

        int databaseSizeBeforeUpdate = publierRepository.findAll().size();

        // Update the publier using partial update
        Publier partialUpdatedPublier = new Publier();
        partialUpdatedPublier.setPubId(publier.getPubId());

        partialUpdatedPublier.rang(UPDATED_RANG);

        restPublierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPublier.getPubId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPublier))
            )
            .andExpect(status().isOk());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
        Publier testPublier = publierList.get(publierList.size() - 1);
        assertThat(testPublier.getRang()).isEqualTo(UPDATED_RANG);
    }

    @Test
    @Transactional
    void patchNonExistingPublier() throws Exception {
        int databaseSizeBeforeUpdate = publierRepository.findAll().size();
        publier.setPubId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPublierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, publier.getPubId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(publier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPublier() throws Exception {
        int databaseSizeBeforeUpdate = publierRepository.findAll().size();
        publier.setPubId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublierMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(publier))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPublier() throws Exception {
        int databaseSizeBeforeUpdate = publierRepository.findAll().size();
        publier.setPubId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublierMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(publier)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Publier in the database
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePublier() throws Exception {
        // Initialize the database
        publierRepository.saveAndFlush(publier);

        int databaseSizeBeforeDelete = publierRepository.findAll().size();

        // Delete the publier
        restPublierMockMvc
            .perform(delete(ENTITY_API_URL_ID, publier.getPubId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Publier> publierList = publierRepository.findAll();
        assertThat(publierList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Faculte;
import com.mycompany.myapp.repository.FaculteRepository;
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
 * Integration tests for the {@link FaculteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FaculteResourceIT {

    private static final String DEFAULT_FACNOM = "AAAAAAAAAA";
    private static final String UPDATED_FACNOM = "BBBBBBBBBB";

    private static final String DEFAULT_ADRESSE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE = "BBBBBBBBBB";

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/facultes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{facno}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FaculteRepository faculteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFaculteMockMvc;

    private Faculte faculte;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Faculte createEntity(EntityManager em) {
        Faculte faculte = new Faculte().facnom(DEFAULT_FACNOM).adresse(DEFAULT_ADRESSE).libelle(DEFAULT_LIBELLE);
        return faculte;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Faculte createUpdatedEntity(EntityManager em) {
        Faculte faculte = new Faculte().facnom(UPDATED_FACNOM).adresse(UPDATED_ADRESSE).libelle(UPDATED_LIBELLE);
        return faculte;
    }

    @BeforeEach
    public void initTest() {
        faculte = createEntity(em);
    }

    @Test
    @Transactional
    void createFaculte() throws Exception {
        int databaseSizeBeforeCreate = faculteRepository.findAll().size();
        // Create the Faculte
        restFaculteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isCreated());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeCreate + 1);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getFacnom()).isEqualTo(DEFAULT_FACNOM);
        assertThat(testFaculte.getAdresse()).isEqualTo(DEFAULT_ADRESSE);
        assertThat(testFaculte.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
    }

    @Test
    @Transactional
    void createFaculteWithExistingId() throws Exception {
        // Create the Faculte with an existing ID
        faculte.setFacno(1L);

        int databaseSizeBeforeCreate = faculteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFaculteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFacnomIsRequired() throws Exception {
        int databaseSizeBeforeTest = faculteRepository.findAll().size();
        // set the field null
        faculte.setFacnom(null);

        // Create the Faculte, which fails.

        restFaculteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isBadRequest());

        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAdresseIsRequired() throws Exception {
        int databaseSizeBeforeTest = faculteRepository.findAll().size();
        // set the field null
        faculte.setAdresse(null);

        // Create the Faculte, which fails.

        restFaculteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isBadRequest());

        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLibelleIsRequired() throws Exception {
        int databaseSizeBeforeTest = faculteRepository.findAll().size();
        // set the field null
        faculte.setLibelle(null);

        // Create the Faculte, which fails.

        restFaculteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isBadRequest());

        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFacultes() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        // Get all the faculteList
        restFaculteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=facno,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].facno").value(hasItem(faculte.getFacno().intValue())))
            .andExpect(jsonPath("$.[*].facnom").value(hasItem(DEFAULT_FACNOM)))
            .andExpect(jsonPath("$.[*].adresse").value(hasItem(DEFAULT_ADRESSE)))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)));
    }

    @Test
    @Transactional
    void getFaculte() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        // Get the faculte
        restFaculteMockMvc
            .perform(get(ENTITY_API_URL_ID, faculte.getFacno()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.facno").value(faculte.getFacno().intValue()))
            .andExpect(jsonPath("$.facnom").value(DEFAULT_FACNOM))
            .andExpect(jsonPath("$.adresse").value(DEFAULT_ADRESSE))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE));
    }

    @Test
    @Transactional
    void getNonExistingFaculte() throws Exception {
        // Get the faculte
        restFaculteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFaculte() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();

        // Update the faculte
        Faculte updatedFaculte = faculteRepository.findById(faculte.getFacno()).orElseThrow();
        // Disconnect from session so that the updates on updatedFaculte are not directly saved in db
        em.detach(updatedFaculte);
        updatedFaculte.facnom(UPDATED_FACNOM).adresse(UPDATED_ADRESSE).libelle(UPDATED_LIBELLE);

        restFaculteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFaculte.getFacno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFaculte))
            )
            .andExpect(status().isOk());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getFacnom()).isEqualTo(UPDATED_FACNOM);
        assertThat(testFaculte.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testFaculte.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void putNonExistingFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setFacno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, faculte.getFacno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setFacno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setFacno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFaculteWithPatch() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();

        // Update the faculte using partial update
        Faculte partialUpdatedFaculte = new Faculte();
        partialUpdatedFaculte.setFacno(faculte.getFacno());

        partialUpdatedFaculte.facnom(UPDATED_FACNOM).adresse(UPDATED_ADRESSE).libelle(UPDATED_LIBELLE);

        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFaculte.getFacno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFaculte))
            )
            .andExpect(status().isOk());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getFacnom()).isEqualTo(UPDATED_FACNOM);
        assertThat(testFaculte.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testFaculte.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void fullUpdateFaculteWithPatch() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();

        // Update the faculte using partial update
        Faculte partialUpdatedFaculte = new Faculte();
        partialUpdatedFaculte.setFacno(faculte.getFacno());

        partialUpdatedFaculte.facnom(UPDATED_FACNOM).adresse(UPDATED_ADRESSE).libelle(UPDATED_LIBELLE);

        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFaculte.getFacno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFaculte))
            )
            .andExpect(status().isOk());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
        Faculte testFaculte = faculteList.get(faculteList.size() - 1);
        assertThat(testFaculte.getFacnom()).isEqualTo(UPDATED_FACNOM);
        assertThat(testFaculte.getAdresse()).isEqualTo(UPDATED_ADRESSE);
        assertThat(testFaculte.getLibelle()).isEqualTo(UPDATED_LIBELLE);
    }

    @Test
    @Transactional
    void patchNonExistingFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setFacno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, faculte.getFacno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setFacno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(faculte))
            )
            .andExpect(status().isBadRequest());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFaculte() throws Exception {
        int databaseSizeBeforeUpdate = faculteRepository.findAll().size();
        faculte.setFacno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFaculteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(faculte)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Faculte in the database
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFaculte() throws Exception {
        // Initialize the database
        faculteRepository.saveAndFlush(faculte);

        int databaseSizeBeforeDelete = faculteRepository.findAll().size();

        // Delete the faculte
        restFaculteMockMvc
            .perform(delete(ENTITY_API_URL_ID, faculte.getFacno()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Faculte> faculteList = faculteRepository.findAll();
        assertThat(faculteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Faculte;
import com.mycompany.myapp.domain.Laboratoire;
import com.mycompany.myapp.repository.LaboratoireRepository;
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
 * Integration tests for the {@link LaboratoireResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LaboratoireResourceIT {

    private static final String DEFAULT_LABNOM = "AAAAAAAAAA";
    private static final String UPDATED_LABNOM = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/laboratoires";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{labno}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LaboratoireRepository laboratoireRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLaboratoireMockMvc;

    private Laboratoire laboratoire;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Laboratoire createEntity(EntityManager em) {
        Laboratoire laboratoire = new Laboratoire().labnom(DEFAULT_LABNOM);
        // Add required entity
        Faculte faculte;
        if (TestUtil.findAll(em, Faculte.class).isEmpty()) {
            faculte = FaculteResourceIT.createEntity(em);
            em.persist(faculte);
            em.flush();
        } else {
            faculte = TestUtil.findAll(em, Faculte.class).get(0);
        }
        laboratoire.setFacno(faculte);
        return laboratoire;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Laboratoire createUpdatedEntity(EntityManager em) {
        Laboratoire laboratoire = new Laboratoire().labnom(UPDATED_LABNOM);
        // Add required entity
        Faculte faculte;
        if (TestUtil.findAll(em, Faculte.class).isEmpty()) {
            faculte = FaculteResourceIT.createUpdatedEntity(em);
            em.persist(faculte);
            em.flush();
        } else {
            faculte = TestUtil.findAll(em, Faculte.class).get(0);
        }
        laboratoire.setFacno(faculte);
        return laboratoire;
    }

    @BeforeEach
    public void initTest() {
        laboratoire = createEntity(em);
    }

    @Test
    @Transactional
    void createLaboratoire() throws Exception {
        int databaseSizeBeforeCreate = laboratoireRepository.findAll().size();
        // Create the Laboratoire
        restLaboratoireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laboratoire)))
            .andExpect(status().isCreated());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeCreate + 1);
        Laboratoire testLaboratoire = laboratoireList.get(laboratoireList.size() - 1);
        assertThat(testLaboratoire.getLabnom()).isEqualTo(DEFAULT_LABNOM);
    }

    @Test
    @Transactional
    void createLaboratoireWithExistingId() throws Exception {
        // Create the Laboratoire with an existing ID
        laboratoire.setLabno(1L);

        int databaseSizeBeforeCreate = laboratoireRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLaboratoireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laboratoire)))
            .andExpect(status().isBadRequest());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLabnomIsRequired() throws Exception {
        int databaseSizeBeforeTest = laboratoireRepository.findAll().size();
        // set the field null
        laboratoire.setLabnom(null);

        // Create the Laboratoire, which fails.

        restLaboratoireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laboratoire)))
            .andExpect(status().isBadRequest());

        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLaboratoires() throws Exception {
        // Initialize the database
        laboratoireRepository.saveAndFlush(laboratoire);

        // Get all the laboratoireList
        restLaboratoireMockMvc
            .perform(get(ENTITY_API_URL + "?sort=labno,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].labno").value(hasItem(laboratoire.getLabno().intValue())))
            .andExpect(jsonPath("$.[*].labnom").value(hasItem(DEFAULT_LABNOM)));
    }

    @Test
    @Transactional
    void getLaboratoire() throws Exception {
        // Initialize the database
        laboratoireRepository.saveAndFlush(laboratoire);

        // Get the laboratoire
        restLaboratoireMockMvc
            .perform(get(ENTITY_API_URL_ID, laboratoire.getLabno()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.labno").value(laboratoire.getLabno().intValue()))
            .andExpect(jsonPath("$.labnom").value(DEFAULT_LABNOM));
    }

    @Test
    @Transactional
    void getNonExistingLaboratoire() throws Exception {
        // Get the laboratoire
        restLaboratoireMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLaboratoire() throws Exception {
        // Initialize the database
        laboratoireRepository.saveAndFlush(laboratoire);

        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();

        // Update the laboratoire
        Laboratoire updatedLaboratoire = laboratoireRepository.findById(laboratoire.getLabno()).orElseThrow();
        // Disconnect from session so that the updates on updatedLaboratoire are not directly saved in db
        em.detach(updatedLaboratoire);
        updatedLaboratoire.labnom(UPDATED_LABNOM);

        restLaboratoireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLaboratoire.getLabno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLaboratoire))
            )
            .andExpect(status().isOk());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
        Laboratoire testLaboratoire = laboratoireList.get(laboratoireList.size() - 1);
        assertThat(testLaboratoire.getLabnom()).isEqualTo(UPDATED_LABNOM);
    }

    @Test
    @Transactional
    void putNonExistingLaboratoire() throws Exception {
        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();
        laboratoire.setLabno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaboratoireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, laboratoire.getLabno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(laboratoire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLaboratoire() throws Exception {
        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();
        laboratoire.setLabno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(laboratoire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLaboratoire() throws Exception {
        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();
        laboratoire.setLabno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoireMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laboratoire)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLaboratoireWithPatch() throws Exception {
        // Initialize the database
        laboratoireRepository.saveAndFlush(laboratoire);

        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();

        // Update the laboratoire using partial update
        Laboratoire partialUpdatedLaboratoire = new Laboratoire();
        partialUpdatedLaboratoire.setLabno(laboratoire.getLabno());

        partialUpdatedLaboratoire.labnom(UPDATED_LABNOM);

        restLaboratoireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaboratoire.getLabno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaboratoire))
            )
            .andExpect(status().isOk());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
        Laboratoire testLaboratoire = laboratoireList.get(laboratoireList.size() - 1);
        assertThat(testLaboratoire.getLabnom()).isEqualTo(UPDATED_LABNOM);
    }

    @Test
    @Transactional
    void fullUpdateLaboratoireWithPatch() throws Exception {
        // Initialize the database
        laboratoireRepository.saveAndFlush(laboratoire);

        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();

        // Update the laboratoire using partial update
        Laboratoire partialUpdatedLaboratoire = new Laboratoire();
        partialUpdatedLaboratoire.setLabno(laboratoire.getLabno());

        partialUpdatedLaboratoire.labnom(UPDATED_LABNOM);

        restLaboratoireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaboratoire.getLabno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaboratoire))
            )
            .andExpect(status().isOk());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
        Laboratoire testLaboratoire = laboratoireList.get(laboratoireList.size() - 1);
        assertThat(testLaboratoire.getLabnom()).isEqualTo(UPDATED_LABNOM);
    }

    @Test
    @Transactional
    void patchNonExistingLaboratoire() throws Exception {
        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();
        laboratoire.setLabno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaboratoireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, laboratoire.getLabno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(laboratoire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLaboratoire() throws Exception {
        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();
        laboratoire.setLabno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(laboratoire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLaboratoire() throws Exception {
        int databaseSizeBeforeUpdate = laboratoireRepository.findAll().size();
        laboratoire.setLabno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoireMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(laboratoire))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Laboratoire in the database
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLaboratoire() throws Exception {
        // Initialize the database
        laboratoireRepository.saveAndFlush(laboratoire);

        int databaseSizeBeforeDelete = laboratoireRepository.findAll().size();

        // Delete the laboratoire
        restLaboratoireMockMvc
            .perform(delete(ENTITY_API_URL_ID, laboratoire.getLabno()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Laboratoire> laboratoireList = laboratoireRepository.findAll();
        assertThat(laboratoireList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

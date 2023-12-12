package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Chercheur;
import com.mycompany.myapp.domain.Faculte;
import com.mycompany.myapp.domain.Laboratoire;
import com.mycompany.myapp.domain.enumeration.GradeType;
import com.mycompany.myapp.domain.enumeration.StatutType;
import com.mycompany.myapp.repository.ChercheurRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link ChercheurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChercheurResourceIT {

    private static final String DEFAULT_CHNOM = "AAAAAAAAAA";
    private static final String UPDATED_CHNOM = "BBBBBBBBBB";

    private static final GradeType DEFAULT_GRADE = GradeType.E;
    private static final GradeType UPDATED_GRADE = GradeType.D;

    private static final StatutType DEFAULT_STATUT = StatutType.P;
    private static final StatutType UPDATED_STATUT = StatutType.C;

    private static final LocalDate DEFAULT_DATERECRUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATERECRUT = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_SALAIRE = 1D;
    private static final Double UPDATED_SALAIRE = 2D;

    private static final Double DEFAULT_PRIME = 1D;
    private static final Double UPDATED_PRIME = 2D;

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chercheurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{chno}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChercheurRepository chercheurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChercheurMockMvc;

    private Chercheur chercheur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chercheur createEntity(EntityManager em) {
        Chercheur chercheur = new Chercheur()
            .chnom(DEFAULT_CHNOM)
            .grade(DEFAULT_GRADE)
            .statut(DEFAULT_STATUT)
            .daterecrut(DEFAULT_DATERECRUT)
            .salaire(DEFAULT_SALAIRE)
            .prime(DEFAULT_PRIME)
            .email(DEFAULT_EMAIL);
        // Add required entity
        Laboratoire laboratoire;
        if (TestUtil.findAll(em, Laboratoire.class).isEmpty()) {
            laboratoire = LaboratoireResourceIT.createEntity(em);
            em.persist(laboratoire);
            em.flush();
        } else {
            laboratoire = TestUtil.findAll(em, Laboratoire.class).get(0);
        }
        chercheur.setLabno(laboratoire);
        // Add required entity
        Faculte faculte;
        if (TestUtil.findAll(em, Faculte.class).isEmpty()) {
            faculte = FaculteResourceIT.createEntity(em);
            em.persist(faculte);
            em.flush();
        } else {
            faculte = TestUtil.findAll(em, Faculte.class).get(0);
        }
        chercheur.setFacno(faculte);
        return chercheur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chercheur createUpdatedEntity(EntityManager em) {
        Chercheur chercheur = new Chercheur()
            .chnom(UPDATED_CHNOM)
            .grade(UPDATED_GRADE)
            .statut(UPDATED_STATUT)
            .daterecrut(UPDATED_DATERECRUT)
            .salaire(UPDATED_SALAIRE)
            .prime(UPDATED_PRIME)
            .email(UPDATED_EMAIL);
        // Add required entity
        Laboratoire laboratoire;
        if (TestUtil.findAll(em, Laboratoire.class).isEmpty()) {
            laboratoire = LaboratoireResourceIT.createUpdatedEntity(em);
            em.persist(laboratoire);
            em.flush();
        } else {
            laboratoire = TestUtil.findAll(em, Laboratoire.class).get(0);
        }
        chercheur.setLabno(laboratoire);
        // Add required entity
        Faculte faculte;
        if (TestUtil.findAll(em, Faculte.class).isEmpty()) {
            faculte = FaculteResourceIT.createUpdatedEntity(em);
            em.persist(faculte);
            em.flush();
        } else {
            faculte = TestUtil.findAll(em, Faculte.class).get(0);
        }
        chercheur.setFacno(faculte);
        return chercheur;
    }

    @BeforeEach
    public void initTest() {
        chercheur = createEntity(em);
    }

    @Test
    @Transactional
    void createChercheur() throws Exception {
        int databaseSizeBeforeCreate = chercheurRepository.findAll().size();
        // Create the Chercheur
        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isCreated());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeCreate + 1);
        Chercheur testChercheur = chercheurList.get(chercheurList.size() - 1);
        assertThat(testChercheur.getChnom()).isEqualTo(DEFAULT_CHNOM);
        assertThat(testChercheur.getGrade()).isEqualTo(DEFAULT_GRADE);
        assertThat(testChercheur.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testChercheur.getDaterecrut()).isEqualTo(DEFAULT_DATERECRUT);
        assertThat(testChercheur.getSalaire()).isEqualTo(DEFAULT_SALAIRE);
        assertThat(testChercheur.getPrime()).isEqualTo(DEFAULT_PRIME);
        assertThat(testChercheur.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    void createChercheurWithExistingId() throws Exception {
        // Create the Chercheur with an existing ID
        chercheur.setChno(1L);

        int databaseSizeBeforeCreate = chercheurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkChnomIsRequired() throws Exception {
        int databaseSizeBeforeTest = chercheurRepository.findAll().size();
        // set the field null
        chercheur.setChnom(null);

        // Create the Chercheur, which fails.

        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGradeIsRequired() throws Exception {
        int databaseSizeBeforeTest = chercheurRepository.findAll().size();
        // set the field null
        chercheur.setGrade(null);

        // Create the Chercheur, which fails.

        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatutIsRequired() throws Exception {
        int databaseSizeBeforeTest = chercheurRepository.findAll().size();
        // set the field null
        chercheur.setStatut(null);

        // Create the Chercheur, which fails.

        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDaterecrutIsRequired() throws Exception {
        int databaseSizeBeforeTest = chercheurRepository.findAll().size();
        // set the field null
        chercheur.setDaterecrut(null);

        // Create the Chercheur, which fails.

        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSalaireIsRequired() throws Exception {
        int databaseSizeBeforeTest = chercheurRepository.findAll().size();
        // set the field null
        chercheur.setSalaire(null);

        // Create the Chercheur, which fails.

        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = chercheurRepository.findAll().size();
        // set the field null
        chercheur.setPrime(null);

        // Create the Chercheur, which fails.

        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = chercheurRepository.findAll().size();
        // set the field null
        chercheur.setEmail(null);

        // Create the Chercheur, which fails.

        restChercheurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isBadRequest());

        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChercheurs() throws Exception {
        // Initialize the database
        chercheurRepository.saveAndFlush(chercheur);

        // Get all the chercheurList
        restChercheurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=chno,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].chno").value(hasItem(chercheur.getChno().intValue())))
            .andExpect(jsonPath("$.[*].chnom").value(hasItem(DEFAULT_CHNOM)))
            .andExpect(jsonPath("$.[*].grade").value(hasItem(DEFAULT_GRADE.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].daterecrut").value(hasItem(DEFAULT_DATERECRUT.toString())))
            .andExpect(jsonPath("$.[*].salaire").value(hasItem(DEFAULT_SALAIRE.doubleValue())))
            .andExpect(jsonPath("$.[*].prime").value(hasItem(DEFAULT_PRIME.doubleValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }

    @Test
    @Transactional
    void getChercheur() throws Exception {
        // Initialize the database
        chercheurRepository.saveAndFlush(chercheur);

        // Get the chercheur
        restChercheurMockMvc
            .perform(get(ENTITY_API_URL_ID, chercheur.getChno()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.chno").value(chercheur.getChno().intValue()))
            .andExpect(jsonPath("$.chnom").value(DEFAULT_CHNOM))
            .andExpect(jsonPath("$.grade").value(DEFAULT_GRADE.toString()))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.daterecrut").value(DEFAULT_DATERECRUT.toString()))
            .andExpect(jsonPath("$.salaire").value(DEFAULT_SALAIRE.doubleValue()))
            .andExpect(jsonPath("$.prime").value(DEFAULT_PRIME.doubleValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }

    @Test
    @Transactional
    void getNonExistingChercheur() throws Exception {
        // Get the chercheur
        restChercheurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChercheur() throws Exception {
        // Initialize the database
        chercheurRepository.saveAndFlush(chercheur);

        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();

        // Update the chercheur
        Chercheur updatedChercheur = chercheurRepository.findById(chercheur.getChno()).orElseThrow();
        // Disconnect from session so that the updates on updatedChercheur are not directly saved in db
        em.detach(updatedChercheur);
        updatedChercheur
            .chnom(UPDATED_CHNOM)
            .grade(UPDATED_GRADE)
            .statut(UPDATED_STATUT)
            .daterecrut(UPDATED_DATERECRUT)
            .salaire(UPDATED_SALAIRE)
            .prime(UPDATED_PRIME)
            .email(UPDATED_EMAIL);

        restChercheurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChercheur.getChno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChercheur))
            )
            .andExpect(status().isOk());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
        Chercheur testChercheur = chercheurList.get(chercheurList.size() - 1);
        assertThat(testChercheur.getChnom()).isEqualTo(UPDATED_CHNOM);
        assertThat(testChercheur.getGrade()).isEqualTo(UPDATED_GRADE);
        assertThat(testChercheur.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testChercheur.getDaterecrut()).isEqualTo(UPDATED_DATERECRUT);
        assertThat(testChercheur.getSalaire()).isEqualTo(UPDATED_SALAIRE);
        assertThat(testChercheur.getPrime()).isEqualTo(UPDATED_PRIME);
        assertThat(testChercheur.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void putNonExistingChercheur() throws Exception {
        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();
        chercheur.setChno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChercheurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chercheur.getChno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chercheur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChercheur() throws Exception {
        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();
        chercheur.setChno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chercheur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChercheur() throws Exception {
        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();
        chercheur.setChno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chercheur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChercheurWithPatch() throws Exception {
        // Initialize the database
        chercheurRepository.saveAndFlush(chercheur);

        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();

        // Update the chercheur using partial update
        Chercheur partialUpdatedChercheur = new Chercheur();
        partialUpdatedChercheur.setChno(chercheur.getChno());

        partialUpdatedChercheur.grade(UPDATED_GRADE).daterecrut(UPDATED_DATERECRUT).salaire(UPDATED_SALAIRE);

        restChercheurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChercheur.getChno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChercheur))
            )
            .andExpect(status().isOk());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
        Chercheur testChercheur = chercheurList.get(chercheurList.size() - 1);
        assertThat(testChercheur.getChnom()).isEqualTo(DEFAULT_CHNOM);
        assertThat(testChercheur.getGrade()).isEqualTo(UPDATED_GRADE);
        assertThat(testChercheur.getStatut()).isEqualTo(DEFAULT_STATUT);
        assertThat(testChercheur.getDaterecrut()).isEqualTo(UPDATED_DATERECRUT);
        assertThat(testChercheur.getSalaire()).isEqualTo(UPDATED_SALAIRE);
        assertThat(testChercheur.getPrime()).isEqualTo(DEFAULT_PRIME);
        assertThat(testChercheur.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    void fullUpdateChercheurWithPatch() throws Exception {
        // Initialize the database
        chercheurRepository.saveAndFlush(chercheur);

        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();

        // Update the chercheur using partial update
        Chercheur partialUpdatedChercheur = new Chercheur();
        partialUpdatedChercheur.setChno(chercheur.getChno());

        partialUpdatedChercheur
            .chnom(UPDATED_CHNOM)
            .grade(UPDATED_GRADE)
            .statut(UPDATED_STATUT)
            .daterecrut(UPDATED_DATERECRUT)
            .salaire(UPDATED_SALAIRE)
            .prime(UPDATED_PRIME)
            .email(UPDATED_EMAIL);

        restChercheurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChercheur.getChno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChercheur))
            )
            .andExpect(status().isOk());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
        Chercheur testChercheur = chercheurList.get(chercheurList.size() - 1);
        assertThat(testChercheur.getChnom()).isEqualTo(UPDATED_CHNOM);
        assertThat(testChercheur.getGrade()).isEqualTo(UPDATED_GRADE);
        assertThat(testChercheur.getStatut()).isEqualTo(UPDATED_STATUT);
        assertThat(testChercheur.getDaterecrut()).isEqualTo(UPDATED_DATERECRUT);
        assertThat(testChercheur.getSalaire()).isEqualTo(UPDATED_SALAIRE);
        assertThat(testChercheur.getPrime()).isEqualTo(UPDATED_PRIME);
        assertThat(testChercheur.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void patchNonExistingChercheur() throws Exception {
        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();
        chercheur.setChno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChercheurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chercheur.getChno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chercheur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChercheur() throws Exception {
        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();
        chercheur.setChno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chercheur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChercheur() throws Exception {
        int databaseSizeBeforeUpdate = chercheurRepository.findAll().size();
        chercheur.setChno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChercheurMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chercheur))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chercheur in the database
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChercheur() throws Exception {
        // Initialize the database
        chercheurRepository.saveAndFlush(chercheur);

        int databaseSizeBeforeDelete = chercheurRepository.findAll().size();

        // Delete the chercheur
        restChercheurMockMvc
            .perform(delete(ENTITY_API_URL_ID, chercheur.getChno()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chercheur> chercheurList = chercheurRepository.findAll();
        assertThat(chercheurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

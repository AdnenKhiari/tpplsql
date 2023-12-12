package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Publication;
import com.mycompany.myapp.domain.enumeration.PublicationType;
import com.mycompany.myapp.repository.PublicationRepository;
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
 * Integration tests for the {@link PublicationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PublicationResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String DEFAULT_THEME = "AAAAAAAAAA";
    private static final String UPDATED_THEME = "BBBBBBBBBB";

    private static final PublicationType DEFAULT_TYPE = PublicationType.AS;
    private static final PublicationType UPDATED_TYPE = PublicationType.PC;

    private static final Integer DEFAULT_VOLUME = 1;
    private static final Integer UPDATED_VOLUME = 2;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_APPARITION = "AAAAAAAAAA";
    private static final String UPDATED_APPARITION = "BBBBBBBBBB";

    private static final String DEFAULT_EDITEUR = "AAAAAAAAAA";
    private static final String UPDATED_EDITEUR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/publications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{pubno}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPublicationMockMvc;

    private Publication publication;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Publication createEntity(EntityManager em) {
        Publication publication = new Publication()
            .titre(DEFAULT_TITRE)
            .theme(DEFAULT_THEME)
            .type(DEFAULT_TYPE)
            .volume(DEFAULT_VOLUME)
            .date(DEFAULT_DATE)
            .apparition(DEFAULT_APPARITION)
            .editeur(DEFAULT_EDITEUR);
        return publication;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Publication createUpdatedEntity(EntityManager em) {
        Publication publication = new Publication()
            .titre(UPDATED_TITRE)
            .theme(UPDATED_THEME)
            .type(UPDATED_TYPE)
            .volume(UPDATED_VOLUME)
            .date(UPDATED_DATE)
            .apparition(UPDATED_APPARITION)
            .editeur(UPDATED_EDITEUR);
        return publication;
    }

    @BeforeEach
    public void initTest() {
        publication = createEntity(em);
    }

    @Test
    @Transactional
    void createPublication() throws Exception {
        int databaseSizeBeforeCreate = publicationRepository.findAll().size();
        // Create the Publication
        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isCreated());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeCreate + 1);
        Publication testPublication = publicationList.get(publicationList.size() - 1);
        assertThat(testPublication.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testPublication.getTheme()).isEqualTo(DEFAULT_THEME);
        assertThat(testPublication.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testPublication.getVolume()).isEqualTo(DEFAULT_VOLUME);
        assertThat(testPublication.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPublication.getApparition()).isEqualTo(DEFAULT_APPARITION);
        assertThat(testPublication.getEditeur()).isEqualTo(DEFAULT_EDITEUR);
    }

    @Test
    @Transactional
    void createPublicationWithExistingId() throws Exception {
        // Create the Publication with an existing ID
        publication.setPubno(1L);

        int databaseSizeBeforeCreate = publicationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitreIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicationRepository.findAll().size();
        // set the field null
        publication.setTitre(null);

        // Create the Publication, which fails.

        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkThemeIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicationRepository.findAll().size();
        // set the field null
        publication.setTheme(null);

        // Create the Publication, which fails.

        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicationRepository.findAll().size();
        // set the field null
        publication.setType(null);

        // Create the Publication, which fails.

        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVolumeIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicationRepository.findAll().size();
        // set the field null
        publication.setVolume(null);

        // Create the Publication, which fails.

        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicationRepository.findAll().size();
        // set the field null
        publication.setDate(null);

        // Create the Publication, which fails.

        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkApparitionIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicationRepository.findAll().size();
        // set the field null
        publication.setApparition(null);

        // Create the Publication, which fails.

        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEditeurIsRequired() throws Exception {
        int databaseSizeBeforeTest = publicationRepository.findAll().size();
        // set the field null
        publication.setEditeur(null);

        // Create the Publication, which fails.

        restPublicationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isBadRequest());

        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPublications() throws Exception {
        // Initialize the database
        publicationRepository.saveAndFlush(publication);

        // Get all the publicationList
        restPublicationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=pubno,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].pubno").value(hasItem(publication.getPubno().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].theme").value(hasItem(DEFAULT_THEME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].volume").value(hasItem(DEFAULT_VOLUME)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].apparition").value(hasItem(DEFAULT_APPARITION)))
            .andExpect(jsonPath("$.[*].editeur").value(hasItem(DEFAULT_EDITEUR)));
    }

    @Test
    @Transactional
    void getPublication() throws Exception {
        // Initialize the database
        publicationRepository.saveAndFlush(publication);

        // Get the publication
        restPublicationMockMvc
            .perform(get(ENTITY_API_URL_ID, publication.getPubno()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.pubno").value(publication.getPubno().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.theme").value(DEFAULT_THEME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.volume").value(DEFAULT_VOLUME))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.apparition").value(DEFAULT_APPARITION))
            .andExpect(jsonPath("$.editeur").value(DEFAULT_EDITEUR));
    }

    @Test
    @Transactional
    void getNonExistingPublication() throws Exception {
        // Get the publication
        restPublicationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPublication() throws Exception {
        // Initialize the database
        publicationRepository.saveAndFlush(publication);

        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();

        // Update the publication
        Publication updatedPublication = publicationRepository.findById(publication.getPubno()).orElseThrow();
        // Disconnect from session so that the updates on updatedPublication are not directly saved in db
        em.detach(updatedPublication);
        updatedPublication
            .titre(UPDATED_TITRE)
            .theme(UPDATED_THEME)
            .type(UPDATED_TYPE)
            .volume(UPDATED_VOLUME)
            .date(UPDATED_DATE)
            .apparition(UPDATED_APPARITION)
            .editeur(UPDATED_EDITEUR);

        restPublicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPublication.getPubno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPublication))
            )
            .andExpect(status().isOk());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
        Publication testPublication = publicationList.get(publicationList.size() - 1);
        assertThat(testPublication.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testPublication.getTheme()).isEqualTo(UPDATED_THEME);
        assertThat(testPublication.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPublication.getVolume()).isEqualTo(UPDATED_VOLUME);
        assertThat(testPublication.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPublication.getApparition()).isEqualTo(UPDATED_APPARITION);
        assertThat(testPublication.getEditeur()).isEqualTo(UPDATED_EDITEUR);
    }

    @Test
    @Transactional
    void putNonExistingPublication() throws Exception {
        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();
        publication.setPubno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPublicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, publication.getPubno())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(publication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPublication() throws Exception {
        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();
        publication.setPubno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(publication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPublication() throws Exception {
        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();
        publication.setPubno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(publication)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePublicationWithPatch() throws Exception {
        // Initialize the database
        publicationRepository.saveAndFlush(publication);

        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();

        // Update the publication using partial update
        Publication partialUpdatedPublication = new Publication();
        partialUpdatedPublication.setPubno(publication.getPubno());

        partialUpdatedPublication.titre(UPDATED_TITRE).theme(UPDATED_THEME).date(UPDATED_DATE);

        restPublicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPublication.getPubno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPublication))
            )
            .andExpect(status().isOk());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
        Publication testPublication = publicationList.get(publicationList.size() - 1);
        assertThat(testPublication.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testPublication.getTheme()).isEqualTo(UPDATED_THEME);
        assertThat(testPublication.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testPublication.getVolume()).isEqualTo(DEFAULT_VOLUME);
        assertThat(testPublication.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPublication.getApparition()).isEqualTo(DEFAULT_APPARITION);
        assertThat(testPublication.getEditeur()).isEqualTo(DEFAULT_EDITEUR);
    }

    @Test
    @Transactional
    void fullUpdatePublicationWithPatch() throws Exception {
        // Initialize the database
        publicationRepository.saveAndFlush(publication);

        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();

        // Update the publication using partial update
        Publication partialUpdatedPublication = new Publication();
        partialUpdatedPublication.setPubno(publication.getPubno());

        partialUpdatedPublication
            .titre(UPDATED_TITRE)
            .theme(UPDATED_THEME)
            .type(UPDATED_TYPE)
            .volume(UPDATED_VOLUME)
            .date(UPDATED_DATE)
            .apparition(UPDATED_APPARITION)
            .editeur(UPDATED_EDITEUR);

        restPublicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPublication.getPubno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPublication))
            )
            .andExpect(status().isOk());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
        Publication testPublication = publicationList.get(publicationList.size() - 1);
        assertThat(testPublication.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testPublication.getTheme()).isEqualTo(UPDATED_THEME);
        assertThat(testPublication.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPublication.getVolume()).isEqualTo(UPDATED_VOLUME);
        assertThat(testPublication.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPublication.getApparition()).isEqualTo(UPDATED_APPARITION);
        assertThat(testPublication.getEditeur()).isEqualTo(UPDATED_EDITEUR);
    }

    @Test
    @Transactional
    void patchNonExistingPublication() throws Exception {
        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();
        publication.setPubno(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPublicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, publication.getPubno())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(publication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPublication() throws Exception {
        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();
        publication.setPubno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(publication))
            )
            .andExpect(status().isBadRequest());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPublication() throws Exception {
        int databaseSizeBeforeUpdate = publicationRepository.findAll().size();
        publication.setPubno(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPublicationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(publication))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Publication in the database
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePublication() throws Exception {
        // Initialize the database
        publicationRepository.saveAndFlush(publication);

        int databaseSizeBeforeDelete = publicationRepository.findAll().size();

        // Delete the publication
        restPublicationMockMvc
            .perform(delete(ENTITY_API_URL_ID, publication.getPubno()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Publication> publicationList = publicationRepository.findAll();
        assertThat(publicationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

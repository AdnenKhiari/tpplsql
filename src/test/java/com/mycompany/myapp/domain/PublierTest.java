package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ChercheurTestSamples.*;
import static com.mycompany.myapp.domain.PublicationTestSamples.*;
import static com.mycompany.myapp.domain.PublierTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PublierTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Publier.class);
        Publier publier1 = getPublierSample1();
        Publier publier2 = new Publier();
        assertThat(publier1).isNotEqualTo(publier2);

        publier2.setPubId(publier1.getPubId());
        assertThat(publier1).isEqualTo(publier2);

        publier2 = getPublierSample2();
        assertThat(publier1).isNotEqualTo(publier2);
    }

    @Test
    void pubnoTest() throws Exception {
        Publier publier = getPublierRandomSampleGenerator();
        Publication publicationBack = getPublicationRandomSampleGenerator();

        publier.setPubno(publicationBack);
        assertThat(publier.getPubno()).isEqualTo(publicationBack);

        publier.pubno(null);
        assertThat(publier.getPubno()).isNull();
    }

    @Test
    void chnoTest() throws Exception {
        Publier publier = getPublierRandomSampleGenerator();
        Chercheur chercheurBack = getChercheurRandomSampleGenerator();

        publier.setChno(chercheurBack);
        assertThat(publier.getChno()).isEqualTo(chercheurBack);

        publier.chno(null);
        assertThat(publier.getChno()).isNull();
    }
}

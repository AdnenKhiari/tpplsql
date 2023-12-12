package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ChercheurTestSamples.*;
import static com.mycompany.myapp.domain.ChercheurTestSamples.*;
import static com.mycompany.myapp.domain.FaculteTestSamples.*;
import static com.mycompany.myapp.domain.LaboratoireTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChercheurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chercheur.class);
        Chercheur chercheur1 = getChercheurSample1();
        Chercheur chercheur2 = new Chercheur();
        assertThat(chercheur1).isNotEqualTo(chercheur2);

        chercheur2.setChno(chercheur1.getChno());
        assertThat(chercheur1).isEqualTo(chercheur2);

        chercheur2 = getChercheurSample2();
        assertThat(chercheur1).isNotEqualTo(chercheur2);
    }

    @Test
    void labnoTest() throws Exception {
        Chercheur chercheur = getChercheurRandomSampleGenerator();
        Laboratoire laboratoireBack = getLaboratoireRandomSampleGenerator();

        chercheur.setLabno(laboratoireBack);
        assertThat(chercheur.getLabno()).isEqualTo(laboratoireBack);

        chercheur.labno(null);
        assertThat(chercheur.getLabno()).isNull();
    }

    @Test
    void supnoTest() throws Exception {
        Chercheur chercheur = getChercheurRandomSampleGenerator();
        Chercheur chercheurBack = getChercheurRandomSampleGenerator();

        chercheur.setSupno(chercheurBack);
        assertThat(chercheur.getSupno()).isEqualTo(chercheurBack);

        chercheur.supno(null);
        assertThat(chercheur.getSupno()).isNull();
    }

    @Test
    void facnoTest() throws Exception {
        Chercheur chercheur = getChercheurRandomSampleGenerator();
        Faculte faculteBack = getFaculteRandomSampleGenerator();

        chercheur.setFacno(faculteBack);
        assertThat(chercheur.getFacno()).isEqualTo(faculteBack);

        chercheur.facno(null);
        assertThat(chercheur.getFacno()).isNull();
    }
}

package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.FaculteTestSamples.*;
import static com.mycompany.myapp.domain.LaboratoireTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LaboratoireTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Laboratoire.class);
        Laboratoire laboratoire1 = getLaboratoireSample1();
        Laboratoire laboratoire2 = new Laboratoire();
        assertThat(laboratoire1).isNotEqualTo(laboratoire2);

        laboratoire2.setLabno(laboratoire1.getLabno());
        assertThat(laboratoire1).isEqualTo(laboratoire2);

        laboratoire2 = getLaboratoireSample2();
        assertThat(laboratoire1).isNotEqualTo(laboratoire2);
    }

    @Test
    void facnoTest() throws Exception {
        Laboratoire laboratoire = getLaboratoireRandomSampleGenerator();
        Faculte faculteBack = getFaculteRandomSampleGenerator();

        laboratoire.setFacno(faculteBack);
        assertThat(laboratoire.getFacno()).isEqualTo(faculteBack);

        laboratoire.facno(null);
        assertThat(laboratoire.getFacno()).isNull();
    }
}

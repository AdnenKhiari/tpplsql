package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.FaculteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FaculteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Faculte.class);
        Faculte faculte1 = getFaculteSample1();
        Faculte faculte2 = new Faculte();
        assertThat(faculte1).isNotEqualTo(faculte2);

        faculte2.setFacno(faculte1.getFacno());
        assertThat(faculte1).isEqualTo(faculte2);

        faculte2 = getFaculteSample2();
        assertThat(faculte1).isNotEqualTo(faculte2);
    }
}

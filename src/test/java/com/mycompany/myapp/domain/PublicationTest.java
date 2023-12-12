package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.PublicationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PublicationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Publication.class);
        Publication publication1 = getPublicationSample1();
        Publication publication2 = new Publication();
        assertThat(publication1).isNotEqualTo(publication2);

        publication2.setPubno(publication1.getPubno());
        assertThat(publication1).isEqualTo(publication2);

        publication2 = getPublicationSample2();
        assertThat(publication1).isNotEqualTo(publication2);
    }
}

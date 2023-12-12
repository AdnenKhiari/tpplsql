package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PublicationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Publication getPublicationSample1() {
        return new Publication().pubno(1L).titre("titre1").theme("theme1").volume(1).apparition("apparition1").editeur("editeur1");
    }

    public static Publication getPublicationSample2() {
        return new Publication().pubno(2L).titre("titre2").theme("theme2").volume(2).apparition("apparition2").editeur("editeur2");
    }

    public static Publication getPublicationRandomSampleGenerator() {
        return new Publication()
            .pubno(longCount.incrementAndGet())
            .titre(UUID.randomUUID().toString())
            .theme(UUID.randomUUID().toString())
            .volume(intCount.incrementAndGet())
            .apparition(UUID.randomUUID().toString())
            .editeur(UUID.randomUUID().toString());
    }
}

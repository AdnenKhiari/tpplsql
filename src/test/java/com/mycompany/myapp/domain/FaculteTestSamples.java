package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class FaculteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Faculte getFaculteSample1() {
        return new Faculte().facno(1L).facnom("facnom1").adresse("adresse1").libelle("libelle1");
    }

    public static Faculte getFaculteSample2() {
        return new Faculte().facno(2L).facnom("facnom2").adresse("adresse2").libelle("libelle2");
    }

    public static Faculte getFaculteRandomSampleGenerator() {
        return new Faculte()
            .facno(longCount.incrementAndGet())
            .facnom(UUID.randomUUID().toString())
            .adresse(UUID.randomUUID().toString())
            .libelle(UUID.randomUUID().toString());
    }
}

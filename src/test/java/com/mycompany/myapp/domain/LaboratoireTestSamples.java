package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class LaboratoireTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Laboratoire getLaboratoireSample1() {
        return new Laboratoire().labno(1L).labnom("labnom1");
    }

    public static Laboratoire getLaboratoireSample2() {
        return new Laboratoire().labno(2L).labnom("labnom2");
    }

    public static Laboratoire getLaboratoireRandomSampleGenerator() {
        return new Laboratoire().labno(longCount.incrementAndGet()).labnom(UUID.randomUUID().toString());
    }
}

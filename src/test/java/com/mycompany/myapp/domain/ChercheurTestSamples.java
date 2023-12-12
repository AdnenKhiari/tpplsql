package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ChercheurTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Chercheur getChercheurSample1() {
        return new Chercheur().chno(1L).chnom("chnom1").email("email1");
    }

    public static Chercheur getChercheurSample2() {
        return new Chercheur().chno(2L).chnom("chnom2").email("email2");
    }

    public static Chercheur getChercheurRandomSampleGenerator() {
        return new Chercheur().chno(longCount.incrementAndGet()).chnom(UUID.randomUUID().toString()).email(UUID.randomUUID().toString());
    }
}

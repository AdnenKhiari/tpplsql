package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PublierTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Publier getPublierSample1() {
        return new Publier().pubId(1L).rang(1);
    }

    public static Publier getPublierSample2() {
        return new Publier().pubId(2L).rang(2);
    }

    public static Publier getPublierRandomSampleGenerator() {
        return new Publier().pubId(longCount.incrementAndGet()).rang(intCount.incrementAndGet());
    }
}

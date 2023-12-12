package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Chercheur;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Chercheur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChercheurRepository extends JpaRepository<Chercheur, Long> {}

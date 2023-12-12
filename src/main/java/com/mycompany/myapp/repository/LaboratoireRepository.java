package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Laboratoire;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Laboratoire entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LaboratoireRepository extends JpaRepository<Laboratoire, Long> {}

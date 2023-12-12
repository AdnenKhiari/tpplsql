package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Faculte;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Faculte entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FaculteRepository extends JpaRepository<Faculte, Long> {}

package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Publier;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Publier entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PublierRepository extends JpaRepository<Publier, Long> {}

package com.lubasi.tekk_match.footballer;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FootballerRepository extends JpaRepository<Footballer, UUID> {

    List<Footballer> findByFootballerNameContainingIgnoreCase(String searchQuery, Pageable pageable);
}

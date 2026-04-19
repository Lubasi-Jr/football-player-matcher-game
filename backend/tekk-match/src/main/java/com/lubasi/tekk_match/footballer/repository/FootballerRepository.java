package com.lubasi.tekk_match.footballer.repository;

import com.lubasi.tekk_match.footballer.models.Footballer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FootballerRepository extends JpaRepository<Footballer, UUID> {

    Page<Footballer> findByFootballerNameContainingIgnoreCase(String searchQuery, Pageable pageable);
}

package com.oasishorizon.api.policy;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PolicyTermRepository
    extends JpaRepository<PolicyTerm, UUID>, JpaSpecificationExecutor<PolicyTerm> {}

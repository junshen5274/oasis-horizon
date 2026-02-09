package com.oasishorizon.api.policy;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class PolicyTermService {
  private final PolicyTermRepository policyTermRepository;

  public PolicyTermService(PolicyTermRepository policyTermRepository) {
    this.policyTermRepository = policyTermRepository;
  }

  public Page<PolicyTerm> search(
      Optional<String> query,
      Optional<String> state,
      Optional<String> status,
      Optional<LocalDate> expFrom,
      Optional<LocalDate> expTo,
      Pageable pageable) {
    Specification<PolicyTerm> specification = buildSpecification(query, state, status, expFrom, expTo);
    return policyTermRepository.findAll(specification, pageable);
  }

  public Optional<PolicyTerm> findById(UUID termId) {
    return policyTermRepository.findById(termId);
  }

  private Specification<PolicyTerm> buildSpecification(
      Optional<String> query,
      Optional<String> state,
      Optional<String> status,
      Optional<LocalDate> expFrom,
      Optional<LocalDate> expTo) {
    return (root, criteriaQuery, criteriaBuilder) -> {
      List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
      var policyJoin = root.join("policy");

      query.map(String::trim)
          .filter(value -> !value.isBlank())
          .ifPresent(
              value -> {
                String likeValue = "%" + value.toLowerCase(Locale.US) + "%";
                predicates.add(
                    criteriaBuilder.or(
                        criteriaBuilder.like(
                            criteriaBuilder.lower(policyJoin.get("policyNumber")), likeValue),
                        criteriaBuilder.like(
                            criteriaBuilder.lower(policyJoin.get("insuredName")), likeValue)));
              });

      state.map(String::trim)
          .filter(value -> !value.isBlank())
          .ifPresent(
              value ->
                  predicates.add(
                      criteriaBuilder.equal(
                          criteriaBuilder.lower(root.get("state")), value.toLowerCase(Locale.US))));

      status.map(String::trim)
          .filter(value -> !value.isBlank())
          .ifPresent(
              value ->
                  predicates.add(
                      criteriaBuilder.equal(
                          criteriaBuilder.lower(root.get("status")), value.toLowerCase(Locale.US))));

      expFrom.ifPresent(
          date ->
              predicates.add(
                  criteriaBuilder.greaterThanOrEqualTo(root.get("effectiveToDate"), date)));

      expTo.ifPresent(
          date ->
              predicates.add(
                  criteriaBuilder.lessThanOrEqualTo(root.get("effectiveToDate"), date)));

      criteriaQuery.distinct(true);
      return criteriaBuilder.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
    };
  }
}

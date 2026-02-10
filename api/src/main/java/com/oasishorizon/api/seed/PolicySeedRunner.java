package com.oasishorizon.api.seed;

import com.oasishorizon.api.policy.Policy;
import com.oasishorizon.api.policy.PolicyRepository;
import com.oasishorizon.api.policy.PolicyTerm;
import com.oasishorizon.api.policy.PolicyTermRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("local")
public class PolicySeedRunner implements ApplicationRunner {
  private static final Logger logger = LoggerFactory.getLogger(PolicySeedRunner.class);
  private static final long RANDOM_SEED = 49201L;

  private static final String[] STATES = {
    "CA", "TX", "NY", "FL", "IL", "WA", "OR", "AZ", "CO", "GA"
  };
  private static final String[] STATUSES = {"ACTIVE", "EXPIRED", "CANCELLED", "NON_RENEWED"};
  private static final String[] FIRST_NAMES = {
    "Ava", "Ethan", "Maya", "Liam", "Noah", "Sophia", "Isabella", "Lucas", "Mason",
    "Amelia", "Harper", "Elijah", "Logan", "Charlotte", "James"
  };
  private static final String[] LAST_NAMES = {
    "Garcia", "Patel", "Nguyen", "Kim", "Johnson", "Chen", "Martinez", "Walker",
    "Brown", "Davis", "Thompson", "Lopez", "Rivera", "Allen", "Parker"
  };
  private static final String[] ORG_SUFFIXES = {
    "Holdings", "Group", "Partners", "Logistics", "Manufacturing", "Foods", "Energy",
    "Consulting", "Retail", "Industries"
  };

  private final JdbcTemplate jdbcTemplate;
  private final PolicyRepository policyRepository;
  private final PolicyTermRepository policyTermRepository;

  public PolicySeedRunner(
      JdbcTemplate jdbcTemplate,
      PolicyRepository policyRepository,
      PolicyTermRepository policyTermRepository) {
    this.jdbcTemplate = jdbcTemplate;
    this.policyRepository = policyRepository;
    this.policyTermRepository = policyTermRepository;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    jdbcTemplate.execute("TRUNCATE TABLE policy_term");
    jdbcTemplate.execute("TRUNCATE TABLE policy");

    Random random = new Random(RANDOM_SEED);
    int policyCount = 400 + random.nextInt(101);
    LocalDate anchorDate = LocalDate.of(2024, 1, 1);

    List<Policy> policies = new ArrayList<>(policyCount);
    List<PolicyTerm> terms = new ArrayList<>();

    for (int i = 0; i < policyCount; i++) {
      String policyNumber = String.format("OH-%06d", i + 1);
      String insuredName = buildInsuredName(random);
      Instant createdAt =
          anchorDate
              .minusDays(random.nextInt(365))
              .atStartOfDay()
              .toInstant(ZoneOffset.UTC);
      Instant updatedAt = createdAt.plusSeconds(86_400L * random.nextInt(30));

      Policy policy =
          new Policy(
              uuidFor("policy-" + policyNumber),
              policyNumber,
              insuredName,
              createdAt,
              updatedAt);
      policies.add(policy);

      int termCount = 1 + random.nextInt(3);
      LocalDate termStart = anchorDate.minusMonths(random.nextInt(24));

      for (int termNumber = 1; termNumber <= termCount; termNumber++) {
        LocalDate effectiveFrom = termStart.plusMonths((long) (termNumber - 1) * 12);
        LocalDate effectiveTo = effectiveFrom.plusYears(1).minusDays(1);
        LocalDate nextDueDate = effectiveFrom.plusMonths(1 + random.nextInt(3));
        LocalDate lastPaymentDate =
            nextDueDate.minusDays(5 + random.nextInt(20));

        String status = STATUSES[random.nextInt(STATUSES.length)];
        BigDecimal balanceDue =
            BigDecimal.valueOf(50 + random.nextDouble() * 1450)
                .setScale(2, RoundingMode.HALF_UP);

        PolicyTerm term =
            new PolicyTerm(
                uuidFor(policyNumber + "-term-" + termNumber),
                policy,
                termNumber,
                STATES[random.nextInt(STATES.length)],
                status,
                effectiveFrom,
                effectiveTo,
                balanceDue,
                nextDueDate,
                lastPaymentDate,
                createdAt,
                updatedAt);
        terms.add(term);
      }
    }

    policyRepository.saveAll(policies);
    policyTermRepository.saveAll(terms);

    logger.info(
        "Seeded {} policies and {} policy terms (deterministic seed).",
        policies.size(),
        terms.size());
  }

  private String buildInsuredName(Random random) {
    String base = FIRST_NAMES[random.nextInt(FIRST_NAMES.length)] + " "
        + LAST_NAMES[random.nextInt(LAST_NAMES.length)];
    if (random.nextBoolean()) {
      return base + " " + ORG_SUFFIXES[random.nextInt(ORG_SUFFIXES.length)];
    }
    return base;
  }

  private UUID uuidFor(String value) {
    return UUID.nameUUIDFromBytes(value.getBytes(StandardCharsets.UTF_8));
  }
}

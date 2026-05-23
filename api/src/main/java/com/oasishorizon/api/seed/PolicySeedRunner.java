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
    "NY", "CA", "TX", "FL", "AZ", "GA", "WA", "OR", "CO", "IL"
  };
  private static final String[] STATUSES = {"ACTIVE", "EXPIRED", "CANCELLED", "NON_RENEWED"};
  private static final LocalDate DEMO_CURRENT_DATE = LocalDate.of(2026, 5, 1);
  private static final String[] PERSON_NAMES = {
    "Ava Garcia", "Ethan Patel", "Maya Nguyen", "Liam Kim", "Noah Johnson",
    "Sophia Chen", "Isabella Martinez", "Lucas Walker", "Mason Brown",
    "Amelia Davis", "Harper Thompson", "Elijah Lopez", "Logan Rivera",
    "Charlotte Allen", "James Parker"
  };
  private static final String[] BUSINESS_PREFIXES = {
    "Cedar Ridge", "Northstar", "Harborview", "Summit", "Silverline", "Brightpath",
    "Riverview", "Blue Oak", "Pioneer", "Evergreen", "Metro", "Highland",
    "Lakefront", "Redwood", "Clearwater", "Ironwood"
  };
  private static final String[] BUSINESS_TYPES = {
    "Medical", "Clinic", "Logistics", "Manufacturing", "Foods", "Energy",
    "Consulting", "Retail", "Industries", "Dental", "Hospitality", "Contractors",
    "Distributors", "Technology", "Family Farms", "Auto Services"
  };
  private static final String[] ORG_SUFFIXES = {
    "Group", "Partners", "Company", "LLC", "Inc.", "Holdings"
  };
  private static final DemoPolicySpec[] DEMO_POLICIES = {
    new DemoPolicySpec(
        "OH-000001",
        "ABC Medical Group",
        "NY",
        "ACTIVE",
        LocalDate.of(2026, 1, 1),
        new BigDecimal("248.75")),
    new DemoPolicySpec(
        "OH-000002",
        "Green Clinic",
        "CA",
        "CANCELLED",
        LocalDate.of(2025, 3, 1),
        new BigDecimal("0.00")),
    new DemoPolicySpec(
        "OH-000003",
        "Lone Star Manufacturing",
        "TX",
        "ACTIVE",
        LocalDate.of(2025, 7, 1),
        new BigDecimal("884.20")),
    new DemoPolicySpec(
        "OH-000004",
        "Pacific Retail Partners",
        "CA",
        "ACTIVE",
        LocalDate.of(2027, 1, 1),
        new BigDecimal("420.00")),
    new DemoPolicySpec(
        "OH-000005",
        "Cascade Logistics",
        "WA",
        "NON_RENEWED",
        LocalDate.of(2024, 6, 1),
        new BigDecimal("116.45")),
    new DemoPolicySpec(
        "OH-000006",
        "Smith Family Farms",
        "OR",
        "EXPIRED",
        LocalDate.of(2023, 5, 1),
        new BigDecimal("0.00")),
    new DemoPolicySpec(
        "OH-000007",
        "Midtown Bakery",
        "NY",
        "ACTIVE",
        LocalDate.of(2025, 10, 1),
        new BigDecimal("335.10")),
    new DemoPolicySpec(
        "OH-000008",
        "Sunshine Hospitality",
        "FL",
        "EXPIRED",
        LocalDate.of(2023, 9, 1),
        new BigDecimal("0.00")),
    new DemoPolicySpec(
        "OH-000009",
        "Desert Canyon Contractors",
        "AZ",
        "ACTIVE",
        LocalDate.of(2026, 4, 1),
        new BigDecimal("712.90")),
    new DemoPolicySpec(
        "OH-000010",
        "Atlanta Risk Advisors",
        "GA",
        "CANCELLED",
        LocalDate.of(2025, 1, 1),
        new BigDecimal("58.35")),
    new DemoPolicySpec(
        "OH-000011",
        "Front Range Energy",
        "CO",
        "NON_RENEWED",
        LocalDate.of(2025, 8, 1),
        new BigDecimal("193.25")),
    new DemoPolicySpec(
        "OH-000012",
        "Lakeview Dental",
        "IL",
        "ACTIVE",
        LocalDate.of(2026, 2, 1),
        new BigDecimal("506.80"))
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
    jdbcTemplate.execute("TRUNCATE TABLE policy_term, policy");

    Random random = new Random(RANDOM_SEED);
    int policyCount = 400 + random.nextInt(101);
    LocalDate anchorDate = LocalDate.of(2024, 1, 1);

    List<Policy> policies = new ArrayList<>(policyCount);
    List<PolicyTerm> terms = new ArrayList<>();

    for (DemoPolicySpec demoPolicy : DEMO_POLICIES) {
      addDemoPolicy(demoPolicy, policies, terms);
    }

    for (int i = DEMO_POLICIES.length; i < policyCount; i++) {
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
      LocalDate termStart =
          LocalDate.of(2023 + random.nextInt(3), 1 + random.nextInt(12), 1);

      for (int termNumber = 1; termNumber <= termCount; termNumber++) {
        LocalDate effectiveFrom = termStart.plusMonths((long) (termNumber - 1) * 12);
        LocalDate effectiveTo = effectiveFrom.plusYears(1).minusDays(1);
        LocalDate nextDueDate = effectiveFrom.plusMonths(1 + random.nextInt(3));
        LocalDate lastPaymentDate =
            nextDueDate.minusDays(5 + random.nextInt(20));

        String state = STATES[Math.floorMod(i + termNumber - 1, STATES.length)];
        String status = buildStatus(i, termNumber, effectiveTo);
        BigDecimal balanceDue =
            BigDecimal.valueOf(50 + random.nextDouble() * 1450)
                .setScale(2, RoundingMode.HALF_UP);

        PolicyTerm term =
            new PolicyTerm(
                uuidFor(policyNumber + "-term-" + termNumber),
                policy,
                termNumber,
                state,
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
    if (random.nextInt(10) < 7) {
      return BUSINESS_PREFIXES[random.nextInt(BUSINESS_PREFIXES.length)] + " "
          + BUSINESS_TYPES[random.nextInt(BUSINESS_TYPES.length)] + " "
          + ORG_SUFFIXES[random.nextInt(ORG_SUFFIXES.length)];
    }

    return PERSON_NAMES[random.nextInt(PERSON_NAMES.length)];
  }

  private String buildStatus(int policyIndex, int termNumber, LocalDate effectiveTo) {
    int statusIndex = Math.floorMod(policyIndex + termNumber, STATUSES.length);

    if (effectiveTo.isBefore(DEMO_CURRENT_DATE.minusYears(1))) {
      return statusIndex == 2 ? "CANCELLED" : "EXPIRED";
    }

    return STATUSES[statusIndex];
  }

  private void addDemoPolicy(
      DemoPolicySpec demoPolicy, List<Policy> policies, List<PolicyTerm> terms) {
    Instant createdAt =
        demoPolicy.effectiveFromDate().minusDays(45).atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant updatedAt = createdAt.plusSeconds(86_400L * 14);
    Policy policy =
        new Policy(
            uuidFor("policy-" + demoPolicy.policyNumber()),
            demoPolicy.policyNumber(),
            demoPolicy.insuredName(),
            createdAt,
            updatedAt);
    policies.add(policy);

    LocalDate effectiveFrom = demoPolicy.effectiveFromDate();
    LocalDate effectiveTo = effectiveFrom.plusYears(1).minusDays(1);
    LocalDate nextDueDate =
        "ACTIVE".equals(demoPolicy.status()) ? effectiveFrom.plusMonths(1) : null;
    LocalDate lastPaymentDate =
        demoPolicy.balanceDue().compareTo(BigDecimal.ZERO) > 0
            ? effectiveFrom.plusDays(20)
            : effectiveFrom.plusDays(10);

    PolicyTerm term =
        new PolicyTerm(
            uuidFor(demoPolicy.policyNumber() + "-term-1"),
            policy,
            1,
            demoPolicy.state(),
            demoPolicy.status(),
            effectiveFrom,
            effectiveTo,
            demoPolicy.balanceDue(),
            nextDueDate,
            lastPaymentDate,
            createdAt,
            updatedAt);
    terms.add(term);
  }

  private UUID uuidFor(String value) {
    return UUID.nameUUIDFromBytes(value.getBytes(StandardCharsets.UTF_8));
  }

  private record DemoPolicySpec(
      String policyNumber,
      String insuredName,
      String state,
      String status,
      LocalDate effectiveFromDate,
      BigDecimal balanceDue) {}
}

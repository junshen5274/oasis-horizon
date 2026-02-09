package com.oasishorizon.api.policy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "policy_term")
public class PolicyTerm {
  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "policy_id", nullable = false)
  private Policy policy;

  @Column(name = "term_number", nullable = false)
  private int termNumber;

  @Column(name = "state", nullable = false)
  private String state;

  @Column(name = "status", nullable = false)
  private String status;

  @Column(name = "effective_from_date", nullable = false)
  private LocalDate effectiveFromDate;

  @Column(name = "effective_to_date", nullable = false)
  private LocalDate effectiveToDate;

  @Column(name = "balance_due", nullable = false)
  private BigDecimal balanceDue;

  @Column(name = "next_due_date")
  private LocalDate nextDueDate;

  @Column(name = "last_payment_date")
  private LocalDate lastPaymentDate;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected PolicyTerm() {}

  public PolicyTerm(
      UUID id,
      Policy policy,
      int termNumber,
      String state,
      String status,
      LocalDate effectiveFromDate,
      LocalDate effectiveToDate,
      BigDecimal balanceDue,
      LocalDate nextDueDate,
      LocalDate lastPaymentDate,
      Instant createdAt,
      Instant updatedAt) {
    this.id = id;
    this.policy = policy;
    this.termNumber = termNumber;
    this.state = state;
    this.status = status;
    this.effectiveFromDate = effectiveFromDate;
    this.effectiveToDate = effectiveToDate;
    this.balanceDue = balanceDue;
    this.nextDueDate = nextDueDate;
    this.lastPaymentDate = lastPaymentDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @PrePersist
  void onCreate() {
    Instant now = Instant.now();
    if (createdAt == null) {
      createdAt = now;
    }
    if (updatedAt == null) {
      updatedAt = now;
    }
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public Policy getPolicy() {
    return policy;
  }

  public int getTermNumber() {
    return termNumber;
  }

  public String getState() {
    return state;
  }

  public String getStatus() {
    return status;
  }

  public LocalDate getEffectiveFromDate() {
    return effectiveFromDate;
  }

  public LocalDate getEffectiveToDate() {
    return effectiveToDate;
  }

  public BigDecimal getBalanceDue() {
    return balanceDue;
  }

  public LocalDate getNextDueDate() {
    return nextDueDate;
  }

  public LocalDate getLastPaymentDate() {
    return lastPaymentDate;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}

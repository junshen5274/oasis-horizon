package com.oasishorizon.api.policy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "policy")
public class Policy {
  @Id
  private UUID id;

  @Column(name = "policy_number", nullable = false, unique = true)
  private String policyNumber;

  @Column(name = "insured_name", nullable = false)
  private String insuredName;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  protected Policy() {}

  public Policy(UUID id, String policyNumber, String insuredName, Instant createdAt, Instant updatedAt) {
    this.id = id;
    this.policyNumber = policyNumber;
    this.insuredName = insuredName;
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

  public String getPolicyNumber() {
    return policyNumber;
  }

  public String getInsuredName() {
    return insuredName;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}

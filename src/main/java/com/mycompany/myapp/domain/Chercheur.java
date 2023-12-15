package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.GradeType;
import com.mycompany.myapp.domain.enumeration.StatutType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Chercheur.
 */
@Entity
@Table(name = "chercheur")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Chercheur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "chno", nullable = false)
    private Long chno;

    @NotNull
    @Column(name = "chnom", nullable = false)
    private String chnom;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "grade", nullable = false)
    private GradeType grade;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private StatutType statut;

    @NotNull
    @Column(name = "daterecrut", nullable = false)
    private LocalDate daterecrut;

    @NotNull
    @Column(name = "salaire", nullable = false)
    private Double salaire;

    @NotNull
    @Column(name = "prime", nullable = false)
    private Double prime;

    @NotNull
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "facno" }, allowSetters = true)
    private Laboratoire labno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "labno", "supno", "facno" }, allowSetters = true)
    private Chercheur supno;

    @ManyToOne(optional = false)
    @NotNull
    private Faculte facno;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getChno() {
        return this.chno;
    }

    public Chercheur chno(Long chno) {
        this.setChno(chno);
        return this;
    }

    public void setChno(Long chno) {
        this.chno = chno;
    }

    public String getChnom() {
        return this.chnom;
    }

    public Chercheur chnom(String chnom) {
        this.setChnom(chnom);
        return this;
    }

    public void setChnom(String chnom) {
        this.chnom = chnom;
    }

    public GradeType getGrade() {
        return this.grade;
    }

    public Chercheur grade(GradeType grade) {
        this.setGrade(grade);
        return this;
    }

    public void setGrade(GradeType grade) {
        this.grade = grade;
    }

    public StatutType getStatut() {
        return this.statut;
    }

    public Chercheur statut(StatutType statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(StatutType statut) {
        this.statut = statut;
    }

    public LocalDate getDaterecrut() {
        return this.daterecrut;
    }

    public Chercheur daterecrut(LocalDate daterecrut) {
        this.setDaterecrut(daterecrut);
        return this;
    }

    public void setDaterecrut(LocalDate daterecrut) {
        this.daterecrut = daterecrut;
    }

    public Double getSalaire() {
        return this.salaire;
    }

    public Chercheur salaire(Double salaire) {
        this.setSalaire(salaire);
        return this;
    }

    public void setSalaire(Double salaire) {
        this.salaire = salaire;
    }

    public Double getPrime() {
        return this.prime;
    }

    public Chercheur prime(Double prime) {
        this.setPrime(prime);
        return this;
    }

    public void setPrime(Double prime) {
        this.prime = prime;
    }

    public String getEmail() {
        return this.email;
    }

    public Chercheur email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Laboratoire getLabno() {
        return this.labno;
    }

    public void setLabno(Laboratoire laboratoire) {
        this.labno = laboratoire;
    }

    public Chercheur labno(Laboratoire laboratoire) {
        this.setLabno(laboratoire);
        return this;
    }

    public Chercheur getSupno() {
        return this.supno;
    }

    public void setSupno(Chercheur chercheur) {
        this.supno = chercheur;
    }

    public Chercheur supno(Chercheur chercheur) {
        this.setSupno(chercheur);
        return this;
    }

    public Faculte getFacno() {
        return this.facno;
    }

    public void setFacno(Faculte faculte) {
        this.facno = faculte;
    }

    public Chercheur facno(Faculte faculte) {
        this.setFacno(faculte);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chercheur)) {
            return false;
        }
        return getChno() != null && getChno().equals(((Chercheur) o).getChno());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chercheur{" +
            "chno=" + getChno() +
            ", chnom='" + getChnom() + "'" +
            ", grade='" + getGrade() + "'" +
            ", statut='" + getStatut() + "'" +
            ", daterecrut='" + getDaterecrut() + "'" +
            ", salaire=" + getSalaire() +
            ", prime=" + getPrime() +
            ", email='" + getEmail() + "'" +
            "}";
    }
}

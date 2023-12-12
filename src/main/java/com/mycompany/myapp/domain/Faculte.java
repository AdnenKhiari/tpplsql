package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A Faculte.
 */
@Entity
@Table(name = "faculte")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Faculte implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "facno", nullable = false)
    private Long facno;

    @NotNull
    @Column(name = "facnom", nullable = false)
    private String facnom;

    @NotNull
    @Column(name = "adresse", nullable = false)
    private String adresse;

    @NotNull
    @Column(name = "libelle", nullable = false)
    private String libelle;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getFacno() {
        return this.facno;
    }

    public Faculte facno(Long facno) {
        this.setFacno(facno);
        return this;
    }

    public void setFacno(Long facno) {
        this.facno = facno;
    }

    public String getFacnom() {
        return this.facnom;
    }

    public Faculte facnom(String facnom) {
        this.setFacnom(facnom);
        return this;
    }

    public void setFacnom(String facnom) {
        this.facnom = facnom;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Faculte adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Faculte libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Faculte)) {
            return false;
        }
        return getFacno() != null && getFacno().equals(((Faculte) o).getFacno());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Faculte{" +
            "facno=" + getFacno() +
            ", facnom='" + getFacnom() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", libelle='" + getLibelle() + "'" +
            "}";
    }
}

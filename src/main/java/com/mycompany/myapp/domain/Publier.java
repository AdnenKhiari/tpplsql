package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A Publier.
 */
@Entity
@Table(name = "publier")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Publier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "pub_id", nullable = false)
    private Long pubId;

    @NotNull
    @Column(name = "rang", nullable = false)
    private Integer rang;

    @ManyToOne(optional = false)
    @NotNull
    private Publication pubno;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "labno", "supno", "facno" }, allowSetters = true)
    private Chercheur chno;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getPubId() {
        return this.pubId;
    }

    public Publier pubId(Long pubId) {
        this.setPubId(pubId);
        return this;
    }

    public void setPubId(Long pubId) {
        this.pubId = pubId;
    }

    public Integer getRang() {
        return this.rang;
    }

    public Publier rang(Integer rang) {
        this.setRang(rang);
        return this;
    }

    public void setRang(Integer rang) {
        this.rang = rang;
    }

    public Publication getPubno() {
        return this.pubno;
    }

    public void setPubno(Publication publication) {
        this.pubno = publication;
    }

    public Publier pubno(Publication publication) {
        this.setPubno(publication);
        return this;
    }

    public Chercheur getChno() {
        return this.chno;
    }

    public void setChno(Chercheur chercheur) {
        this.chno = chercheur;
    }

    public Publier chno(Chercheur chercheur) {
        this.setChno(chercheur);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Publier)) {
            return false;
        }
        return getPubId() != null && getPubId().equals(((Publier) o).getPubId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Publier{" +
            "pubId=" + getPubId() +
            ", rang=" + getRang() +
            "}";
    }
}

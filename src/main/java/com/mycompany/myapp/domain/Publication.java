package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.PublicationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Publication.
 */
@Entity
@Table(name = "publication")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Publication implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "pubno", nullable = false)
    private Long pubno;

    @NotNull
    @Column(name = "titre", nullable = false)
    private String titre;

    @NotNull
    @Column(name = "theme", nullable = false)
    private String theme;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type", nullable = false)
    private PublicationType type;

    @NotNull
    @Column(name = "volume", nullable = false)
    private Integer volume;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "apparition", nullable = false)
    private String apparition;

    @NotNull
    @Column(name = "editeur", nullable = false)
    private String editeur;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getPubno() {
        return this.pubno;
    }

    public Publication pubno(Long pubno) {
        this.setPubno(pubno);
        return this;
    }

    public void setPubno(Long pubno) {
        this.pubno = pubno;
    }

    public String getTitre() {
        return this.titre;
    }

    public Publication titre(String titre) {
        this.setTitre(titre);
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getTheme() {
        return this.theme;
    }

    public Publication theme(String theme) {
        this.setTheme(theme);
        return this;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public PublicationType getType() {
        return this.type;
    }

    public Publication type(PublicationType type) {
        this.setType(type);
        return this;
    }

    public void setType(PublicationType type) {
        this.type = type;
    }

    public Integer getVolume() {
        return this.volume;
    }

    public Publication volume(Integer volume) {
        this.setVolume(volume);
        return this;
    }

    public void setVolume(Integer volume) {
        this.volume = volume;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Publication date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getApparition() {
        return this.apparition;
    }

    public Publication apparition(String apparition) {
        this.setApparition(apparition);
        return this;
    }

    public void setApparition(String apparition) {
        this.apparition = apparition;
    }

    public String getEditeur() {
        return this.editeur;
    }

    public Publication editeur(String editeur) {
        this.setEditeur(editeur);
        return this;
    }

    public void setEditeur(String editeur) {
        this.editeur = editeur;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Publication)) {
            return false;
        }
        return getPubno() != null && getPubno().equals(((Publication) o).getPubno());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Publication{" +
            "pubno=" + getPubno() +
            ", titre='" + getTitre() + "'" +
            ", theme='" + getTheme() + "'" +
            ", type='" + getType() + "'" +
            ", volume=" + getVolume() +
            ", date='" + getDate() + "'" +
            ", apparition='" + getApparition() + "'" +
            ", editeur='" + getEditeur() + "'" +
            "}";
    }
}

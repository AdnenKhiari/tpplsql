package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A Laboratoire.
 */
@Entity
@Table(name = "laboratoire")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Laboratoire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "labno", nullable = false)
    private Long labno;

    @NotNull
    @Column(name = "labnom", nullable = false)
    private String labnom;

    @ManyToOne(optional = false)
    @NotNull
    private Faculte facno;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getLabno() {
        return this.labno;
    }

    public Laboratoire labno(Long labno) {
        this.setLabno(labno);
        return this;
    }

    public void setLabno(Long labno) {
        this.labno = labno;
    }

    public String getLabnom() {
        return this.labnom;
    }

    public Laboratoire labnom(String labnom) {
        this.setLabnom(labnom);
        return this;
    }

    public void setLabnom(String labnom) {
        this.labnom = labnom;
    }

    public Faculte getFacno() {
        return this.facno;
    }

    public void setFacno(Faculte faculte) {
        this.facno = faculte;
    }

    public Laboratoire facno(Faculte faculte) {
        this.setFacno(faculte);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Laboratoire)) {
            return false;
        }
        return getLabno() != null && getLabno().equals(((Laboratoire) o).getLabno());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Laboratoire{" +
            "labno=" + getLabno() +
            ", labnom='" + getLabnom() + "'" +
            "}";
    }
}

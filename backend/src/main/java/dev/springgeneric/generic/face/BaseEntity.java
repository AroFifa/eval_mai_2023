package dev.springgeneric.generic.face;

public interface BaseEntity<ID> {
    ID getId();

    void setId(ID id);

}

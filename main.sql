CREATE OR REPLACE PACKAGE SPRINGBOOT.chercheur_package AS
    PROCEDURE add_chercheur(
        chno IN NUMBER,
        chnom IN VARCHAR2,
        grade IN VARCHAR2,
        statut IN VARCHAR2,
        daterecrut IN DATE,
        salaire IN FLOAT,
         prime IN FLOAT,
        email IN VARCHAR2,
        labno IN NUMBER,
        supno IN NUMBER,
        facno IN NUMBER
    );

    PROCEDURE update_chercheur_profile(
        chno IN NUMBER,
        new_grade IN VARCHAR2,
        new_statut IN VARCHAR2,
        new_salaire IN FLOAT,
        new_labno IN NUMBER
    );

    PROCEDURE retrieve_chercheurs_with_highest_publications(
        start_date IN VARCHAR2,
        end_date IN VARCHAR2
    );

    PROCEDURE delete_chercheur(
        chno IN NUMBER
    );
END chercheur_package;

CREATE OR REPLACE PACKAGE BODY SPRINGBOOT.chercheur_package AS
    PROCEDURE add_chercheur(
        chno IN NUMBER,
        chnom IN VARCHAR2,
        grade IN VARCHAR2,
        statut IN VARCHAR2,
        daterecrut IN DATE,
        salaire IN FLOAT,
        prime IN FLOAT,
        email IN VARCHAR2,
        labno IN NUMBER,
        supno IN NUMBER,
        facno IN NUMBER
    ) IS
    BEGIN
        INSERT INTO chercheur
        VALUES (chno, chnom, grade, statut, daterecrut, salaire,prime,email, labno, supno, facno);
    END add_chercheur;

    PROCEDURE update_chercheur_profile(
        chno IN NUMBER,
        new_grade IN VARCHAR2,
        new_statut IN VARCHAR2,
        new_salaire IN FLOAT,
        new_labno IN NUMBER
    ) IS
    BEGIN
        UPDATE chercheur SET grade = new_grade, statut = new_statut, salaire = new_salaire, labno_labno = new_labno
        WHERE chno = chno;
    END update_chercheur_profile;

    PROCEDURE retrieve_chercheurs_with_highest_publications(
        start_date IN VARCHAR2,
        end_date IN VARCHAR2
    ) IS



CURSOR chercheurs (start_date VARCHAR2,end_date VARCHAR2) IS
SELECT c.chno,f.facno,l.labno FROM SPRINGBOOT.CHERCHEUR c

JOIN SPRINGBOOT.FACULTE f ON f.facno=c.facno_facno

JOIN SPRINGBOOT.LABORATOIRE l ON l.labno = c.labno_labno

WHERE l.labno =  (

SELECT l.labno FROM SPRINGBOOT.PUBLICATION pubs

JOIN SPRINGBOOT.PUBLIER R ON R.PUBNO_PUBNO =PUBS.PUBNO

JOIN SPRINGBOOT.CHERCHEUR c ON c.CHNO = R.CHNO_CHNO

JOIN SPRINGBOOT.LABORATOIRE l ON l.LABNO = c.LABNO_LABNO

WHERE PUBS.JHI_DATE BETWEEN start_date AND end_date

AND c.FACNO_FACNO = f.facno

GROUP BY l.LABNO ,l.LABNOM

ORDER BY count(*) DESC

FETCH FIRST 1 ROW ONLY

);

BEGIN

FOR c IN chercheurs(start_date,end_date)

LOOP

dbms_output.put_line(c.chno);

END LOOP;

END retrieve_chercheurs_with_highest_publications;
    PROCEDURE delete_chercheur(
        chno IN NUMBER
    ) IS
    BEGIN
     DELETE FROM chercheur WHERE chno = chno;
    END delete_chercheur;

END chercheur_package;


CREATE TABLE SPRINGBOOT.historique_chercheurs
   (	"CHNO" NUMBER NOT NULL ENABLE,
	"CHNOM" VARCHAR2(255) NOT NULL ENABLE,
	"GRADE" VARCHAR2(255) NOT NULL ENABLE,
	"STATUT" VARCHAR2(255) NOT NULL ENABLE,
	"DATERECRUT" DATE NOT NULL ENABLE,
	"SALAIRE" FLOAT(126) NOT NULL ENABLE,
	"PRIME" FLOAT(126) NOT NULL ENABLE,
	"EMAIL" VARCHAR2(255) NOT NULL ENABLE,
	"LABNO_LABNO" NUMBER NOT NULL ENABLE,
	"SUPNO_CHNO" NUMBER,
	"FACNO_FACNO" NUMBER NOT NULL ENABLE,
	"UPDATE_DATE" DATE NOT NULL
);





CREATE OR REPLACE TRIGGER SPRINGBOOT.prevent_salary_descente
BEFORE UPDATE OF salaire ON SPRINGBOOT.chercheur
FOR EACH ROW
BEGIN
    IF :NEW.salaire < :OLD.salaire THEN
        RAISE_APPLICATION_ERROR(-20002, 'Salary cannot be decreased');
    END IF;
END;

DROP TRIGGER SPRINGBOOT.backup_chercheur_info

CREATE OR REPLACE TRIGGER SPRINGBOOT.backup_chercheur_info
BEFORE DELETE OR UPDATE ON  SPRINGBOOT.chercheur
FOR EACH ROW
BEGIN
        INSERT INTO SPRINGBOOT.historique_chercheurs VALUES (:OLD.chno, :OLD.chnom, :OLD.grade, :OLD.statut, :OLD.daterecrut, :OLD.salaire, :OLD.prime ,:OLD.email, :OLD.labno_labno, :OLD.supno_chno, :OLD.facno_facno, CURRENT_DATE);
END;

CREATE OR REPLACE TRIGGER SPRINGBOOT.restriction
BEFORE INSERT OR UPDATE OR DELETE
ON SPRINGBOOT.chercheur
DECLARE
    v_day VARCHAR2(20);
    v_time VARCHAR2(20);
BEGIN
    SELECT TO_CHAR(SYSDATE, 'DAY'), TO_CHAR(SYSDATE, 'HH24:MI')
    INTO v_day, v_time
    FROM DUAL;

    IF v_day IN ('SATURDAY', 'SUNDAY') THEN
        RAISE_APPLICATION_ERROR(-20003, 'Database updates not allowed on weekends.');
    ELSIF v_time NOT BETWEEN '08:00' AND '18:00' THEN
        RAISE_APPLICATION_ERROR(-20004, 'Database updates allowed only during working hours (8:00 AM - 6:00 PM).');
    END IF;
END;


CREATE OR REPLACE TRIGGER SPRINGBOOT.directeur
BEFORE INSERT OR UPDATE ON SPRINGBOOT.chercheur
FOR EACH ROW
DECLARE
    director_capacity_exceeded EXCEPTION;
    PRAGMA EXCEPTION_INIT(director_capacity_exceeded, -20001);
    etudiant NUMBER DEFAULT 0;
    doctorant NUMBER DEFAULT 0;

BEGIN
    IF :OLD.grade IN ('E', 'D') AND :NEW.grade = 'MC' THEN
     SELECT COUNT(*) INTO etudiant FROM SPRINGBOOT.CHERCHEUR c1 JOIN SPRINGBOOT.CHERCHEUR c2 ON c1.chno = c2.supno_chno  WHERE c2.grade = 'E';
     SELECT COUNT(*) INTO doctorant FROM SPRINGBOOT.CHERCHEUR c1 JOIN SPRINGBOOT.CHERCHEUR c2 ON c1.chno = c2.supno_chno  WHERE c2.grade = 'D';
     dbms_output.put_line(etudiant || doctorant);
     IF doctorant > 1 OR  etudiant > 1  THEN
     	RAISE director_capacity_exceeded;
     END IF;


    END IF;
END;


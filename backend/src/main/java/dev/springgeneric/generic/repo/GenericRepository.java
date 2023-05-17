package dev.springgeneric.generic.repo;

import dev.springgeneric.generic.face.BaseEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@Repository
@Transactional
public class GenericRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public <T extends BaseEntity<ID>, ID> T save(T entity) {
        entityManager.persist(entity);
        return entity;
    }



    public <T extends BaseEntity<ID>, ID> T find(Class<T> entityClass, ID id) {
        return entityManager.find(entityClass, id);
    }

    private <T extends BaseEntity<ID>, ID> List<T> findAll(Class<T> entityClass) {
        CriteriaQuery<T> criteriaQuery = entityManager.getCriteriaBuilder().createQuery(entityClass);
        criteriaQuery.select(criteriaQuery.from(entityClass));
        return entityManager.createQuery(criteriaQuery).getResultList();
    }


    public <T> Page<T> findAll(Class<T> entityClass, Pageable pageable) {
        CriteriaQuery<T> criteriaQuery = entityManager.getCriteriaBuilder().createQuery(entityClass);
        criteriaQuery.select(criteriaQuery.from(entityClass));
        TypedQuery<T> query = entityManager.createQuery(criteriaQuery);
        if (pageable != null) {
            query.setFirstResult((int) pageable.getOffset());
            query.setMaxResults(pageable.getPageSize());
        }
        List<T> entities = query.getResultList();
        long totalRecords = count(entityClass);
        return new PageImpl<>(entities, pageable, totalRecords);
    }

    public <T extends BaseEntity<ID>, ID> T update(T entity) {
        return entityManager.merge(entity);
    }

    public <T extends BaseEntity<ID>, ID> void delete(Class<T> entityClass, ID id) {
        T entity = find(entityClass, id);
        if (entity != null) {
            entityManager.remove(entity);
        }
    }


    public <T> Page<T> findBy(T entity, Pageable pageable) throws IllegalAccessException {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> criteriaQuery = criteriaBuilder.createQuery((Class<T>) entity.getClass());
        Root<T> root = criteriaQuery.from((Class<T>) entity.getClass());
        List<Predicate> predicates = new ArrayList<>();
        Field[] fields = entity.getClass().getDeclaredFields();

        List<Object[]> objects = new ArrayList<>();
        for (Field field : fields) {
            field.setAccessible(true);
            try {
                Object value = field.get(entity);

                if (value != null) {
                    if (value.getClass().equals(String.class))
                        predicates.add(criteriaBuilder.like(root.get(field.getName()), "%" + value + "%"));
                    else
                        predicates.add(criteriaBuilder.equal(root.get(field.getName()), value));

                    objects.add(new Object[]{field.getName(),value});
                }

            } catch (Throwable e) {
                throw e;
            }
        }

        criteriaQuery.where(predicates.toArray(new Predicate[0]));
        TypedQuery<T> query = entityManager.createQuery(criteriaQuery);
        if (pageable != null) {
            query.setFirstResult((int) pageable.getOffset());
            query.setMaxResults(pageable.getPageSize());
        }
        List<T> entities1 = query.getResultList();

        long totalRecords = count(entity.getClass(),objects);
        return new PageImpl<>(entities1, pageable, totalRecords);




    }

    private <T> long count(Class<T> entityClass) {
        CriteriaQuery<Long> countQuery = entityManager.getCriteriaBuilder().createQuery(Long.class);
        countQuery.select(entityManager.getCriteriaBuilder().count(countQuery.from(entityClass)));
        return entityManager.createQuery(countQuery).getSingleResult();
    }
    public <T> long count(Class<T> entityClass,List<Object[]> objects) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<T> root = countQuery.from(entityClass);
        countQuery.select(criteriaBuilder.count(root));

        Predicate[] predicates = new Predicate[objects.size()];
        int i=0;
        for (Object[] o: objects) {

                if (o[1].getClass().equals(String.class))
                    predicates[i]=(criteriaBuilder.like(root.get((String) o[0]), "%" + o[1] + "%"));
                else
                    predicates[i]=(criteriaBuilder.equal(root.get((String) o[0]), o[1]));

                i++;
        }
        if (predicates.length!=0) {
            countQuery.where(predicates);
        }

//
        TypedQuery<Long> query = entityManager.createQuery(countQuery);
        return query.getSingleResult();
    }



//    public <T> Page<T> findBySQL(String request, Pageable pageable, Object... params) {
//        return findBySQL(request, null, pageable, params);
////    }
//    public <T> Page<T> findBySQL(String request, Class<T> entity, Pageable pageable, Object... params) {
//        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
//        CriteriaQuery<T> criteriaQuery = builder.createQuery(entity);
//        Root<T> root = criteriaQuery.from(entity);
//        criteriaQuery.select(root);
//        int pageNumber = pageable.getPageNumber();
//        int pageSize = pageable.getPageSize();
//        Sort sort = pageable.getSort();
//        if (sort != null) {
//            for (Sort.Order order : sort) {
//                String property = order.getProperty();
//                Sort.Direction direction = order.getDirection();
//                Order jpaOrder = direction.isAscending() ? builder.asc(root.get(property)) : builder.desc(root.get(property));
//                criteriaQuery.orderBy(jpaOrder);
//            }
//        }
//        int firstResult = pageNumber * pageSize;
//        TypedQuery<T> query = entityManager.createQuery(criteriaQuery);
//        query.setFirstResult(firstResult);
//        query.setMaxResults(pageSize);
//
//        for (int i = 0; i < params.length; i++) {
//            query.setParameter(i+1 , params[i]);
//        }
//        List<T> resultList = query.getResultList();
//        long totalCount = countBySQL(request, params);
//        return new PageImpl<>(resultList, pageable, totalCount);
//    }

    public <T> Page<T> findBySQL(String request, Class<T> entity, Pageable pageable, Object... params) {
        int pageNumber = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();

        String queryString = String.format(request, params);
        Query query = entityManager.createNativeQuery(queryString, entity);
        query.setFirstResult(pageNumber * pageSize);
        query.setMaxResults(pageSize);
        for (int i = 0; i < params.length; i++) {
            query.setParameter(i + 1, params[i]);
        }
        List<T> resultList = query.getResultList();
        long totalCount = countBySQL(request, params);
        return new PageImpl<>(resultList, pageable, totalCount);
    }
    private long countBySQL(String request, Object... params) {
        String countQueryString = String.format("SELECT COUNT(*) FROM (%s) AS count_query", request);
        Query countQuery = entityManager.createNativeQuery(countQueryString);
        for (int i = 0; i < params.length; i++) {
            countQuery.setParameter(i + 1, params[i]);
        }
        return ((Number) countQuery.getSingleResult()).longValue();
    }


}

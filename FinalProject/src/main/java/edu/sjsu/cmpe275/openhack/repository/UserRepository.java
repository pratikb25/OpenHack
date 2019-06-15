package edu.sjsu.cmpe275.openhack.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import edu.sjsu.cmpe275.openhack.model.User;

/**
 * 
 * @author adityadoshatti
 *
 */
public interface UserRepository extends CrudRepository<User, Long>{
	
//	@Query( value ="SELECT * FROM User where email = :id", nativeQuery=true) 
//	User findByEmail(@Param("id") String id);

}

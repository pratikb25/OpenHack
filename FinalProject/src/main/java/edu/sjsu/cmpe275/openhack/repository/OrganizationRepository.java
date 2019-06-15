package edu.sjsu.cmpe275.openhack.repository;

import org.springframework.data.repository.CrudRepository;

import edu.sjsu.cmpe275.openhack.model.Organization;


/**
 * 
 * @author adityadoshatti
 *
 */
public interface OrganizationRepository  extends CrudRepository<Organization, Long> {

}

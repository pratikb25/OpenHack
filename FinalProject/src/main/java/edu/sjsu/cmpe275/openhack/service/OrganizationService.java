package edu.sjsu.cmpe275.openhack.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.openhack.model.Organization;
import edu.sjsu.cmpe275.openhack.model.User;
import edu.sjsu.cmpe275.openhack.repository.OrganizationRepository;

/**
 * 
 * @author adityadoshatti
 *
 */
@Service
public class OrganizationService {
	
	@Autowired
	private OrganizationRepository organizationRepository;
	
	/**
	 * fetches all organizations
	 * @return returns organizations list
	 */
	public List<Organization> getAllOrganizations() {
		List<Organization> orgList = new ArrayList<Organization>();
		organizationRepository.findAll().forEach(orgList::add);
		return orgList;
	}
	
	/**
	 * fetches a particular organization
	 * @param id organization ID
	 * @return returns an organization object
	 */
	public Organization getAnOrganizations(Long id) {
		return organizationRepository.findOne(id);
	}
	
	/**
	 * adds an organization
	 * @param org organization object
	 */
	public void addOrganization(Organization org) {
		organizationRepository.save(org);
	}
	
	/**
	 * update organization
	 * @param org
	 */
	public void updateOrganization(Organization org) {
		organizationRepository.save(org);
	}
	
	public Set<User> getPendingUsers(Long id) {
		Organization org = organizationRepository.findOne(id);
		return org.getPendingApprovals();
	}

}

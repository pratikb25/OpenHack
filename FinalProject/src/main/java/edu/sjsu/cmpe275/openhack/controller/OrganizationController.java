package edu.sjsu.cmpe275.openhack.controller;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.openhack.model.Organization;
import edu.sjsu.cmpe275.openhack.model.User;
import edu.sjsu.cmpe275.openhack.service.OrganizationService;
import edu.sjsu.cmpe275.openhack.service.UserService;

/**
 * 
 * @author adityadoshatti
 *
 */
@RestController
public class OrganizationController {
	
	@Autowired
	OrganizationService organizationService;
	
	@Autowired
	UserService userService;
	
	/**
	 * 
	 * @return
	 */
	@RequestMapping(method=RequestMethod.GET,value = "/organizations", produces = { "application/json", "application/xml" })
	public List<Organization> getAllOrganizations() {
		return organizationService.getAllOrganizations();
	}
	
	/**
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(method=RequestMethod.GET,value = "/organizations/{id}", produces = { "application/json", "application/xml" })
	public ResponseEntity<Organization> getAnOrganizations(@PathVariable Long id) {
		Organization org = organizationService.getAnOrganizations(id);
		if  (org != null) {
			return ResponseEntity.ok(org);
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	/**
	 * 
	 * @param org
	 * @return
	 */
	@RequestMapping(method=RequestMethod.POST, value="/organization",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Organization> addOrganization(@RequestBody Organization org) {
		try {
			Organization tempOrg = new Organization(org);
			User tempUser = userService.getUser(org.getOwner().getId());
			tempUser.setOwner(true);
			tempOrg.setOwner(tempUser);
			
			organizationService.addOrganization(tempOrg);
			return ResponseEntity.ok(tempOrg);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="/organization/{orgId}/approve/{userId}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Organization> approveJoinOrganization(@PathVariable Long orgId, @PathVariable Long userId) {
		try {
			Organization tempOrg = organizationService.getAnOrganizations(orgId);
			Set<User> tempList = tempOrg.getOrgUsers();
			Set<User> pendingList = tempOrg.getPendingApprovals();
			User currUser = userService.getUser(userId);
			tempList.add(currUser);
			pendingList.remove(currUser);
			tempOrg.setOrgUsers(tempList);
			tempOrg.setPendingApprovals(pendingList);
			organizationService.updateOrganization(tempOrg);
			User tempUser =  userService.getUser(userId);
			tempUser.setOrganization(tempOrg);
			userService.updateProfile(tempUser);
			return ResponseEntity.ok(tempOrg);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="/organization/{orgId}/reject/{userId}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Organization> rejectJoinOrganization(@PathVariable Long orgId, @PathVariable Long userId) {
		try {
			Organization tempOrg = organizationService.getAnOrganizations(orgId);
			Set<User> pendingList = tempOrg.getPendingApprovals();
			User currUser = userService.getUser(userId);
			pendingList.remove(currUser);
			tempOrg.setPendingApprovals(pendingList);
			organizationService.updateOrganization(tempOrg);
			return ResponseEntity.ok(tempOrg);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="/organization/{orgId}/join/{userId}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Organization> requestJoinOrganization(@PathVariable Long orgId, @PathVariable Long userId) {
		try {
			Organization tempOrg = organizationService.getAnOrganizations(orgId);
			Set<User> tempList = tempOrg.getPendingApprovals();
			tempList.add(userService.getUser(userId));
			tempOrg.setPendingApprovals(tempList);
			organizationService.updateOrganization(tempOrg);
			return ResponseEntity.ok(tempOrg);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="/organization/{orgId}/leave/{userId}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Organization> leaveOrganization(@PathVariable Long orgId, @PathVariable Long userId) {
		try {
			Organization tempOrg = organizationService.getAnOrganizations(orgId);
			Set<User> tempList = tempOrg.getOrgUsers();
			tempList.remove(userService.getUser(userId));
			tempOrg.setOrgUsers(tempList);
			organizationService.updateOrganization(tempOrg);
			User tempUser =  userService.getUser(userId);
			tempUser.setOrganization(null);
			userService.updateProfile(tempUser);
			return ResponseEntity.ok(tempOrg);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/organization/{id}/getPendingRequests",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Set<User>> getJoinRequests(@PathVariable Long id) {
		try {
			Set<User> users = organizationService.getPendingUsers(id);
			return ResponseEntity.ok(users);
		}
		catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		
	}

}

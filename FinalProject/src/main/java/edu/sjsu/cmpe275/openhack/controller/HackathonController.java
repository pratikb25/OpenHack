package edu.sjsu.cmpe275.openhack.controller;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import edu.sjsu.cmpe275.openhack.model.Hackathon;
import edu.sjsu.cmpe275.openhack.model.Organization;
import edu.sjsu.cmpe275.openhack.model.User;
import edu.sjsu.cmpe275.openhack.service.HackathonService;
import edu.sjsu.cmpe275.openhack.service.OrganizationService;
import edu.sjsu.cmpe275.openhack.service.TeamService;
import edu.sjsu.cmpe275.openhack.service.UserService;

/**
 * 
 * @author pratikb
 *
 */

@RestController
public class HackathonController {
	
	@Autowired
	HackathonService hackathonService;
	
	@Autowired
	UserService userService;
	
	@Autowired
	OrganizationService orgService;
	
	@Autowired
	TeamService teamService;

	
	// Get ALL hackathons
	@RequestMapping(method=RequestMethod.GET, value = "/hackathons", produces = { "application/json", "application/xml" })
	public List<Hackathon> getAllHackathons() {
		return hackathonService.getAllHackathons();
	}
	
	// Get ALL ongoing hackathons
	@RequestMapping(method=RequestMethod.GET, value = "/hackathonsByDate", produces = { "application/json", "application/xml" })
	public List<Hackathon> getAllOpenHackathons() {
		return hackathonService.getAllFutureOngoingHackathons();
	}
	
	// Create a new hackathon
	@RequestMapping(method=RequestMethod.POST, value = "/hackathon", produces = { "application/json", "application/xml" })
	public ResponseEntity<Hackathon> createHackathon(@RequestBody Hackathon h) {
		Hackathon temp = new Hackathon(h);
		try {
			if(userService.getUser(temp.getAdminId()) == null) {
				return ResponseEntity.notFound().build();
			}
			hackathonService.addHackathon(temp);
		} catch(Exception e) {
			if(e.getClass().equals(new org.springframework.dao.EmptyResultDataAccessException(0).getClass())) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
		return ResponseEntity.ok(temp);
	}
	
	// Add a judge [userId] to hackathon [hackId]
	@RequestMapping(method=RequestMethod.PUT, value="/hackathon/{userId}/judge/{hackId}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Hackathon> addJudge(
			@PathVariable Long hackId,
			@PathVariable Long userId) {
				
		Hackathon h = hackathonService.getHackathonById(hackId);
		User judge = userService.getUser(userId);
		h.addJudge(judge);
		judge.addJudgesHackathons(h);
		hackathonService.addHackathon(h);
		userService.addUser(judge);
		return (ResponseEntity<Hackathon>) ResponseEntity.ok(h);
	}
	
	// Add a sponsor [orgId] to hackathon [hackId]
	@RequestMapping(method=RequestMethod.PUT, value="/hackathon/{orgId}/sponsor/{hackId}",  produces = { "application/json", "application/xml" })
	public void addSponsor(
			@PathVariable Long orgId,
			@PathVariable Long hackId) {
		Hackathon h = hackathonService.getHackathonById(hackId);
		Organization org = orgService.getAnOrganizations(orgId);
		h.addSponsors(org);
		org.addHackathon(h);
		hackathonService.addHackathon(h);
		orgService.addOrganization(org);		
	}

	// Fetch hackathon details by ID [hackId]
	@RequestMapping(method=RequestMethod.GET, value = "/hackathon/{hackId}", produces = { "application/json", "application/xml" })
	public ResponseEntity<Hackathon> getTeams(@PathVariable Long hackId) {
		try {
			Hackathon obj = hackathonService.getHackathonById(hackId);
//			if(obj == null) 
//				return ResponseEntity.notFound().build();
			return ResponseEntity.ok(obj);
		}
		catch(Exception e) {
			if(e.getClass().equals(new org.springframework.dao.EmptyResultDataAccessException(0).getClass())) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	//get hackathon by adminId
	@RequestMapping(method=RequestMethod.GET, value = "/hackathons/{adminId}", produces = { "application/json", "application/xml" })
	public List<Hackathon> getHackathon(@PathVariable Long adminId) {
			try {
				return hackathonService.getHackathonByAdminId(adminId);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return null;
	}
	
	// Open/close a hackathon
	@RequestMapping(method=RequestMethod.PUT, value = "/hackathon/{hackId}/open/{status}", produces = { "application/json", "application/xml" })
	public ResponseEntity<Hackathon> openHackathon(@PathVariable Long hackId,
			@PathVariable boolean status) {
		try {
			Hackathon h = hackathonService.getHackathonById(hackId);
			h.setOpen(status);
			if(status == true) {
				Date date = Calendar.getInstance().getTime();
				if(h.getStartDate().compareTo(date)>0) {
					h.setStartDate(date);
				}
			}
			hackathonService.addHackathon(h);
		}
		catch (Exception e) {
			if(e.getClass().equals(new org.springframework.dao.EmptyResultDataAccessException(0).getClass())) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
		}
		return ResponseEntity.noContent().build();
	}
	
	@RequestMapping(method=RequestMethod.PUT, value = "/hackathon/{hackId}/finalize", produces = { "application/json", "application/xml" })
	public ResponseEntity<Hackathon> finalizeHackathon(@PathVariable Long hackId) {
		try {
			Hackathon h = hackathonService.getHackathonById(hackId);
			h.setFinalized(true);
			h.setOpen(false);
			hackathonService.addHackathon(h);
		}
		catch (Exception e) {
			if(e.getClass().equals(new org.springframework.dao.EmptyResultDataAccessException(0).getClass())) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
		}
		return ResponseEntity.noContent().build();
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/hackathon/name/{name}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<Hackathon> getProfileByScreenName(@PathVariable String name ) {
		Hackathon hack = hackathonService.getHackByName(name);
		if  (hack != null) {
			return ResponseEntity.ok(hack);
		}
		else {
			return ResponseEntity.status(HttpStatus.CREATED).body(null);
		}
	}
}


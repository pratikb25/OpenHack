package edu.sjsu.cmpe275.openhack.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
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

import edu.sjsu.cmpe275.openhack.model.PaymentDetails;
import edu.sjsu.cmpe275.openhack.model.Team;
import edu.sjsu.cmpe275.openhack.model.User;
import edu.sjsu.cmpe275.openhack.service.MailService;
import edu.sjsu.cmpe275.openhack.service.PaymentService;
import edu.sjsu.cmpe275.openhack.service.TeamService;
import edu.sjsu.cmpe275.openhack.service.UserService;

/**
 * 
 * @author pratikb
 *
 */
@RestController
public class TeamController {
	
	@Autowired(required=true)
	TeamService teamService;
	
	@Autowired(required=true)
	UserService userService;
	
	@Autowired(required=true)
	MailService mailService;
	
	@Autowired
	PaymentService paymentService;
	
	@RequestMapping(method=RequestMethod.GET,value = "/teams", produces = { "application/json", "application/xml" })
	public List<Team> getAllTeams() {
		return teamService.getAllTeams();
	}
	
	@RequestMapping(method=RequestMethod.POST,value = "/team", produces = { "application/json", "application/xml" })
	public ResponseEntity<Team> createTeam(@RequestBody Team t) {
		Team temp = new Team(t);
		for(User u:temp.getUsers()) {
			User tempUser = userService.getUser(u.getId());
			try {
				Set<Team> currTeams = tempUser.getParticipantTeam();
				currTeams.add(temp);
				userService.updateProfile(tempUser);
				mailService.sendMail(tempUser.getEmail(),"Payment Due for Openhack", "Go ahead and make payment on http://localhost:8080/payment");
			} catch (Exception e) {
				e.printStackTrace();
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
		}
		teamService.addTeam(temp);
		return ResponseEntity.ok(temp);
	}
	
	@RequestMapping(method=RequestMethod.GET,value = "/team/{teamId}", produces = { "application/json", "application/xml" })
	public Team getTeamByTeamId(@PathVariable Long teamId) {
		return teamService.getTeamById(teamId);
	}
	
	@RequestMapping(method=RequestMethod.POST,value = "/team/{teamId}/submit", produces = { "application/json", "application/xml" })
	public ResponseEntity<Team> submitLink(@RequestBody Team t, @PathVariable Long teamId) {
		Team temp = teamService.getTeamById(teamId);
		try {
			if(t.getSubmissionLink() != null)
				temp.setSubmissionLink(t.getSubmissionLink());
			if(t.getScore() != -1)
				temp.setScore(t.getScore());
			teamService.updateTeam(temp);
			return ResponseEntity.ok(temp);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}		
	}
	
	@RequestMapping(method=RequestMethod.GET,value = "/team/{teamId}/paidUsers", produces = { "application/json", "application/xml" })
	public ResponseEntity<Set<User>> getPaidUsers(@PathVariable("teamId") Long id) {
		try {
			Team team = teamService.getTeamById(id);
			if(team != null) {
				Set<User> paidUsers = team.getPaidUsers();
				return ResponseEntity.ok(paidUsers);
			}
		}
		catch(Exception e) { }
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}
	
	@RequestMapping(method=RequestMethod.PUT, value = "/team/{teamId}/addPaidUser/{userId}", produces = { "application/json", "application/xml" })
	public ResponseEntity<Team> addPaidUser(@PathVariable Long teamId, @PathVariable Long userId, @RequestBody PaymentDetails obj) {
		try {
			Team team = teamService.getTeamById(teamId);
			if(team == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			User user = userService.getUser(userId);
			if(user == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			
			// Add user to the team
			team.addPaidUsers(userService.getUser(userId));
			team.setPaidCount(team.getPaidUsers().size());
			teamService.updateTeam(team);
			if (team.getPaidUsers().size() == team.getUsers().size()) {
				User tempUser = team.getOwner();
				mailService.sendMail(tempUser.getEmail(),"Payment Done for Openhack", "All your team members have done the payment, You are all set to submit code");
			}
			
			// Add payment details to DB
			Date date = Calendar.getInstance().getTime();
			DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
			String strDate = dateFormat.format(date);
			obj.setDate(strDate);
			paymentService.savePayment(obj);
		}
		catch (Exception e) {
		}
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}
	
	@RequestMapping(method=RequestMethod.GET,value = "/team/hackathon/{hackId}", produces = { "application/json", "application/xml" })
	public Team getTeamByHackathonId(@PathVariable Long hackId) {
		return teamService.getTeamByHackathonId(hackId);
	}
}

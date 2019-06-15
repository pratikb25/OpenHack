package edu.sjsu.cmpe275.openhack.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import edu.sjsu.cmpe275.openhack.model.Hackathon;
import edu.sjsu.cmpe275.openhack.model.User;
import edu.sjsu.cmpe275.openhack.model.WinnerTeam;
import edu.sjsu.cmpe275.openhack.service.HackathonService;
import edu.sjsu.cmpe275.openhack.service.MailService;
import edu.sjsu.cmpe275.openhack.service.UserService;

@RestController
@CrossOrigin(origins="*",allowedHeaders="*")
public class UserController {
	
	@Autowired
	UserService userService;
	
	@Autowired
	HackathonService hackathonService;
	
	@Autowired
	MailService mailService;
	
	@RequestMapping(method=RequestMethod.GET,value = "/user/ping")
	public String pingHandler() {
		return "Hello! User here!";
	}
	
	//Get users without admin status
	
	@RequestMapping(method=RequestMethod.GET,value = "/users", produces = { "application/json", "application/xml" })
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}
	
	@RequestMapping(method=RequestMethod.GET,value = "/users/hacker", produces = { "application/json", "application/xml" })
	public List<User> getAllUserWithoutAdmin() {
		return userService.getUsersWithoutAdmin();
	}
	
	
	@RequestMapping(method=RequestMethod.GET, value="/user/{id}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<User> getProfile(@PathVariable Long id ) {
		User user = userService.getUser(id);
		if  (user != null) {
			return ResponseEntity.ok(user);
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	@CrossOrigin(origins="*",allowedHeaders="*")
	@RequestMapping(method=RequestMethod.POST, value="/user/signup",  produces = { "application/json", "application/xml" })
	public ResponseEntity<User> addUser(@RequestBody User user) {
		try {
			User tempUser=new User(user);
			String email=tempUser.getEmail();
			if(email.endsWith("@sjsu.edu"))
				tempUser.setRole("admin");
			else
				tempUser.setRole("hacker");
			userService.addUser(tempUser);
			return ResponseEntity.ok(tempUser);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/user/profile/{id:.+}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<User> getProfile(@PathVariable String id ) {
		User user = userService.getProfile(id);
		if  (user != null) {
			return ResponseEntity.ok(user);
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	@RequestMapping(method=RequestMethod.GET, value="/user/profile/sn/{sid}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<User> getProfileByScreenName(@PathVariable String sid ) {
		User user = userService.getProfileByScreenName(sid);
		if  (user != null) {
			return ResponseEntity.ok(user);
		}
		else {
			return ResponseEntity.status(HttpStatus.CREATED).body(null);
		}
	}
	
	@RequestMapping(method=RequestMethod.PUT, value="/user/profile/{id}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<User> updateProfile(@PathVariable Long id,@RequestBody User user) {
		try {
			
			User tmpuser=userService.getUser(id);
			tmpuser.setName(user.getName());
			tmpuser.setPortraitUrl(user.getPortraitUrl());
			tmpuser.setBusinessTitle(user.getBusinessTitle());
			tmpuser.setAddress(user.getAddress());
			tmpuser.setAboutMe(user.getAboutMe());
			tmpuser.setOrganization(user.getOrganization());
			userService.updateProfile(tmpuser);
			return ResponseEntity.ok(tmpuser);
		}
		catch(Exception e) {
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	
	@RequestMapping(method=RequestMethod.PUT, value="/user/profileVerify/{id:.+}",  produces = { "application/json", "application/xml" })
	public ResponseEntity<User> updateProfile(@PathVariable String id) {
		User user = userService.getProfileVerify(id);
		if  (user != null) {
			return ResponseEntity.ok(user);
		}
		else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	// Return all hackathons created by given admin [userId]
	@RequestMapping(method=RequestMethod.GET, value = "/user/{userId}/hackathons", produces = { "application/json", "application/xml" })
	public ResponseEntity<List<Hackathon>> getHackathonByAdminId(@PathVariable Long userId) {
		List<Hackathon> hackathons = null;
		try {
			hackathons = new ArrayList<Hackathon>(hackathonService.getHackathonByAdminId(userId));
			return ResponseEntity.ok(hackathons);
		}
		catch (Exception e) {
			if(e.getClass().equals(new org.springframework.dao.EmptyResultDataAccessException(0).getClass())) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
			if (e.getClass().equals(new org.springframework.dao.DataIntegrityViolationException(null).getClass())) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
			}
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	// Set payment DONE for given user
	@RequestMapping(method=RequestMethod.PUT, value = "/user/{userId}/pay", produces = { "application/json", "application/xml" })
	public ResponseEntity<HttpStatus> setPaymentDone(@PathVariable Long userId) {
		User u = userService.getUser(userId);
		if(u == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		if(u.isPaid() == true) return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
		u.setPaid(true);
		userService.addUser(u);
		return ResponseEntity.status(HttpStatus.OK).build();		
	}
	
	@RequestMapping(method=RequestMethod.POST, value = "/user/invite", produces = { "application/json", "application/xml" })
	public ResponseEntity<HttpStatus> inviteUser(@RequestBody String emailID) throws JsonParseException, JsonMappingException, IOException {
		ObjectNode object = new ObjectMapper().readValue(emailID, ObjectNode.class);
		JsonNode node = object.get("emailID");
		emailID = node.textValue();
		if(userService.getProfile(emailID) != null) 
			return ResponseEntity.ok().build();
		String subject = "You are invited!";
		String msg = "Hi there!\n\n"
				+ "You have been invited to participate in the OpenHack - an online hackathon system "
				+ "where you get to be a part of a number of hackathons and showcase your coding skills.\n\n"
				+ "Click following link to go to the signup page, follow simple sign-up steps and start browsing"
				+ "through a pool of future and ongoing hackathons. Go to the dashboard and join any hackathon you want."
				+ "\n\nhttp://54.69.212.178:3000/signup"
				+ "\n\nHappy Hacking!\n\nBest Regards,\nYour OpenHack Team";
		mailService.sendMail(emailID, subject, msg);
		return ResponseEntity.ok().build();
	}
	
	@RequestMapping(method=RequestMethod.POST, value = "/emailResults", produces = { "application/json", "application/xml" })
	public ResponseEntity<HttpStatus> emailWinners(@RequestBody WinnerTeam team) throws JsonParseException, JsonMappingException, IOException {
		String hackName = team.getHackName();
		Boolean isWinner = team.getIsWinner();
		List<String> emails = team.getEmails();

		String subject="Results announced for Hackathon \"" + hackName + "\"!";
		String msg="Hi there!\n\nResults for Hackathon " + hackName + " are now available online!\n\n" 
					+ "Please login to http://54.69.212.178:3000/ to view results."
					+ "\n\nBest Regards,\nTeam Openhack";
		
		if(isWinner) {
			subject="Congratulations! You have won the Hackathon \"" + hackName + "\" !!!";
			msg="Hi there!"
					+ "\n\nCongratulations on winning the \"" + hackName + "\" hackathon!\n"
					+ "\n\nThe hackathon results are now available online!\n\n" 
					+ "Please login to 	http://54.69.212.178:3000/ to view results."
					+ "\n\nBest Regards,\nTeam Openhack";
		}
		
		for(String e: emails)
			mailService.sendMail(e, subject, msg);
		
		return ResponseEntity.ok().build();
	}
}

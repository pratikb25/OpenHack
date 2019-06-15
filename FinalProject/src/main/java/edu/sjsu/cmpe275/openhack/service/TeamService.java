package edu.sjsu.cmpe275.openhack.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.openhack.model.Team;
import edu.sjsu.cmpe275.openhack.model.User;
import edu.sjsu.cmpe275.openhack.repository.TeamRepository;

/**
 * 
 * @author pratikb
 *
 */
@Service
public class TeamService {
	
	@Autowired
	TeamRepository teamRepository;
	
	public List<Team> getAllTeams() {
		List<Team> teamList = new ArrayList<Team>();
		teamRepository.findAll().forEach(teamList::add);
		return teamList;
	}
	
	public Team getTeamById(Long id) {
		return teamRepository.findOne(id);
	}
	
	public void addTeam(Team t) {
		teamRepository.save(t);
	}
	
	public void deleteTeamById(Long Id) {
		teamRepository.delete(Id);
	}
	
	public void updateTeam(Team t) {
		teamRepository.save(t);
	}

	public Team getTeamByHackathonId(Long hackId) {
		Team team=null;
//	    Query query = entityManager.createQuery("from User as u WHERE u.screenName=:name");
//	    query.setParameter("name",screenName);
//	    System.out.println(query.getParameterValue("name"));
//	    try {
//	    	user =  (User) query.getSingleResult();
//	    } catch (Exception e) {
//	        System.out.println("Here! Inside get profile");
//	    }
	 return team;
	}

}

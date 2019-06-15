package edu.sjsu.cmpe275.openhack.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.sjsu.cmpe275.openhack.model.Hackathon;
import edu.sjsu.cmpe275.openhack.model.User;
import edu.sjsu.cmpe275.openhack.repository.HackathonRepository;

/**
 * 
 * @author pratikb
 *
 */

@Service
public class HackathonService {

	@Autowired
	private HackathonRepository hackathonRepository;
	
	@Autowired
	private EntityManager entityManager;
	
	/**
	 * Fetches all hackathons
	 * @return List of hackathons
	 */
	public List<Hackathon> getAllHackathons() {
		List<Hackathon> hackList = new ArrayList<Hackathon>();
		hackathonRepository.findAll().forEach(hackList::add);
		return hackList;
	}
	
	
	/**
	 * Get hackathon by hackathon ID
	 * @param id
	 * @return hackathon object
	 */
	public Hackathon getHackathonById(Long id) {
		return hackathonRepository.findOne(id);
	}
	
	public void addHackathon(Hackathon obj) {
		hackathonRepository.save(obj);
	}
	
	public void deleteHackathonById(Long id) {
		hackathonRepository.delete(id);
	}
	
	@SuppressWarnings("unchecked")
	public List<Hackathon> getAllFutureOngoingHackathons() {
		Query query = entityManager.createQuery("from Hackathon where curdate() between startDate AND endDate OR curdate()<=startDate");
	    return  (List<Hackathon>) query.getResultList();
	}
	
	public List<Hackathon> getHackathonByAdminId(Long userId) throws Exception {
		List<Hackathon> results = new ArrayList<Hackathon>();
		for(Hackathon h: getAllHackathons()) {
			if(h.getAdminId() == userId)
				results.add(h);
		}
		return results;
	}
	
	public Hackathon getHackByName(String screenName) {

		Hackathon hack = null;
	    Query query = entityManager.createQuery("from Hackathon as u WHERE u.name=:name");
	    query.setParameter("name",screenName);
	    System.out.println(query.getParameterValue("name"));
	    try {
	    	hack =  (Hackathon) query.getSingleResult();
	    } catch (Exception e) {
	        System.out.println("Here! Inside get profile");
	    }
	 return hack;
	}
}


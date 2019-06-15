package edu.sjsu.cmpe275.openhack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.sjsu.cmpe275.openhack.model.Hackathon;

/**
 * 
 * @author pratikb
 *
 */
public interface HackathonRepository extends JpaRepository<Hackathon, Long> {	
	
}
